import React, { useState } from 'react';
import { FaHome, FaCogs, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa'; // Importing icons
import './Navbar.css';
import ImageGallery from '../components/ImageGallery';
import logo from '../assets/nethra-white.png'
import cctv from '../assets/cctv.png'
import Service from '../components/Services';
import FAQ from '../components/Faq';
import Footer from '../components/Foooter';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const loginAction = () => {
    navigate('/login');
  };

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

  // Navigation functions for the new buttons
  const goToSinglePic = () => {
    navigate('/singlepic');
  };

  const goToDoublePic = () => {
    navigate('/doublepic');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-container" >
        <div className="navbar-left">
          <button className="menu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <img src={logo} alt="logo" style={{ width: '225px', height: '65px' }} />
        </div>
        <div className="grid grid-cols-2 justify-center items-center gap-4">
          <button onClick={signupAction} className='bg-transparent border border-white rounded hover:scale-105 hover:text-[#0e1a27] hover:bg-white hover:border-[#0e1a27] hover:font-bold p-2'>Sign Up</button>
          <button onClick={loginAction} className='hover:bg-transparent hover:text-white border hover:border-white rounded hover:scale-105 text-[#0e1a27] bg-white border-[#0e1a27] font-bold p-2'>Log In</button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`mt-5 sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
        <p className={`typing-effect ${isSidebarOpen ? 'text-3xl ml-60' : ''} transition-all duration-300`} style={{marginTop: '-140px'}}>
          <span className="vibrant-text">N</span>eural <span className="vibrant-text">E</span>ngine for <span className="vibrant-text">T</span>racking <span className="vibrant-text">H</span>umans and <span className="vibrant-text">R</span>ecording <span className="vibrant-text">A</span>ttendance
        </p>
      </div>

      <div
        id="Image"
        className="section"
        style={{
          height: '10vh',
          padding: '20px',
          transition: 'margin-left 0.3s ease', // Smooth transition
          marginLeft: isSidebarOpen ? '220px' : '0',
          marginTop: '-120px' // Dynamically adjust margin based on sidebar state
        }}
      >
        <ImageGallery />
        
      </div>
      <div
        id="image-buttons"
        className=""
        style={{ padding: '', textAlign: 'center', marginTop: '200px' }}
      >
        <button
          onClick={goToSinglePic}
          className="bg-transparent border text-white border-white rounded hover:scale-105 hover:text-[#0e1a27] hover:bg-white hover:border-[#0e1a27] hover:font-bold p-4 mb-0"
        >
          Try with Single Image
        </button>
        <br /> <br/>
        <button
          onClick={goToDoublePic}
          className="bg-transparent border text-white border-white rounded hover:scale-105 hover:text-[#0e1a27] hover:bg-white hover:border-[#0e1a27] hover:font-bold p-4"
        >
          Try with Two Pictures
        </button>
      </div> 

      

      <div
        id="services"
        className="section"
        style={{ height: '100vh', padding: '10px', marginTop: '-200px' }}
      >
        <Service />
      </div>

      <div
        id="FAQ"
        className="section"
        style={{ height: '60vh', padding: '20px', marginTop: '-50px' }}
      >
        <FAQ />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
