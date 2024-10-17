import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState(""); // User input
  const [recentPrompt, setRecentPrompt] = useState(""); // Most recent prompt
  const [previousPrompts, setPreviousPrompts] = useState([]); // History of prompts
  const [promptResults, setPromptResults] = useState({}); // Store prompt-result pairs
  const [showResult, setShowResult] = useState(false); // Flag to show results
  const [loading, setLoading] = useState(false); // Loading state
  const [resultData, setResultData] = useState(""); // Result data

  // Function to handle text display with delay
  const delay = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 70 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  // Function to handle prompt submission
  const onSent = async (prompt) => {
    if (loading) return; // Prevent multiple submissions while loading

    try {
      const currentPrompt = prompt !== undefined ? prompt : input;

      // Check if this prompt has been previously processed
      if (promptResults[currentPrompt]) {
        // If prompt exists, use the cached result
        setResultData(promptResults[currentPrompt]);
        setRecentPrompt(currentPrompt);
        setShowResult(true);
        return;
      }

      // If not cached, proceed to make a new API call
      setResultData(""); // Reset result data
      setLoading(true); // Set loading state
      setShowResult(true); // Show results

      // Call your API with the current prompt
      let response = await run(currentPrompt);

      setRecentPrompt(currentPrompt);
      if (!previousPrompts.includes(currentPrompt)) {
        setPreviousPrompts((prev) => [...prev, currentPrompt]); // Add to history if not already present
      }

      // Process the response
      let responseArray = response.split(/(\*\*|\*|```|`|\n)/);
      let newResponse = "";
      let formatStack = [];
      let inCodeBlock = false;

      // Format the response text
      for (let i = 0; i < responseArray.length; ++i) {
        const part = responseArray[i];

        // Handle bold, italic, code formatting, and newlines
        if (part === "**") {
          if (formatStack.includes("bold")) {
            newResponse += "</b>";
            formatStack = formatStack.filter((tag) => tag !== "bold");
          } else {
            newResponse += "<b>";
            formatStack.push("bold");
          }
        } else if (part === "*") {
          if (formatStack.includes("italic")) {
            newResponse += "</i>";
            formatStack = formatStack.filter((tag) => tag !== "italic");
          } else {
            newResponse += "<i>";
            formatStack.push("italic");
          }
        } else if (part === "```") {
          if (inCodeBlock) {
            newResponse += "</code></pre></div>";
            inCodeBlock = false;
          } else {
            newResponse +=
              '<div class="code-card"><pre><code class="code-block">';
            inCodeBlock = true;
          }
        } else if (part === "`") {
          if (formatStack.includes("code")) {
            newResponse += "</code>"; // Close inline code
            formatStack = formatStack.filter((tag) => tag !== "code");
          } else {
            newResponse += '<code class="inline-code">';
            formatStack.push("code");
          }
        } else if (part === "\n") {
          newResponse += "<br>";
        } else {
          newResponse += part
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        }
      }

      // Close any remaining unclosed tags
      while (formatStack.length) {
        const tag = formatStack.pop();
        if (tag === "bold") newResponse += "</b>";
        else if (tag === "italic") newResponse += "</i>";
        else if (tag === "code") newResponse += "</code>";
      }
      if (inCodeBlock) newResponse += "</code></pre>";

      // Display each word with a delay
      const finalResponse = newResponse.split(" ");
      for (let i = 0; i < finalResponse.length; ++i) {
        delay(i, finalResponse[i] + " ");
      }

      // Cache the result for the prompt
      setPromptResults((prevResults) => ({
        ...prevResults,
        [currentPrompt]: newResponse,
      }));

      setLoading(false);
      setInput(""); // Reset input if necessary
    } catch (error) {
      console.error("Error in sending prompt:", error);
      setLoading(false);
    }
  };

  // Context value to provide
  const contextValue = {
    onSent,
    previousPrompts,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
