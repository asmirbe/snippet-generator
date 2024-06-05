import * as _ from "underscore";

type Checker = {
	pattern: RegExp;
	points: number;
	nearTop?: boolean;
};

type LanguageCheckers = {
	[key: string]: Checker[];
};

const languages: LanguageCheckers = {
	JavaScript: [
		// types
		{ pattern: /(\bstring\b|\bnumber\b|\bboolean\b|\bundefined\b|\bnull\b|\bobject\b|\bsymbol\b|\bfunction\b)/, points: 5 },
		// undefined keyword
		{ pattern: /undefined/g, points: 2 },
		{ pattern: /document\.(getElementById|getElementsByClassName|getElementsByTagName|querySelector|querySelectorAll)/,  points: 5 },
		{ pattern: /document\.(createElement|createTextNode|appendChild|removeChild)/,  points: 5 },
		{ pattern: /\.(addEventListener|removeEventListener|setAttribute|removeAttribute|style)\(/,  points: 5 },
		// console.log('foo')
		{ pattern: /console\.log( )*\(/, points: 2 },
		// Variable declaration
		{ pattern: /(var|const|let)( )+\w+( )*=?/, points: 2 },
		// Array/Object declaration
		{ pattern: /(('|").+('|")( )*|\w+):( )*[{[]/, points: 2 },
		// === operator
		{ pattern: /===/g, points: 1 },
		// !== operator
		{ pattern: /!==/g, points: 1 },
		// Function definition
		{ pattern: /function\*?(( )+[$\w]+( )*\(.*\)|( )*\(.*\))/g, points: 1 },
		// null keyword
		{ pattern: /null/g, points: 1 },
		// lambda expression
		{ pattern: /\(.*\)( )*=>( )*.+/, points: 1 },
		// (else )if statement
		{ pattern: /(else )?if( )+\(.+\)/, points: 1 },
		// while loop
		{ pattern: /while( )+\(.+\)/, points: 1 },
		// React JSX
		{ pattern: /import .*react|React\.createElement|className=/, points: 5 },
		// Angular
		{ pattern: /import .*@angular|@Component\(/, points: 5 },
		// Vue
		{ pattern: /import .*vue|new Vue\(/, points: 5 },
		// jQuery
		{ pattern: /import .*jquery|\$\(/, points: 5 },
		// AJAX
		{ pattern: /import .*ajax|\.ajax\(/, points: 5 },
		// Promises
		{ pattern: /import .*promise|\.then\(/, points: 5 },
		// async/await
		{ pattern: /import .*async|async |await /, points: 5 },
		// Node.js
		{ pattern: /import .*('|")http('|")|req(uire)?\(('|")http('|")\)|import .*fs/, points: 5 },
		// C style variable declaration.
		{ pattern: /(^|\s)(char|long|int|float|double)( )+\w+( )*=?/, points: -1 },
		// pointer
		{ pattern: /(\w+)( )*\*( )*\w+/, points: -1 },
		// HTML <script> tag
		{ pattern: /<(\/)?script( type=('|")text\/javascript('|"))?>/, points: -50 },
		// Let & Const
		{ pattern: /(let|const)( )+\w+( )*=?/, points: 5 },
		// CommonJS require
		{ pattern: /require\(.+\)/, points: 5 },
		// ES6 import
		{ pattern: /import .+ from ('|").+('|")/, points: 5 },
	],
	HTML: [
		{ pattern: /<!DOCTYPE (html|HTML PUBLIC .+)>/, points: 2, nearTop: true },
		// Tags
		{ pattern: /<[a-z0-9]+(( )*[\w]+=('|").+('|")( )*)?>.*<\/[a-z0-9]+>/g, points: 2 },
		// Properties
		{ pattern: /[a-z-]+=("|').+("|')/g, points: 2 },
		// PHP tag
		{ pattern: /<\?php/, points: -50 },
		// HTML5 doctype
		{ pattern: /<!doctype html>/i, points: 5, nearTop: true },
		// Common HTML5 elements
		{ pattern: /<(header|nav|main|section|article|aside|footer)>/g, points: 3 },
	],
	CSS: [
		// Properties
		{ pattern: /[a-z-]+:(?!:).+;/, points: 2 },
		// <style> tag from HTML
		{ pattern: /<(\/)?style>/, points: -50 },
		// @media queries
		{ pattern: /@media[^{]+\{/g, points: 5 },
		// CSS3 animations
		{ pattern: /@keyframes[^{]+\{|animation:[^;]+;/g, points: 5 },
	],
	Unknown: [
		// Generic control structures
		{ pattern: /(if|else|while|for|switch|break|continue)\W/, points: 1 },
		// Generic OO keywords
		{ pattern: /(class|interface|extends|implements|public|private|protected|function|return)\W/g, points: 1 },
		// Generic FP keywords
		{ pattern: /(def |fn |func |lambda |=>|\|>|\(\))/, points: 1 },
	],
};

function getPoints(_language: string, lineOfCode: string, checkers: { pattern: RegExp; points: number }[]) {
	return _.reduce(
		_.map(checkers, (checker) => {
			if (checker.pattern.test(lineOfCode)) {
				return checker.points;
			}
			return 0;
		}),
		(memo, num) => memo + num,
		0
	);
}

function tokenize(code: string): string[] {
	// return Array.from(jsTokens(code), (token) => token.value);
	return code.split("\n");
}

export function detectLang(snippet: string, options?: { heuristic?: boolean; statistics?: boolean }) {
	if(options?.statistics) console.log("Input snippet:", snippet);
	const opts = _.defaults(options || {}, {
			heuristic: true,
			statistics: false,
	});

	let linesOfCode = tokenize(snippet);
	if(options?.statistics) console.log("Tokenized lines of code:", linesOfCode);

	function nearTop(index: number) {
			if (linesOfCode.length <= 10) {
					return true;
			}
			return index < linesOfCode.length / 10;
	}

	if (opts.heuristic && linesOfCode.length > 500) {
			linesOfCode = _.filter(linesOfCode, (_lineOfCode, index) => {
					if (nearTop(index)) {
							return true;
					}
					return index % Math.ceil(linesOfCode.length / 500) === 0;
			});
	}

	const pairs = _.map(_.keys(languages), (key) => ({
			language: key,
			checkers: languages[key],
	}));

	const results = _.map(pairs, ({ language, checkers }) => {
			if (language === "Unknown") {
					return { language: "Unknown", points: 1 };
			}

			const pointsList = _.map(linesOfCode, (lineOfCode) => {
					return getPoints(language, lineOfCode, checkers);
			});

			const points = _.reduce(pointsList, (memo, num) => memo + num, 0);

			return { language, points };
	});

	if(options?.statistics) console.log("Language scores:", results);

	const bestResult = _.max(results, (result) => result.points) as { language: string; points: number };
	if(options?.statistics) console.log("Best result:", bestResult);

	if (opts.statistics) {
			const statistics = _.map(results, ({ language, points }) => [language, points] as [string, number]);
			statistics.sort((a, b) => b[1] - a[1]);
			return { detected: bestResult.language, statistics };
	}

	return bestResult.language;
}