import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For handling messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://5a19-124-123-171-114.ngrok-free.app/auth/login',
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
      setMessage(response.data.message || 'Login successful!'); // Display success message
      navigate('/attendance'); // Redirect to attendance page on success
    } catch (error) {
      setMessage(error.response?.data?.error || 'Invalid credentials'); // Display error message
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-cover bg-center bg-fixed bg-[url('./assets/dl.jpeg')]">
      <div className="bg-[#0E1A28] p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-center text-[#f8f4f4] mb-6 text-2xl">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2 text-[#f8f4f4] text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="p-3 mb-4 border border-[#1f1e1e] rounded-md text-sm focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2]"
          />
          <label className="mb-2 text-[#f8f4f4] text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="p-3 mb-6 border border-[#1f1e1e] rounded-md text-sm focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2]"
          />
          <button
            type="submit"
            className="p-3 bg-[#4a90e2] text-white rounded-md text-lg cursor-pointer hover:bg-[#357ab8]"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-[#f8f4f4] mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#4a90e2] hover:underline">
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
