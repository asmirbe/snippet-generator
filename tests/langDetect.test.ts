import { detectLang } from '../src/langDetect';
import { describe, expect, test } from "vitest";

describe('Language Detection', () => {
  test('should detect JavaScript', () => {
    const jsSnippet = ['const foo = "bar";',
						'console.log(foo);',
						`const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);`,
						`const arr = [1, 2, 3, 4, 1, 2, 1, 1];`,
						`const defer = (fn, ...args) => setTimeout(fn, 1, ...args);`,
						`const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args);`,
						`const isBrowser = () => ![typeof window, typeof document].includes('undefined');`,
						`Promise.all([ promise_1, promise_2 ]).then((values) => {
							// all input Promises resolved
			}).catch((reason) => {
							// one of input Promises rejected
			});`
				];
    // jsSnippet.forEach((line) => {
				// 		expect(detectLang(line)).toBe('JavaScript');
				// });
				jsSnippet.forEach((line) => {
					expect(detectLang(line)).toBe('JavaScript');
			});
  });

  // test('should detect CSS', () => {
  //   const cssSnippet = `
  //     body {
  //       background-color: #f0f0f0;
  //     }
  //   `;
  //   expect(detectLang(cssSnippet)).toBe('CSS');
  // });

  // test('should detect HTML', () => {
  //   const htmlSnippet = `
  //     <!DOCTYPE html>
  //     <html>
  //     <head>
  //       <title>Page Title</title>
  //     </head>
  //     <body>
  //       <h1>This is a Heading</h1>
  //       <p>This is a paragraph.</p>
  //       <p>This is another paragraph.</p>
  //     </body>
  //     </html>
  //   `;
  //   expect(detectLang(htmlSnippet)).toBe('HTML');
  // });
});