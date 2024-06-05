const Info = () => {

  const platformKey = navigator.platform === "MacIntel" ? "⌘" : "ctrl";

  return (
    <p className="app__info">
      To declare a placeholder ({platformKey} + i):{" "}
      <span className="app__infoselect">{"${1:example}"}</span> |{" "}
      <a
        className="app__infolink"
        target="_blank"
								href="https://code.visualstudio.com/docs/editor/userdefinedsnippets"
        rel="noopener noreferrer"
      >
        More info
      </a>
    </p>
  );
};

export default Info;
