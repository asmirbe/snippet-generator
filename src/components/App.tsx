import Header from "./Header";
import Input from "./Input";
import Output from "./Output";

const App = () => {
	return (
		<div className={`app app--vscode`}>
			<Header />
			<div className="app__main">
				<Input />
				<Output />
			</div>
		</div>
	);
};

export default App;
