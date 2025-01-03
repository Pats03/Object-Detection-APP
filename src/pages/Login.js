import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For handling messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:5173/auth/login',
        {
          email,
          password,
        },
        {
          headers: {
            'ngrok-skip-browser-warning': true,
          },
        }
      );
      setMessage(response.data.message || 'Login successful!');
      navigate('/attendance'); // Redirect to attendance page on success
    } catch (error) {
      setMessage(error.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full hover:border hover:border-blue-300">
        <h2 className="text-center text-gray-100 mb-6 text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2 text-gray-300 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="p-3 mb-4 border border-gray-600 rounded-md text-sm bg-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <label className="mb-2 text-gray-300 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="p-3 mb-6 border border-gray-600 rounded-md text-sm bg-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-md text-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes('success') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
