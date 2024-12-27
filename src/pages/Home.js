import React, { useState } from 'react';
import { FaHome, FaCogs, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa'; // Importing icons
import './Navbar.css';
import ImageGallery from '../components/ImageGallery';
import Service from '../components/Services';
import FAQ from '../components/Faq';
import Footer from '../components/Foooter';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate=useNavigate();
  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const loginAction =()=>{
    navigate('/login');
  }
  const signupAction = () => {
    navigate('/signup');
  };
  // Scroll function for the sidebar links
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSidebarOpen(false); // Close sidebar after clicking
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-container" >
        <div className="navbar-left">
          <button className="menu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="logo">
            astica <span>ai</span>
          </div>
        </div>
        <div className="navbar-right">
          <button onClick={signupAction}>Sign Up</button>
          <button onClick={loginAction}>Log In</button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="sidebar-links">
          <li onClick={() => scrollToSection('home')}>
            <FaHome size={20} className="sidebar-icon" /> Home
          </li>
          <li onClick={() => scrollToSection('services')}>
            <FaCogs size={20} className="sidebar-icon" /> Services
          </li>
          <li onClick={() => scrollToSection('FAQ')}>
            <FaQuestionCircle size={20} className="sidebar-icon" /> FAQ
          </li>
        </ul>
      </div>

      {/* Sections */}
      <div
        id="home"
        className="section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(70vh - 80px)', // Adjust height to account for navbar
          padding: '20px',
        }}
      >
        <div
          className="hello-world"
          style={{ textAlign: 'center', marginTop: '-50px' }}
        >
          <div className="logo">
            <img
              src="/logo3.webp" // Replace with your logo URL
              alt="Astica Logo"
              style={{ width: '50px' }}
            />
          </div>
          <h1>Hello, world!</h1>
          <p>
            Welcome to <strong>astica ai</strong>. Discover our Object detection
            capability
          </p>
        </div>
        {/* Image Gallery moved here */}
      </div>
      <div
        id="Image"
        className="section"
        style={{
          height: '10vh',
          padding: '20px',
          transition: 'margin-left 0.3s ease', // Smooth transition
          marginLeft: isSidebarOpen ? '220px' : '0', // Dynamically adjust margin based on sidebar state
        }}
      >
        <ImageGallery />
      </div>
      <div
        id="services"
        className="section"
        style={{ height: '100vh', padding: '10px' }}
      >
        <Service />
      </div>

      <div
        id="FAQ"
        className="section"
        style={{ height: '60vh', padding: '20px' }}
      >
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
