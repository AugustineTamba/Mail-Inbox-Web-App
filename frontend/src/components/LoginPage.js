import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      if (!email || !password) {
        setMessage("Please enter both email and password");
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/login',
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      if (response.data.User) {
        sessionStorage.setItem('userId', response.data.User._id);
        sessionStorage.setItem('loggedIn', true);
        setMessage(response.data.message);
        navigate('/usermail');
        window.location.reload(); 
      } else {
        setMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please try again later.');
    }
  };

  return (
    <div>
      <h3>Sign In</h3>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-3">
        {message && <p className="text-danger">{message}</p>}
      </div>

      <div className="d-grid">
        <button onClick={login} className="btn btn-primary">
          Login
        </button>
      </div>
      <p className="forgot-password text-right">
        Don't have an account? <a href="/sign-up">Sign up</a>
      </p>
      <p className="forgot-password text-right">
        Forgot <a href="/reset">password?</a>
      </p>
    </div>
  );
}

export default LoginPage;
