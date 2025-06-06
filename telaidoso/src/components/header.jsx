import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import '../styles/header.css';

export default function Header({ darkMode, setDarkMode }) {
  return (
    
    <header className={darkMode ? 'header dark' : 'header'}>
      <div className="logo">
        <svg
          className="logo-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span className="text">Senior+</span>
      </div>

      <div className="actions">
        <button onClick={() => setDarkMode(!darkMode)} className="icon-button">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-button">
          <Bell size={20} />
        </button>
        <div className="profile">CG</div>
      </div>
    </header>
  );
}
