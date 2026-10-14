import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Pemesanan = () => {
    const navigate = useNavigate();

    
    // --- STATE ---
    const [tanggal, setTanggal] = useState(new Date());
    const [selectedLayanan, setSelectedLayanan] = useState("");
    const [jumlah, setJumlah] = useState(0);
    const [totalHarga, setTotalHarga] = useState(0);
    const [alamat, setAlamat] = useState("");
    const [telepon, setTelepon] = useState("");
    
    const layananList = [
        { id: 1, nama: "Cuci Reguler", harga: 5000, satuan: "kg" },
        { id: 2, nama: "Cuci Express", harga: 8000, satuan: "kg" },
        { id: 3, nama: "Setrika Saja", harga: 3000, satuan: "kg" },
        { id: 4, nama: "Cuci + Setrika", harga: 7000, satuan: "kg" },
        { id: 5, nama: "Dry Clean Jas", harga: 25000, satuan: "piece" },
        { id: 6, nama: "Dry Clean Gaun", harga: 35000, satuan: "piece" },
        { id: 7, nama: "Cuci Bedcover", harga: 15000, satuan: "piece" },
        { id: 8, nama: "Cuci Sepatu", harga: 20000, satuan: "piece" },
        { id: 9, nama: "Cuci Karpet", harga: 50000, satuan: "set" },
        { id: 10, nama: "Cuci Boneka", harga: 10000, satuan: "piece" },
    ];

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const defaultName = loggedInUser && loggedInUser.username ? loggedInUser.username : "";

    // Efek untuk generate harga otomatis
    useEffect(() => {
        const layanan = layananList.find(item => item.id === parseInt(selectedLayanan));
        if (layanan && jumlah > 0) {
            setTotalHarga(layanan.harga * jumlah);
        } else {
            setTotalHarga(0);
        }
    }, [selectedLayanan, jumlah]);

    // --- STYLES ---
    const containerStyle = {
        backgroundColor: '#A9CFE4',
        minHeight: '100vh',
        padding: '40px',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const contentWrapperStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '30px',
        flexWrap: 'wrap'
    };

    const leftCardStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '15px',
        width: '450px',
        minHeight: '400px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        border: '2px solid #0091FF' 
    };

    const rightCardStyle = {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '15px',
        width: '450px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        border: '1px solid #A9CFE4'
    };

    const inputGroupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' };
    const inputStyle = {
        width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd',
        boxSizing: 'border-box', fontSize: '14px', backgroundColor: 'white', color: 'black',
    };

    const handleKonfirmasi = async () => {
        // Validasi Input
        if (!selectedLayanan || jumlah <= 0 || !alamat || !telepon) {
            alert("Mohon lengkapi semua data: Nomor Telepon, Alamat, Layanan, dan Berat!");
            return;
        }

        const payload = {
            user_id: loggedInUser?.id_user || loggedInUser?.id, 
            total_harga: totalHarga,
            alamat_order: alamat,
            nomor_telepon: telepon, 
            tgl_laundry: tanggal.toISOString().split('T')[0],
            id_layanan: parseInt(selectedLayanan),
            berat: jumlah
        };

        try {
            // PENGIRIMAN KE DATABASE
            const response = await fetch('http://localhost:5000/api/laundry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                // Jika sukses di database
                alert("Pesanan Berhasil Disimpan ke Database!");
                navigate('/customer');
            } else {
                // Jika backend menolak
                alert("Gagal menyimpan: " + result.message);
            }
        } catch (error) {
            // Jika backend mati atau URL salah
            console.error("Error saat mengirim data:", error);
            alert("Koneksi ke Server Gagal. Pastikan Backend (Node.js) sudah jalan.");
        }
    };

    return (
        <div style={containerStyle}>
            {/* Memastikan teks kalender tetap terlihat hitam dan jelas */}
            <style>
                {`
                    .react-calendar__tile {
                        color: black !important;
                    }
                    .react-calendar__month-view__weekdays__weekday{
                        color: black !important;
                        text-decoration: none !important;
                    }
                    .react-calendar__month-view__weekdays__weekday abbr {
                        text-decoration: none !important;
                    }
                    .react-calendar__navigation button {
                        color: black !important;
                    }
                    .react-calendar__tile--active {
                        background: #152B57 !important;
                        color: white !important;
                    }
                    .react-calendar__tile:enabled:hover,
                    .react-calendar__tile:enabled:focus {
                        background-color: #e6e6e6 !important;
                    }
                    .react-calendar__tile--now {    
                        background: #152B57 !important;
                    }
                    .react-calendar__month-view__days__day--neighboringMonth {
                        color: #757575 !important;
                    }
                `}
            </style>

            {/* Tombol Kembali */}
            <button 
                onClick={() => navigate('/customer')}
                style={{ 
                    cursor: 'pointer', border: 'none', background: 'white', 
                    padding: '10px 20px', borderRadius: '10px', alignSelf: 'flex-start',
                    fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', color: '#000000', fontSize: '14px',
                }}
            >
                Kembali
            </button>

            <div style={contentWrapperStyle}>
                
                {/* BAGIAN KIRI: KALENDER */}
                <div style={leftCardStyle}>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontWeight: 'bold', color: '#152B57' }}>Pilih Tanggal Penjemputan</span>
                    </div>
                    <Calendar 
                        onChange={setTanggal} 
                        value={tanggal} 
                        locale="id-ID"
                    />
                    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f7ff', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#152B57' }}>
                            Tanggal terpilih: <br/>
                            <b>{tanggal.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</b>
                        </p>
                    </div>
                </div>

                {/* BAGIAN KANAN: FORM PEMESANAN */}
                <div style={rightCardStyle}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Nama Pengirim</label>
                        <input 
                            style={inputStyle} 
                            type="text" 
                            defaultValue={defaultName}
                            placeholder="Masukkan nama lengkap anda..." 
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Nomor Telepon</label>
                        <input 
                            style={inputStyle} 
                            type="text" 
                            placeholder="Masukkan nomor telepon anda..."
                            value={telepon} 
                            onChange={(e) => setTelepon(e.target.value)}
                        /> 
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Alamat Pick Up</label>
                        <input 
                            style={inputStyle} 
                            type="text" 
                            placeholder="Masukkan alamat untuk pick up..." 
                            value={alamat} 
                            onChange={(e) => setAlamat(e.target.value)}
                        />
                    </div>

                    {/* DROP DOWN JENIS LAYANAN */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Jenis Layanan</label>
                        <select 
                            style={inputStyle} 
                            value={selectedLayanan} 
                            onChange={(e) => setSelectedLayanan(e.target.value)}
                        >
                            <option value="">Pilih layanan laundry</option>
                            {layananList.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nama} - Rp {item.harga.toLocaleString()}/{item.satuan}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Total Berat / Jumlah</label>
                        <input 
                            style={inputStyle} 
                            type="number" 
                            min="0"
                            placeholder="Masukkan berat/jumlah cucian..."
                            onChange={(e) => setJumlah(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    {/* HARGA OTOMATIS GENERATE */}
                    <div style={{ textAlign: 'right', marginTop: '20px', borderTop: '2px dashed #eee', paddingTop: '15px' }}>
                        <span style={{ fontSize: '14px', color: '#555' }}>Estimasi Total Harga</span>
                        <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#152B57' }}>
                            Rp {totalHarga.toLocaleString('id-ID')},00
                        </div>
                    </div>

                    <button 
                        onClick={handleKonfirmasi} 
                        style={{ 
                            width: '100%', marginTop: '20px', padding: '15px', 
                            backgroundColor: '#152B57', color: 'white', border: 'none', 
                            borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Konfirmasi Pesanan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pemesanan;