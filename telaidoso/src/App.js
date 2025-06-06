import React, { useEffect, useState } from "react";
import Header from "./components/header.jsx"; 
import "./App.css";
import Dashboard from "./Dashboard.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Dashboard darkMode={darkMode} />
      </main>
    </div>
  );
}

export default App;
