import React, { useState } from 'react';

const VolunteerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/volunteer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        // You may store the token: data.token
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div>
      <h2>Volunteer Login</h2>
      <form onSubmit={handleSubmit}>
        {/* ...existing form styling, if any... */}
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      { message && <p>{message}</p> }
    </div>
  );
};

export default VolunteerLogin;
