// Source @ Sindre Sorhus: https://github.com/sindresorhus/detect-indent
function getMostUsed(a: { [key: string]: [number, number] }): number {
	let b = 0;
	let c = 0;
	let d = 0;
	for (const e in a) {
		const f = a[e];
		const g = f[0];
		const h = f[1];
		if (g > c || (g === c && h > d)) {
			c = g;
			d = h;
			b = Number(e);
		}
	}
	return b;
}

function getIndent(a: string): { amount: number; type: "space" | "tab" | null } {
	if (typeof a !== "string") {
		throw new TypeError("Expected a string");
	}
	let f: [number, number] | undefined;
	let g: boolean;
	let b = 0;
	let c = 0;
	let d = 0;
	const e: { [key: string]: [number, number] } = {};
	a.split(/\n/g).forEach((a) => {
		if (a) {
			let h: number;
			const i = a.match(INDENT_RE);
			if (i) {
				h = i[0].length;
				if (i[1]) {
					c++;
				} else {
					b++;
				}
			} else {
				h = 0;
			}
			const j = h - d;
			d = h;
			if (j) {
				g = j > 0;
				f = e[g ? j : -j];
				if (f) {
					f[0]++;
				} else {
					f = e[j] = [1, 0];
				}
			} else if (f) {
				f[1] += Number(g);
			}
		}
	});
	let i: "space" | "tab" | null = null;
	const h = getMostUsed(e);
	i = h ? (c >= b ? "space" : "tab") : null;
	return { amount: h, type: i };
}

const INDENT_RE = /^(?:( )+|\t+)/;

// Source @ Sindre Sorhus: https://github.com/sindresorhus/repeating
function repeating(a: number, b: string): string {
	let c = "";
	do {
		if (a & 1) {
			c += b;
		}
		b += b;
	} while ((a >>= 1));
	return c;
}

export function getSnippet(lines: string[]): string {
	// Naive monkey 🙉
	let indentAmount: number = 100;
	let indentType: string = "\t";
	for (let i = 0; i < lines.length; i++) {
		const lineIndent = getIndent(lines[i]);
		if (lineIndent.type === "space") {
			indentType = " ";
		}
		if (lineIndent.amount) {
			indentAmount = indentAmount > lineIndent.amount ? lineIndent.amount : indentAmount;
		}
	}
	return lines
		.map((line) => {
			const lineIndent = repeating(indentAmount, indentType);
			const match: RegExpMatchArray | null = line.match(new RegExp(`(${lineIndent})`, "g"));
			const indent = match ? match.join("") : "";
			line = line.replace(new RegExp(lineIndent, "g"), "\t");
			return indent + JSON.stringify(line);
		})
		.join(",\n");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(func: T, timeout = 300): (...args: Parameters<T>) => void {
	let timer: NodeJS.Timeout;
	return (...args: Parameters<T>): void => {
			clearTimeout(timer);
			timer = setTimeout(() => {
					func(...args);
			}, timeout);
	};
}
