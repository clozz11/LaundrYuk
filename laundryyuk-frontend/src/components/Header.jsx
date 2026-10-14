// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import phoneIcon from '../assets/gg_phone.png'; 
import basketIcon from '../assets/majesticons_basket-2.png'; 

const Header = () => {
    
    // Styling Header Utama
    const headerStyle = {
        backgroundColor: '#A9CFE4', 
        minHeight: '100px',
        padding: '0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        width: '100%', 
        display: 'flex',
        alignItems: 'center', 
    };
    
    // Wrapper Konten (Padding 30px tepi)
    const contentWrapperStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0 30px', 
        boxSizing: 'border-box',
    };

    // Styling Logo "LaundryYuk"
    const logoStyle = { 
        fontSize: '20px', 
        color: '#000000ff', 
        fontWeight: 'bold', 
        display: 'flex', 
        alignItems: 'center',
        
        fontFamily: 'Inter, sans-serif'
    };
    
    // Styling Ikon Keranjang
    const basketIconStyle = {
        width: '40px',
        height: '40px',
        
        // Padding 20px antara teks dan gambar
        marginRight: '20px', 
    };

    const navWrapperStyle = { 
        display: 'flex', 
        alignItems: 'center',
    };
    
    const linkStyle = { 
        textDecoration: 'none', 
        color: '#000000ff', 
        fontSize: '17px', 
        fontWeight: '500',
        transition: 'color 0.3s',
        marginRight: '90px' 
    };

    const contactBtnStyle = {
        width: '220px',
        height: '60px',
        borderRadius: '20px', 
        backgroundColor: '#152B57', 
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: '17px', 
        fontFamily: 'Inter, sans-serif', 
        boxSizing: 'border-box',
    };

    const phoneIconStyle = {
        width: '25px',
        height: '25px',
        marginRight: '10px', 
    };

    return (
        <header style={headerStyle}>
            <div style={contentWrapperStyle}> 
                
                {/* Logo LaundryYuk */}
                <div style={logoStyle}>
                    <img 
                        src={basketIcon} 
                        alt="Basket Icon" 
                        style={basketIconStyle} 
                    />
                    LaundryYuk 
                </div>

                {/* Wrapper Navigasi Utama */}
                <nav style={navWrapperStyle}>
                    <Link to="/" style={linkStyle}>Home</Link>
                    <a href="#services-section" style={linkStyle}>Services</a>
                </nav>

                {/* Kotak Kontak Telepon  */}
                <a href="tel:+6287844237548" style={contactBtnStyle}>
                    <img src={phoneIcon} alt="Phone Icon" style={phoneIconStyle} />
                    +6287844237548
                </a>
                
            </div>
        </header>
    );
};

export default Header;