import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DalamProses = () => {
    const [pesananProses, setPesananProses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const userId = loggedInUser?.id_user;

    useEffect(() => {
        console.log("ID User yang terdeteksi:", userId); 
        
        if (!userId) {
            console.error("ID User tidak ditemukan. Cek localStorage Anda.");
            setLoading(false);
            return;
        }

        const fetchProses = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/laundry/proses/${userId}`);
                const data = await response.json();
                
                console.log("Data dari server:", data);
                
                if (response.ok) {
                    const filteredData = data.filter(item => 
                        item.status.toLowerCase() !== 'completed' && 
                        item.status.toLowerCase() !== 'cancelled'
                    );
                    setPesananProses(filteredData);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProses();
    }, [userId]);

    // --- STYLING ---
    const containerStyle = {
        padding: '40px',
        backgroundColor: '#A9CFE4',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif"
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const statusBadge = (status) => {
        let bgColor = '#70d6ff'; 
        if (status === 'pending') bgColor = '#FFE16A'; 
        if (status === 'ready_for_pickup') bgColor = '#97f9bb'; 

        return {
            backgroundColor: bgColor,
            padding: '6px 15px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#152B57',
            display: 'inline-block'
        };
    };

    return (
        <div style={containerStyle}>
            <button 
                onClick={() => navigate('/customer')} 
                style={{ 
                    marginBottom: '20px', 
                    padding: '10px 25px', 
                    cursor: 'pointer', 
                    borderRadius: '20px', 
                    border: 'none', 
                    fontWeight: 'bold', 
                    backgroundColor: '#ffffff',
                    color: '#152B57', 
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
                    fontSize: '14px'
                }}
            >
                Kembali
            </button>

            <h2 style={{ color: '#152B57', marginBottom: '30px', fontWeight: 'bold' }}>
                Pesanan Dalam Proses
            </h2>

            {loading ? (
                <p style={{ color: '#152B57' }}>Sedang mengambil data pesanan...</p>
            ) : pesananProses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {pesananProses.map((item) => (
                        <div key={item.id_laundry} style={cardStyle}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#152B57', fontSize: '18px' }}>
                                    {item.nama_layanan || "Layanan Laundry"}
                                </h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                    Tanggal Order: {new Date(item.tanggal_order).toLocaleDateString('id-ID')}
                                </p>
                                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', color: '#152B57', fontSize: '16px' }}>
                                    Total: Rp {item.total_harga?.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={statusBadge(item.status)}>{item.status.toUpperCase()}</div>
                                <p style={{ fontSize: '13px', marginTop: '12px', color: '#555', fontWeight: '500' }}>
                                    Estimasi: {item.total_berat} kg
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '100px', color: '#152B57' }}>
                    <p style={{ fontSize: '18px', fontWeight: '500' }}>Belum ada pesanan yang sedang diproses.</p>
                </div>
            )}
        </div>
    );
};

export default DalamProses;