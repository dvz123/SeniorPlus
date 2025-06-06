"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "../contexts/UserContext"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext" 
import "../styles/ChatModal.css"

function ChatModal({ isOpen, onClose }) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const { elderlyData, isCareGiver } = useUser()
    const { currentUser } = useAuth()
    const { darkMode } = useTheme() 

    const initialMessages = []

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages(initialMessages)
        }
    }, [isOpen])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const message = {
            id: Date.now(),
            sender: isCareGiver() ? "caregiver" : "elderly",
            message: newMessage.trim(),
            timestamp: new Date().toISOString(),
            read: false,
        }

        setMessages((prev) => [...prev, message])
        setNewMessage("")
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return "Hoje"
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Ontem"
        } else {
            return date.toLocaleDateString("pt-BR")
        }
    }

    const groupMessagesByDate = (messages) => {
        const groups = {}
        messages.forEach((message) => {
            const date = formatDate(message.timestamp)
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(message)
        })
        return groups
    }

    if (!isOpen) return null

    const messageGroups = groupMessagesByDate(messages)
    const recipientName = elderlyData?.name || "Idoso"

    return (
        <div
            className="chat-modal-overlay"
            data-theme={darkMode ? "dark" : "light"}
            onClick={onClose}
        >
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="chat-avatar">
                            <div className="avatar-circle">{recipientName.charAt(0).toUpperCase()}</div>
                            <div className="online-indicator"></div>
                        </div>
                        <div className="chat-user-info">
                            <h3>{recipientName}</h3>
                            <span className="chat-status">Online</span>
                        </div>
                    </div>
                    <button className="chat-close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Mensagens */}
                <div className="chat-messages">
                    {Object.entries(messageGroups).map(([date, dayMessages]) => (
                        <div key={date}>
                            <div className="chat-date-separator"><span>{date}</span></div>
                            {dayMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`chat-message ${
                                        message.sender === (isCareGiver() ? "caregiver" : "elderly") ? "sent" : "received"
                                    }`}
                                >
                                    <div className="message-bubble">
                                        <p>{message.message}</p>
                                        <div className="message-info">
                                            <span className="message-time">{formatTime(message.timestamp)}</span>
                                            {message.sender === (isCareGiver() ? "caregiver" : "elderly") && (
                                                <div className="message-status">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                        className={message.read ? "read" : ""}
                                                    >
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chat-message received">
                            <div className="message-bubble typing">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="chat-input"
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            className="chat-send-button"
                            disabled={!newMessage.trim()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m22 2-7 20-4-9-9-4Z" />
                                <path d="M22 2 11 13" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatModal
