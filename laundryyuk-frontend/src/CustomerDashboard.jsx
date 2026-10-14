import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bellIcon from './assets/carbon_notification.png';
import basketIcon from './assets/majesticons_basket-2.png';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    // --- STATE UNTUK POP UP ---
    const [authMode, setAuthMode] = useState(null);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const nameToDisplay = loggedInUser && loggedInUser.username ? loggedInUser.username : "Pelanggan";

    // --- FUNGSI AUTH LOGIC ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            alert("Terjadi kesalahan pada server.");
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            
            if (response.ok) {
                alert("Login Berhasil!");
                // Simpan data user (termasuk role) ke localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                setAuthMode(null);

                // LOGIKA NAVIGASI BERDASARKAN ROLE
                if (data.user.role === 'admin') {
                    navigate('/admin-dashboard'); // Arahkan ke dashboard admin
                } else {
                    window.location.reload(); // Tetap di sini untuk customer
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Gagal terhubung ke server");
        }
    };

    const handleLogout = (e) => {
        e.stopPropagation(); 
        localStorage.removeItem('user'); 
        setShowDropdown(false);
        setAuthMode('login'); 
    };

    const openRegister = () => setAuthMode('register');
    const openLogin = () => setAuthMode('login');
    const closePopUp = () => {
        if (!localStorage.getItem('user')) {
            navigate('/');
        } else {
            setAuthMode(null);
        }
    };

    // --- STYLE OBJECTS (FIXED) ---
    const containerStyle = { backgroundColor: '#A9CFE4', minHeight: '100vh', padding: '30px', fontFamily: "'Inter', sans-serif" };
    const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
    
    const popUpBoxStyle = { 
        backgroundColor: '#ffffff', 
        width: '370px', 
        padding: '40px 40px 60px 40px', // Ditambah padding bawah (60px) agar teks tidak terpotong
        borderRadius: '30px', 
        boxShadow: '0px 10px 30px rgba(0,0,0,0.2)', 
        textAlign: 'center', 
        position: 'relative', 
        maxHeight: '90vh', 
        overflowY: 'auto' 
    };

    const inputStyle = { width: '90%', padding: '15px', margin: '10px 0', borderRadius: '15px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#000' };
    const submitButtonStyle = { backgroundColor: '#152B57', color: '#ffffff', padding: '15px 20px', borderRadius: '20px', fontWeight: 'bold', width: '100%', marginTop: '20px', border: 'none', cursor: 'pointer' };

    return (
        <div style={containerStyle}>
            {/* HEADER SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div 
                    style={{ backgroundColor: '#ffffff', padding: '12px 40px', borderRadius: '20px', fontWeight: 'bold', color: '#152B57', position: 'relative', cursor: 'pointer' }}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    {nameToDisplay} ▾
                    {showDropdown && (
                        <div style={{ position: 'absolute', top: '110%', left: '0', width: '100%', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 4px 15px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 999 }}>
                            <button style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'transparent', color: '#ff4d4d', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
                <div style={{ backgroundColor: '#ffffff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={bellIcon} alt="Notification" style={{ width: '30px', height: '30px' }} />
                </div>
            </div>

            {/* MAIN MENU SECTION */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '150px' }}>
                <button style={{ backgroundColor: '#8B7E74', color: '#ffffff', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/pemesanan')}>Buat pesanan</button>
                <button style={{ backgroundColor: '#8B7E74', color: '#ffffff', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/dalamproses')}>Dalam proses</button>
                <button style={{ backgroundColor: '#8B7E74', color: '#ffffff', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/riwayat')}>Riwayat pesanan</button>
            </div>

            {/* MODAL POP UP */}
            {authMode && (
                <div style={overlayStyle} onClick={closePopUp}>
                    <div style={popUpBoxStyle} onClick={(e) => e.stopPropagation()}>
                        
                        <button onClick={closePopUp} style={{ position: 'absolute', right: '15px', top: '15px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px', color: '#152B57', fontWeight: 'bold' }}>
                            ✕
                        </button>

                        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                            <img src={basketIcon} alt="Basket" style={{ width: '40px', height: '40px' }} />
                        </div>

                        {authMode === 'register' ? (
                            <>
                                <h2 style={{color: '#152B57', margin: '-10px'}}>Welcome to LaundryYuk!</h2>
                                <p style={{color: '#A59C9C', fontSize: '14px', marginBottom: '10px'}}>Register to create your first account</p>
                                
                                <div style={{textAlign: 'left'}}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#152B57' }}>Username</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Carlos Richie 123" style={inputStyle} />
                                    
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#152B57' }}>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="carlos.richie@gmail.com" style={inputStyle} />
                                    
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#152B57' }}>Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
                                </div>

                                <button onClick={handleRegisterSubmit} style={submitButtonStyle}>Register</button>
                                
                                {/* PERBAIKAN WARNA DAN SPACING TEKS DI BAWAH INI */}
                                <div style={{ marginTop: '25px', fontSize: '14px', color: '#333333' }}>
                                    Already have an account? <span onClick={openLogin} style={{ color: '#152B57', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Login</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 style={{color: '#152B57', margin: '-10px'}}>Welcome Back!</h2>
                                <p style={{color: '#A59C9C', fontSize: '14px', marginBottom: '10px'}}>Please login to your account</p>
                                
                                <div style={{textAlign: 'left'}}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#152B57' }}>Email</label>
                                    <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Enter your email" style={inputStyle} />
                                    
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#152B57' }}>Password</label>
                                    <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="••••••••" style={inputStyle} />
                                </div>

                                <button onClick={handleLoginSubmit} style={submitButtonStyle}>Login</button>
                                
                                {/* PERBAIKAN WARNA DAN SPACING TEKS DI BAWAH INI */}
                                <div style={{ marginTop: '25px', fontSize: '14px', color: '#333333' }}>
                                    Don't have an account? <span onClick={openRegister} style={{ color: '#152B57', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Register</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;