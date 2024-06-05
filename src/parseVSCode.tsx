import { html } from "common-tags";
import { getSnippet } from "./utils";
const parseVSCode = (
  description: string,
  tabtrigger: string,
  snippet: string,
) => {

  // split lines by line-break
		const text: string[] = snippet.split('\n');
  // format the snippet lines using getSnippet
  const formattedSnippet = getSnippet(text);

  // prettier-ignore
  return html`
    "${description}": {
      "prefix": "${tabtrigger}",
      "body": [
        ${formattedSnippet}
      ],
      "description": "${description}"
    }
  `;
};

export default parseVSCode;