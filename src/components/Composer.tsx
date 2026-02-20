import { useState } from "react";
import type { Composer as ComposerModel, Theme } from "../types/chat";

interface ComposerProps {
  composer: ComposerModel;
  theme: Theme;
  inputEnabled?: boolean;
  onSend?: (text: string) => void;
}

export function Composer({ composer, theme, inputEnabled, onSend }: ComposerProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !onSend) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="composer">
      <svg className="attach" viewBox="0 0 20 17" preserveAspectRatio="none" aria-hidden="true">
        <path d={composer.attachPath} fillRule="evenodd" clipRule="evenodd" fill={theme.icon} />
      </svg>

      {inputEnabled ? (
        <input
          className="input input-active"
          type="text"
          placeholder="Напиши сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="input">{composer.placeholder}</div>
      )}

      <svg className="send" viewBox="0 0 40 40" preserveAspectRatio="none" aria-hidden="true" onClick={inputEnabled ? handleSend : undefined} style={inputEnabled ? { cursor: "pointer" } : undefined}>
        <path d={composer.sendBgPath} fill={inputEnabled && text.trim() ? "#FE6948" : theme.sendBg} />
        <path d={composer.sendArrowPath} fill={inputEnabled && text.trim() ? "#ffffff" : theme.icon} />
      </svg>

      <div className="home" />
    </footer>
  );
}
