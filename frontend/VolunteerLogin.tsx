import React, { useState } from 'react';

// Define an interface for the expected response data
interface ResponseData {
  message?: string;
  token?: string;
  user?: any;
}

const VolunteerLogin = () => {
  // State variables for email, password, and feedback message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    try {
      // Send POST request to the login API
      const response = await fetch('http://localhost:5000/api/volunteer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data: ResponseData = {};
      const text = await response.text(); // Get response body as text

      // Handle different response scenarios
      if (response.status !== 204) { // Skip parsing if 204 No Content
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json') && text) {
          try {
            data = JSON.parse(text) as ResponseData; // Parse JSON if applicable
          } catch (parseError) {
            console.error('Login error:', parseError);
            setMessage('Error parsing server response');
            return;
          }
        } else if (text) {
          setMessage(`Received non-JSON response: ${text}`);
          return;
        } else {
          setMessage('No response data received');
          return;
        }
      }

      // Check if the response was successful
      if (response.ok) {
        setMessage(data.message || 'Login successful');
        if (data.token) {
          localStorage.setItem('volunteerToken', data.token); // Store token
          // Add redirection logic here, e.g., to a dashboard
        }
      } else {
        setMessage(data.message || `Login failed (${response.status})`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error connecting to server');
    }
  };

  // Render the login form
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
      {message && <p>{message}</p>} {/* Display feedback message */}
    </div>
  );
};

export default VolunteerLogin;