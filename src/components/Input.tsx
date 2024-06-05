import { useContext } from "react";
import { Context } from "./Context";
import Info from "./Info";
import { detectLang } from "../langDetect";
import * as prettier from 'prettier/standalone';
import * as htmlParser from 'prettier/parser-html';
import * as parserCss from 'prettier/parser-postcss';
import * as parserBabel from 'prettier/parser-babel';
import * as prettierPluginEstree from "prettier/plugins/estree";

const Input = () => {
	const context = useContext(Context);

	const handleFormat = async () => {

		// const language = context.lang;
		const language = detectLang(context.snippet, { heuristic: true, statistics: false })
		let formattedCode = context.snippet;

		try {
			switch (language) {
				case 'HTML':
					formattedCode = await prettier.format(context.snippet, {
						parser: 'html',
						plugins: [htmlParser],
						tabWidth: 2,
						bracketSameLine: true,
						htmlWhitespaceSensitivity: 'ignore',
						bracketSpacing: false,
					});

					// formattedCode = formattedCode.replace(/\n/g, '');
					break;
				case 'JavaScript':
					formattedCode = await prettier.format(context.snippet, {
						parser: 'babel',
						plugins: [parserBabel, prettierPluginEstree],
						semi: true,
						singleQuote: true,
						trailingComma: 'all',
					});
					break;
				case 'CSS':
					formattedCode = await prettier.format(context.snippet, {
						parser: 'css',
						plugins: [parserCss],
					});
					break;
				default:
					// Handle the case when the language is not recognized
					console.log(`Prettier - [Unsupported language] : ${language}`);
					// You can choose to assign a default value to formattedCode or throw an error
					formattedCode = context.snippet; // Assign the original snippet as the formatted code
					break;
			}
		} catch (error) {
			return;
		}


		context.setSnippet(formattedCode);
	};

	return (
		<div className="app__half">
			<div className="app__halftop">
				<input
					type="text"
					className="app__input"
					name="description"
					placeholder="Description…"
					value={context.description}
					onChange={(e) => context.setDescription(e.target.value)}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck="false"
				/>
				<input
					type="text"
					className="app__input"
					name="tabTrigger"
					placeholder="Tab trigger…"
					value={context.tabTrigger}
					onChange={(e) => context.setTabTrigger(e.target.value)}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck="false"
				/>
				<button className="app__prettier app__input" onClick={handleFormat}>Format Code</button>

			</div>
			<div className="app__halfbottom">
				<textarea
					// ref={context?.textareaRef}
					className="app__textarea"
					name="snippet"
					placeholder="Your snippet…"
					value={context.snippet}
					onChange={(e) => context.setSnippet(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Tab") {
							e.preventDefault();

							const initialSelectrionStart = e.currentTarget.selectionStart;
							const initialSelectrionEnd = e.currentTarget.selectionEnd;
							const stringBeforeCaret = e.currentTarget.value.substring(
								0,
								initialSelectrionStart,
							);
							const stringAfterCaret = e.currentTarget.value.substring(
								initialSelectrionEnd,
								initialSelectrionEnd + e.currentTarget.textLength,
							);

							const newValue = `${stringBeforeCaret}  ${stringAfterCaret}`;

							e.currentTarget.value = newValue;
							e.currentTarget.selectionStart = initialSelectrionStart + 2;
							e.currentTarget.selectionEnd = initialSelectrionStart + 2;

							context.setSnippet(newValue);
						}

						if (
							e.key === "i" &&
							(e.ctrlKey || e.metaKey) &&
							document.activeElement === e.currentTarget
						) {
							e.preventDefault();

							const initialSelectrionStart = e.currentTarget.selectionStart;
							const initialSelectrionEnd = e.currentTarget.selectionEnd;
							const stringBeforeCaret = e.currentTarget.value.substring(
								0,
								initialSelectrionStart,
							);
							const stringAfterCaret = e.currentTarget.value.substring(
								initialSelectrionEnd,
								initialSelectrionEnd + e.currentTarget.textLength,
							);

							const newValue = `${stringBeforeCaret}\${1:example}${stringAfterCaret}`;

							e.currentTarget.value = newValue;
							e.currentTarget.selectionStart = initialSelectrionStart + 4;
							e.currentTarget.selectionEnd = initialSelectrionStart + 11;

							context.setSnippet(newValue);
						}
					}}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck="false"
					wrap="off"
				/>
				<Info />
			</div>
		</div>
	);
};

export default Input;
