import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import "../styles/FamilyChat.css";

const initialMessages = [
  {
    from: "Maria (filha)",
    message: "Oi pai! Como está se sentindo hoje? Te amo! ❤️",
    time: "10:30",
  },
];

const FamilyChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const chatBodyRef = useRef(null); // NOVO: ref para o body do chat

  useEffect(() => {
    // 🔁 Corrigido: rola apenas a div do chat, e não a página toda
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg = {
      from: "Você",
      message: newMessage,
      time: formattedTime,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      inputRef.current?.focus();
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="family-chat-card">
      <div className="family-chat-header">
        <MessageSquare size={20} />
        <span>Mensagens da Família</span>
      </div>

      <div className="family-chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`family-message ${msg.from === "Você" ? "own-message" : ""}`}
          >
            <div className="message-header">
              <p className="from">{msg.from}</p>
            </div>
            <div className="message-content">
              <p>{msg.message}</p>
              <span className="time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="family-chat-input">
        <button
          className="emoji-button"
          title="Emoji"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile size={20} />
        </button>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder="Escreva sua resposta..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <button className="send-button" onClick={handleSendMessage}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default FamilyChat;
