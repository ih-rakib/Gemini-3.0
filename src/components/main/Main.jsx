import { useContext } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  } = useContext(Context);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input) {
      onSent(input); // Call the onSent function with the current input value
      setInput(""); // Optionally clear the input after sending
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p onClick={() => newChat()}>Gemini</p>
        <img src={assets.user_icon1} alt="user-icon" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Orion</span>
              </p>
              <p>How can I help you today? </p>
            </div>
            <div className="cards">
              <div className="card">
                <p>
                  What’s the most underrated technological innovation in
                  history?
                </p>
                <img src={assets.compass_icon} alt="compass-icon" />
              </div>
              <div className="card">
                <p>
                  What do you think would happen if all the world&apos;s data
                  suddenly disappeared?
                </p>
                <img src={assets.bulb_icon} alt="bulb-icon" />
              </div>
              <div className="card">
                <p>
                  If time travel was possible, what’s the first era you’d visit
                  and why?
                </p>
                <img src={assets.message_icon} alt="message-icon" />
              </div>
              <div className="card">
                <p>
                  Do you think we’ll ever have fully sentient AI that can feel
                  emotions?
                </p>
                <img src={assets.code_icon} alt="code-icon" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="result">
              <div className="result-title">
                <img src={assets.user_icon1} alt="user-icon" />
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data">
                <img src={assets.gemini_icon} alt="gemini-icon" />

                {loading ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Add onKeyDown handler here
              value={input}
              type="text"
              placeholder="Enter query..."
            />
            <div>
              <img src={assets.gallery_icon} alt="gallery-icon" />
              <img src={assets.mic_icon} alt="mic-icon" />
              {input && (
                <img
                  onClick={() => onSent(input)}
                  src={assets.send_icon}
                  alt="send-icon"
                />
              )}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info. So verify the resoponses!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
