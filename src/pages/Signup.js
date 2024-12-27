import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css'; // Importing the CSS file for styling

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for handling messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://5a19-124-123-171-114.ngrok-free.app/auth/signup',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            'ngrok-skip-browser-warning': true,
          },
        }
      );
      setMessage(response.data.message || 'Sign Up successful!'); // Display success message
      navigate('/attendance'); // Redirect to home page on success
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error signing up'); // Display error message
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="signup-header">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            className="signup-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {message && (
          <p
            className={`message mt-4 text-center ${
              message.includes('successful') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
        <p className="signup-footer">
          Already have an account?{' '}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
