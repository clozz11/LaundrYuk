// src/Home.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/header.jsx'; 
import illustrationImage from './assets/ChatGPT Image Jan 1, 2026, 07_07_20 AM 1.png';
import basketIcon from './assets/majesticons_basket-2.png';
import { useNavigate } from 'react-router-dom';

function Home() {
    
    // State untuk atur pop up
    const [authMode, setAuthMode] = useState(null);
    
    // State untuk menampung data input dari form
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Fungsi untuk mengupdate state saat user mengetik
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Fungsi untuk buka/tutup
    const openRegister = () => setAuthMode('register');
    const openLogin = () => setAuthMode('login');
    const closePopUp = () => setAuthMode(null);

    // Fungsi untuk pindah halaman
    const navigate = useNavigate(); 
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // Fungsi handle input khusus login
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // STYLE UTAMA HERO SECTION
    const heroStyle = {
        backgroundColor: '#A9CFE4', 
        
        color: '#000000ff', 
        
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        
        padding: '0px 30px 0px 0px', 
    };

    // STYLE UNTUK KOLOM TEKS (KIRI)
    const textColumnStyle = {
        flex: 1, 
        paddingRight: '50px',
        maxWidth: '50%', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        transform: 'translateY(-20px)',
    };

    // STYLE JUDUL
    const titleStyle = { 
        fontSize: '70px', 
        fontWeight: 'bold', 
        fontStyle: 'italic',
        margin: '0 0 0 0', 
        lineHeight: '90px',
        paddingLeft: '100px',
        fontFamily: "'Playfair Display', serif",
    };

    // STYLE TOMBOL SIGN UP
    const signUpButtonStyle = { 
        backgroundColor: '#152B57', 
        color: '#ffffff', 
        padding: '20px 80px',
        borderRadius: '20px',
        textDecoration: 'none',
        fontWeight: 'normal',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '20px',
        fontSize: '20px',
        cursor: 'pointer',
        width: 'fit-content',
        marginLeft: '100px', 
    };
    
    // STYLE KOTAK ILUSTRASI (KANAN)
    const illustrationBoxStyle = { 
        flex: 0.5, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '600px', 
        height: '605px', 
        position: 'relative', 
        overflow: 'visible',
    };
    
    const illustrationTextStyle = {
        fontSize: '17px', 
        color: '#000000',
        paddingLeft: '100px',
        fontFamily: "'Inter', serif",
    };

    const imageStyle = {
        position: 'absolute', 
        objectFit: 'contain',   
        width: '100%',
        height: '100%',
        transform: 'translateY(-10px)',
        bottom: '-10px',
        left: '0',
        display: 'block',
        verticalAlign: 'middle',
    };

    // STYLE POP UP
    const overlayStyle = {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
    };

    const popUpBoxStyle = {
        backgroundColor: '#ffffff',
        width: '370px',
        padding: '40px',
        borderRadius: '30px',
        boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
        textAlign: 'center',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        maxHeight: '90vh', 
        overflowY: 'auto',
    };

    const inputStyle = {
        width: '90%',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '15px',
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
        color: '#000000',
    };

    // STYLE KOTAK BIRU BAWAH
    const footerBoxStyle = {
        backgroundColor: '#152B57',
        width: '100%',
        height: '160px',    
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 0',
    };

    const testimonialCardStyle = {
        backgroundColor: '#ffffff',
        color: '#152B57',
        width: '200px',
        height: '100px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center',
        fontSize: '14px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        flexShrink: 0,
    };

    // Data 7 Ulasan
    const reviews = [
        "Layanannya cepat!", "Wanginya tahan lama", "Sangat bersih", 
        "Kurirnya ramah", "Harga terjangkau", "Aplikasi mudah", "Top banget!"
    ];


    // STYLE SECTION SERVICES 
    const servicesSectionStyle = {
        backgroundColor: '#ffffff',
        width: '100%',
        minHeight: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 0',
        fontFamily: "'Schibsted Grotesk', serif",
    };  
    
    const serviceCardContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '50px',
        flexWrap: 'wrap',
    };

    const serviceCardStyle = {
        border: '1px solid #152B57',
        padding: '30px 20px',
        width: '220px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const circleStyle = {
        width: '120px',
        height: '120px',
        backgroundColor: '#D9D9D9',
        borderRadius: '50%',
        marginBottom: '20px',
    };

    const bookNowButtonStyle = {
        backgroundColor: '#152B57',
        color: '#ffffff',
        padding: '15px 20px',
        borderRadius: '20px',
        textDecoration: 'none',
        marginTop: '50px',
        fontWeight: 'bold',
    };
    
    const handleRegisterSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registrasi Berhasil! Silakan Login.");
                setFormData({ username: '', email: '', password: '' });
                setAuthMode('login'); 
            } else {
                alert("Gagal: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan, pastikan backend sudah jalan.");
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: loginData.email, 
                    password: loginData.password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.role === 'admin') {
                    navigate('/admin-dashboard'); 
                } else {
                    navigate('/customer'); 
                }
            } else {
                alert(data.message || "Login Gagal");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Terjadi kesalahan pada server");
        }
    };
    
    return (
        <>
            <Header /> 
            
            <div style={heroStyle}>
                
                {/* Kolom Teks Kiri */}
                <div style={textColumnStyle}>
                    <h1 style={titleStyle}>
                        Malang's<br />
                        First Choice in<br />
                        Cleaning
                    </h1>
                    
                    {/* (Subteks Utama) */}
                    <p style={illustrationTextStyle}>
                        At our modern, state-of-the-art LaundryYuk, we pride <br />
                        ourselves on providing exceptional cleaning services to keep <br />
                        your clothes looking their best
                    </p>

                    {/* Tombol Sign Up */}
                    <div onClick={openRegister} style={{...signUpButtonStyle, cursor: 'pointer'}}> 
                        Try Free Pickup & Delivery
                    </div>
                </div>

                {/* Kotak Ilustrasi Kanan */}
                <div style={illustrationBoxStyle}> 
                    <img 
                        src={illustrationImage} 
                        alt="Ilustrasi Laundry" 
                        style={imageStyle} 
                    />
                </div>

            </div>

            {/* Carousel Ulasan */}
            <div style={footerBoxStyle}>
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    width: '90%',
                    overflowX: 'auto', // Mengaktifkan scroll horizontal
                    padding: '20px 10px',
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none', 
                }}>
                    {/* CSS Inline untuk sembunyikan scrollbar di Chrome/Safari */}
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                    {reviews.map((text, index) => (
                        <div key={index} style={testimonialCardStyle}>
                            <div style={{fontWeight: 'bold', marginBottom: '10px', color: '#FFD700'}}>⭐⭐⭐⭐⭐</div>
                            <p style={{ margin: 0 }}>"{text}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Services */}
            <div id="services-section" style={servicesSectionStyle}>
                <p style={{ color: '#92A0B6', marginBottom: '10px' }}>Our Services</p>
                <h2 style={{ 
                    fontSize: '48px', 
                    color: '#152B57', 
                    margin: '0',
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic', 
                }}>
                    Wash, Dry, and More
                </h2>

                <p style={{ color: '#92A0B6', marginTop: '20px' }}>We offer a wide range of laundry services to meet your every need</p>

                <div style={serviceCardContainerStyle}>
                    {/* Card 1 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{ fontStyle: 'Medium', color: '#152B57'}}>Cuci Regular</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Cuci dengan layanan regular</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp5.000 /kg</p>
                    </div>

                    {/* Card 2 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Cuci Express</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Cuci dengan layanan express 1 hari</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp8.000 /kg</p>
                    </div>

                    {/* Card 3 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Setrika Saja</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Hanya setrika</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp3.000 /kg</p>
                    </div>

                    {/* Card 4 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Cuci + Setrika</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Cuci dan Setrika</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp7.000 /kg</p>
                    </div>

                    {/* Card 5 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Dry Clean Jas</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Dry Cleaning untuk Jas</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp25.000 /piece</p>
                    </div>

                    {/* Card 6 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{ fontStyle: 'Medium', color: '#152B57'}}>Dry Clean Gaun</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Dry cleaning untuk gaun</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp35.000 /kg</p>
                    </div>

                    {/* Card 7 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Cuci Bedcover</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Cuci khusus bedcover</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp15.000 /kg</p>
                    </div>

                    {/* Card 8 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Cuci Sepatu</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Pembersihan dan perawatan sepatu</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp20.000 /kg</p>
                    </div>

                    {/* Card 9 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Cuci Karpet</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Cuci karpet berbagai ukuran</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp50.000 /piece</p>
                    </div>

                    {/* Card 10 */}
                    <div style={serviceCardStyle}>
                        <div style={circleStyle}></div>
                        <h3 style={{fontStyle: 'Medium', color: '#152B57'}}>Cuci Boneka</h3>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '-10px', color: '#92A0B6'}}>Cuci boneka agar bersih dan lembut</p>
                        <p style={{fontSize: '14px', fontStyle: 'Regular' , margin: '30px', color: '#1E1E1E'}}>Rp10.000 /kg</p>
                    </div>
                </div>

                <Link to="/booking" style={bookNowButtonStyle}>Book Now</Link>
            </div>

            {/* MODAL POP UP */}
            {authMode && (
                <div style={overlayStyle} onClick={closePopUp}>
                    <div style={popUpBoxStyle} onClick={(e) => e.stopPropagation()}>
                        
                        {/* TOMBOL X */}
                        <button 
                            onClick={closePopUp} 
                            style={{
                                position: 'absolute', 
                                right: '15px', 
                                top: '15px', 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer', 
                                fontSize: '24px',
                                color: '#152B57', 
                                fontWeight: 'bold',
                                lineHeight: '1',
                                zIndex: 1001 
                            }}
                        >
                            ✕
                        </button>
                        
                        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                            <img 
                                src={basketIcon} 
                                alt="Basket Icon" 
                                style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                            />
                        </div>
                        
                        {authMode === 'register' ? (
                            // --- TAMPILAN REGISTER ---
                            <>
                            <h2 style={{color: '#152B57', margin: '-10px'}}>Welcome to LaundryYuk!</h2>
                            <p style={{color: '#A59C9C', fontSize: '14px', marginBottom: '10px'}}>
                                Register to create your first account and exploring LaundryYuk
                            </p>
                            
                            {/* Form Input */}
                            <div style={{textAlign: 'left'}}>
                                <div style={{ marginBottom: '0px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0px', color: '#152B57' }}>
                                        Username
                                    </label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Carlos Richie 123" 
                                        style={inputStyle} />
                                </div>
                                
                                <div style={{ marginBottom: '0px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0px', color: '#152B57' }}>
                                        Email
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="carlos.richie@gmail.com" 
                                        style={inputStyle} />
                                </div>
                                
                                <div style={{ marginBottom: '0px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0px', color: '#152B57' }}>
                                        Password
                                    </label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••" 
                                        style={inputStyle} 
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleRegisterSubmit}
                                style={{...bookNowButtonStyle, width: '100%', marginTop: '20px', border: 'none', cursor: 'pointer'}}>
                                Register
                            </button>
                            
                            <div style={{ 
                                marginTop: '25px', 
                                fontSize: '14px', 
                                color: '#000', 
                                paddingBottom: '10px',
                                width: '100%' 
                            }}>
                                Already have an account?{' '}
                                <span 
                                    onClick={openLogin} 
                                    style={{ color: '#152B57', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Login
                                </span>
                            </div>
                            </>
                        ) : (
                            // --- TAMPILAN LOGIN ---
                            <>
                                <h2 style={{color: '#152B57', margin: '-10px'}}>Welcome Back!</h2>
                                <p style={{color: '#A59C9C', fontSize: '14px', marginBottom: '10px'}}>Please login to your account</p>
                                
                                <div style={{textAlign: 'left'}}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#152B57' }}>Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your email" 
                                        style={inputStyle} 
                                    />
                                    
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#152B57' }}>Password</label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="••••••••" 
                                        style={inputStyle} 
                                    />
                                </div>

                                <button 
                                    onClick={handleLoginSubmit}
                                    style={{...bookNowButtonStyle, width: '100%', marginTop: '20px', border: 'none', cursor: 'pointer'}}>Login</button>
                                
                                <div style={{ marginTop: '25px', 
                                    fontSize: '14px', 
                                    color: '#000', 
                                    paddingBottom: '20px',
                                    width: '100%' }}>
                                    Don't have an account?{' '}
                                    <span onClick={openRegister} style={{ color: '#152B57', fontWeight: 'bold', cursor: 'pointer' }}>Register</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;