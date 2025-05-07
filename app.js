import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'; 


function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
      });

      if (response.data.success) {
        onLogin();
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred while logging in');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="form-nav">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

function RegisterPage({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/register', {
        username,
        password,
      });

      if (response.data.success) {
        onRegister();
      } else {
        setError('Username already exists');
      }
    } catch (error) {
      setError('An error occurred while registering');
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p className="form-nav">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}


function TranslationPage() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
    const data = { text, sourceLang, targetLang };
    try {
      const response = await axios.post('http://127.0.0.1:5000/translate', data);
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Error translating:', error);
    }
  };

  return (
    <div className="translate-page">
      <h1>Language Translator</h1>
      <div>
        <label>Source Language</label>
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
          <option value="pa">Punjabi</option> 
        </select>
      </div>
      <div>
        <label>Target Language</label>
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          <option value="es">Spanish</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
          <option value="pa">Punjabi</option> 
        </select>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <button onClick={handleTranslate}>Translate</button>

      {translatedText && <div className="translated-text">Translated Text: {translatedText}</div>}
    </div>
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/translate" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/translate" /> : <RegisterPage onRegister={handleRegister} />} />
        <Route path="/translate" element={isLoggedIn ? <TranslationPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;