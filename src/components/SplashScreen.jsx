// SplashScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true); // state baru untuk spinner
  const fullText = "Looadinggg...";

  // Efek ketikan per huruf
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText((prev) => prev + (fullText[i] || ""));
        i++;
      } else {
        clearInterval(typing);
        setIsTyping(false); // selesai mengetik
      }
    }, 150);
    return () => clearInterval(typing);
  }, []);

  // Pindah ke login setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container" style={{justifyContent:'center', alignItems:'center', marginLeft: '100vh', textAlign:'center'}}>
      <div className="splash-content">
        {/* Spinner berhenti muter jika isTyping = false */}
        <div className={`splash-spinner ${isTyping ? "spinning" : ""}`}></div>
        <p className="splash-loading">{displayText || ""}</p>
      </div>
    </div>
  );
};

export default SplashScreen;
