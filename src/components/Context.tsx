import React, { createContext, useEffect, useState } from "react";

interface MyContext {
  description: string;
  tabTrigger: string;
  snippet: string;
  lang: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setTabTrigger: React.Dispatch<React.SetStateAction<string>>;
  setSnippet: React.Dispatch<React.SetStateAction<string>>;
  setLang: React.Dispatch<React.SetStateAction<string>>;
}

const Context = createContext<MyContext>({
  description: "",
  setDescription: () => {},
  tabTrigger: "",
  setTabTrigger: () => {},
  snippet: "",
  setSnippet: () => {},
  lang: "html",
  setLang: () => {},
});

const url = new URL(window.location.href);
const urlDescription = url.searchParams.get("description") || "";
const urlTabtrigger = url.searchParams.get("tabtrigger") || "";
const urlSnippet = url.searchParams.get("snippet") || "";
const urlLang = url.searchParams.get("lang") || "html";

interface ProviderProps {
  children: React.ReactNode;
}

const ContextProvider = ({ children }: ProviderProps) => {
  const [description, setDescription] = useState(urlDescription);
  const [tabTrigger, setTabTrigger] = useState(urlTabtrigger);
  const [snippet, setSnippet] = useState(urlSnippet);
  const [lang, setLang] = useState(urlLang);

  useEffect(() => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("description", description);
    shareUrl.searchParams.set("tabtrigger", tabTrigger);
    shareUrl.searchParams.set("snippet", snippet);
    shareUrl.searchParams.set("lang", lang);

    history.pushState(
      {
        description,
        tabTrigger,
        snippet,
        lang,
      },
      document.title,
      `${location.pathname}?${shareUrl.searchParams}`
    );
  }, [description, tabTrigger, snippet, lang]);

  return (
    <Context.Provider
      value={{
        description,
        setDescription,
        tabTrigger,
        setTabTrigger,
        snippet,
        setSnippet,
        lang,
        setLang,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ContextProvider, Context };