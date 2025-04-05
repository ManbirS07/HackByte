import React, { useState } from 'react';

interface ResponseData {
  message?: string;
  token?: string;
  user?: any;
}

const VolunteerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    
    try {
      // Update URL to match the backend route
      const response = await fetch('http://localhost:3000/api/volunteer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      let data: ResponseData = {};
      
      // Only try to parse JSON if the status is not 204 (No Content)
      if (response.status !== 204) {
        try {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text) as ResponseData;
          }
        } catch (parseError) {
          console.error("Login error:", parseError);
          setMessage('Error parsing server response');
          return;
        }
      }
      
      if (response.ok) {
        setMessage(data.message || 'Login successful');
        console.log('Login successful:', data.user);
        // Store token in localStorage or context
        if (data.token) {
          localStorage.setItem('volunteerToken', data.token);
          // Redirect to dashboard or handle successful login
        }
      } else {
        setMessage(data.message || `Login failed (${response.status})`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error connecting to server');
    }
  };

  return (
    <div>
      <h2>Volunteer Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VolunteerLogin;