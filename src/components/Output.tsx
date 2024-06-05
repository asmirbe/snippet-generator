import { Context } from "./Context";
import { useContext, useEffect, useState } from "react";
import parseVSCode from "../parseVSCode";

const parseSnippet = (
	description: string,
	tabTrigger: string,
	snippet: string,
): string => {
	return parseVSCode(snippet, tabTrigger, description);
};

const Output = () => {
	const context = useContext(Context);
	const [savedToClipboard, setSavedToClipboard] = useState(false);

	useEffect(() => {
		setSavedToClipboard(false);
	}, [context]);

	const result = parseSnippet(
		context.snippet,
		context.tabTrigger,
		context.description,
	);

	const writeToClipboard = async () => {
		const type = "text/plain";
		const blob = new Blob([result], { type });
		const data = [new ClipboardItem({ [type]: blob })];
		await navigator.clipboard.write(data);
		setSavedToClipboard(true);
	};

	return (
		<div className="app__half">
			<div className="app__halftop">
			<button className="app__btn app__btncopy" onClick={writeToClipboard}>
						{savedToClipboard ? "Copied" : "Copy snippet"}
					</button>
			</div>
			<div className="app__halfbottom">
				<pre className="app__pre">{result}</pre>
			</div>
		</div>
	);
};

export default Output;
