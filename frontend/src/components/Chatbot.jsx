// import React, { useState } from "react";
// import "../App.css";
// import Header from "./HeaderComponents/Header";

// const SmartAssistant = () => {
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hello! I'm your Smart Assistant 🤖. How can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");

//   const handleSend = () => {
//     if (!input.trim()) return;

//     // Add user message
//     const newMessages = [...messages, { sender: "user", text: input }];
//     setMessages(newMessages);

//     // Mock bot reply
//     setTimeout(() => {
//       setMessages(prev => [
//         ...prev,
//         { sender: "bot", text: "Got it! (This is a demo response, you can connect me to an API later)" }
//       ]);
//     }, 1000);

//     setInput("");
//   };

//   return (
//     <div>
//       <Header/>
//       <div className="chat-container">
//         <div className="chat-box">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               {msg.text}
//             </div>
//           ))}
//         </div>
//         <div className="chat-input">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             placeholder="Type a message..."
//           />
//           <button onClick={handleSend}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SmartAssistant;




// import React, { useState } from "react";
// import "../App.css";
// import Header from "./HeaderComponents/Header";

// const SmartAssistant = () => {
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hello! I'm your Smart Assistant 🤖. How can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");
  
//   // 🔑 Replace this with your actual Gemini API key
//   const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     // Add user message to chat
//     const newMessages = [...messages, { sender: "user", text: input }];
//     setMessages(newMessages);
//     setInput("");

//     try {
//       // Call Gemini API
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             contents: [{ parts: [{ text: input }] }],
//           }),
//         }
//       );

//       const data = await response.json();

//       // Gemini API response text is usually in data.candidates[0].content or data.contents
//       // const botReply =
//       //   data.candidates?.[0]?.content?.[0]?.text ||
//       //   data.contents?.[0]?.parts?.[0]?.text ||
//       //   "Sorry, I didn't get that.";
//       const botReply =
//         data.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "Sorry, I didn't get that.";

//       setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
//     } catch (error) {
//       console.error("Error calling Gemini API:", error);
//       setMessages(prev => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
//       ]);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="chat-container">
//         <div className="chat-box">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               {msg.text}
//             </div>
//           ))}
//         </div>
//         <div className="chat-input">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             placeholder="Type a message..."
//           />
//           <button onClick={handleSend}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SmartAssistant;


import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // ✅ Import react-markdown
import "../App.css";
import Header from "./HeaderComponents/Header";

const SmartAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your Smart Assistant 🤖. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] }),
        }
      );

      const data = await response.json();

      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I didn't get that.";

      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <div>
      <Header />
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown> // ✅ Render bot messages as Markdown
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default SmartAssistant;

