import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Proses = () => {
    const [pesananProses, setPesananProses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Ambil data user dari localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const userId = loggedInUser?.id_user || loggedInUser?.id;

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const fetchProses = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/laundry/proses/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setPesananProses(data);
                }
            } catch (error) {
                console.error("Error fetch data proses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProses();
    }, [userId, navigate]);

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
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const badgeStyle = (status) => ({
        backgroundColor: status === 'pending' ? '#FFE16A' : '#70d6ff',
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    });

    return (
        <div style={containerStyle}>
            <button 
                onClick={() => navigate('/customer')}
                style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}
            >
                Kembali
            </button>

            <h2 style={{ color: '#152B57', marginBottom: '30px' }}>Pesanan Dalam Proses</h2>

            {loading ? (
                <p>Memuat data...</p>
            ) : pesananProses.length > 0 ? (
                pesananProses.map((item) => (
                    <div key={item.id_laundry} style={cardStyle}>
                        <div>
                            <h4 style={{ margin: '0 0 5px 0' }}>{item.nama_layanan || "Layanan Laundry"}</h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                Tanggal Order: {new Date(item.tanggal_order).toLocaleDateString('id-ID')}
                            </p>
                            <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#152B57' }}>
                                Rp {item.total_harga.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={badgeStyle(item.status)}>{item.status}</div>
                            <p style={{ fontSize: '12px', marginTop: '10px', color: '#888' }}>
                                Estimasi Berat: {item.total_berat} kg
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#152B57' }}>
                    <p>Tidak ada pesanan yang sedang diproses.</p>
                </div>
            )}
        </div>
    );
};

export default Proses;