import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const { onSent, previousPrompts, setInput, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setInput(prompt); // Set the input to the clicked prompt
    await onSent(prompt); // Call onSent with the prompt
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          src={assets.menu_icon}
          alt="menu-icon"
          className="menu"
          onClick={() => setOpen((prev) => !prev)}
        />

        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="plus-icon" />
          {open && <p>New Chat</p>}
        </div>

        {open && (
          <div className="recent">
            <p className="recent-title">Recent</p>

            {previousPrompts.length === 0 ? (
              <p>No recent prompts</p>
            ) : (
              previousPrompts.map((item, index) => (
                <div
                  onClick={() => loadPrompt(item)}
                  key={index}
                  className="recent-entry"
                >
                  <img src={assets.message_icon} alt="message-icon" />
                  <p>{item.length > 18 ? `${item.slice(0, 18)}...` : item}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="question-icon" />
          {open && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="history-icon" />
          {open && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="settings-icon" />
          {open && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
