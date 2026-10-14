import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RiwayatPesanan = () => {
    const [riwayat, setRiwayat] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const userId = loggedInUser?.id_user;

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchRiwayat = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/laundry/proses/${userId}`);
                const data = await response.json();
                
                if (response.ok) {
                    // FILTER: Hanya ambil yang statusnya 'completed' atau 'cancelled'
                    const filteredData = data.filter(item => 
                        item.status.toLowerCase() === 'completed' || 
                        item.status.toLowerCase() === 'cancelled'
                    );
                    setRiwayat(filteredData);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRiwayat();
    }, [userId]);

    // Fungsi untuk mengirim feedback ke database
    const handleFeedback = async (id_laundry) => {
        const rating = prompt("Berikan Rating (1-5):");
        const komentar = prompt("Berikan Komentar Anda:");

        // Validasi input sederhana
        if (!rating || !komentar) return;
        if (isNaN(rating) || rating < 1 || rating > 5) {
            alert("Rating harus berupa angka 1 sampai 5.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/laundry/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_laundry,
                    rating,
                    komentar
                })
            });

            if (response.ok) {
                alert("Terima kasih! Ulasan Anda telah disimpan.");
            } else {
                const errorData = await response.json();
                // Jika user sudah pernah memberi ulasan, DB akan menolak karena UNIQUE constraint
                alert(errorData.message || "Gagal mengirim ulasan (Mungkin Anda sudah pernah memberi ulasan).");
            }
        } catch (error) {
            console.error("Error feedback:", error);
            alert("Terjadi kesalahan koneksi ke server.");
        }
    };

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

    const btnFeedbackStyle = {
        marginTop: '10px',
        padding: '8px 15px',
        backgroundColor: '#152B57',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: '0.3s'
    };

    const getBadgeStyle = (status) => {
        let bgColor = '#97f9bb'; // Hijau untuk Completed
        if (status === 'cancelled') bgColor = '#ff9b9b'; // Merah untuk Cancelled

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
                    marginBottom: '20px', padding: '10px 25px', cursor: 'pointer', 
                    borderRadius: '20px', border: 'none', fontWeight: 'bold', 
                    backgroundColor: '#ffffff', color: '#152B57', 
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.05)', fontSize: '14px'
                }}
            >
                Kembali
            </button>

            <h2 style={{ color: '#152B57', marginBottom: '30px', fontWeight: 'bold' }}>
                Riwayat Pesanan Anda
            </h2>

            {loading ? (
                <p style={{ color: '#152B57' }}>Memuat riwayat...</p>
            ) : riwayat.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {riwayat.map((item) => (
                        <div key={item.id_laundry} style={cardStyle}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#152B57', fontSize: '18px' }}>
                                    {item.nama_layanan || "Layanan Laundry"}
                                </h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                    Tanggal Order: {new Date(item.tanggal_order).toLocaleDateString('id-ID')}
                                </p>
                                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', color: '#152B57', fontSize: '16px' }}>
                                    Total Bayar: Rp {item.total_harga?.toLocaleString('id-ID')}
                                </p>

                                {/* TOMBOL ULASAN: Muncul hanya jika status COMPLETED */}
                                {item.status.toLowerCase() === 'completed' && (
                                    <button 
                                        onClick={() => handleFeedback(item.id_laundry)}
                                        style={btnFeedbackStyle}
                                    >
                                        Beri Ulasan
                                    </button>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={getBadgeStyle(item.status.toLowerCase())}>
                                    {item.status.toUpperCase()}
                                </div>
                                <p style={{ fontSize: '13px', marginTop: '12px', color: '#888' }}>
                                    ID: #{item.id_laundry}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '100px', color: '#152B57' }}>
                    <p style={{ fontSize: '18px', fontWeight: '500' }}>Belum ada riwayat pesanan.</p>
                </div>
            )}
        </div>
    );
};

export default RiwayatPesanan;