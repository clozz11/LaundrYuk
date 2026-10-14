import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const getLoggedInUser = () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    };

    const loggedInUser = getLoggedInUser();
    const nameToDisplay = loggedInUser?.username || "Admin";
    const statusOptions = ['pending', 'on_progress', 'ready_for_pickup', 'completed', 'cancelled'];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/orders');
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                setOrders(data);
            } catch (error) {
                console.error("Gagal mengambil data:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            // 1. Kirim request ke backend
            // Pastikan URL ini sesuai dengan route PUT di backend Anda
            const response = await axios.put(`http://localhost:5000/api/admin/orders/${id}`, { 
                status: newStatus 
            });

            if (response.status === 200) {
                // 2. Update state di frontend agar langsung berubah tanpa refresh
                setOrders(prev => prev.map(order => {
                    const orderId = order.order_id || order.id_laundry;
                    return orderId === id ? { ...order, status: newStatus } : order;
                }));
                
                alert(`Status Order #${id} berhasil diperbarui menjadi ${newStatus.replace('_', ' ')}!`);
            }
        } catch (err) {
            console.error("Error detail:", err.response?.data || err.message);
            alert("Gagal merubah status. Pastikan server backend berjalan dan ID order benar.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); 
        navigate('/'); 
    };

    const dashboardStyle = {
        backgroundColor: '#A9CFE4',
        minHeight: '100vh',
        padding: '40px',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' 
    };

    const whiteCardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '30px',
        padding: '40px',
        width: '100%',
        maxWidth: '1200px', // Sedikit diperlebar agar tabel lega
        boxShadow: '0px 10px 30px rgba(0,0,0,0.05)',
    };

    // Style standar untuk sel tabel (Padding Horizontal 30px agar ada jarak antar kolom)
    const cellStyle = {
        padding: '20px 30px', 
        color: '#000000',
        borderBottom: '1px solid #eeeeee'
    };

    return (
        <div style={dashboardStyle}>
            
            {/* --- TOP BAR --- */}
            <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '30px', display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                    <div 
                        style={{ 
                            backgroundColor: '#ffffff', padding: '12px 30px', borderRadius: '100px', 
                            fontWeight: '700', color: '#000000', cursor: 'pointer', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {nameToDisplay} ▾
                    </div>
                    {showDropdown && (
                        <div style={{ position: 'absolute', top: '120%', left: '0', width: '160px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0px 8px 20px rgba(0,0,0,0.15)', zIndex: 1000, overflow: 'hidden' }}>
                            <button style={{ width: '100%', padding: '12px', border: 'none', background: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- KOTAK PUTIH --- */}
            <div style={whiteCardStyle}> 
                
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 style={{ color: '#000000', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>
                            Panel Admin LaundryYuk
                        </h1>
                        <p style={{ color: '#000000', fontSize: '1rem', marginTop: '5px' }}>
                            Kelola pesanan pelanggan Anda secara real-time.
                        </p>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '10px 20px', borderRadius: '15px', border: '1px solid #000000' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#000000' }}>
                            Total: {orders.length} Pesanan
                        </span>
                    </div>
                </div>

                <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #000000' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th style={{ ...cellStyle, fontWeight: '800', fontSize: '0.85rem', borderBottom: '2px solid #000000', minWidth: '120px' }}>ID ORDER</th>
                                <th style={{ ...cellStyle, fontWeight: '800', fontSize: '0.85rem', borderBottom: '2px solid #000000', minWidth: '250px' }}>NAMA PELANGGAN</th>
                                <th style={{ ...cellStyle, fontWeight: '800', fontSize: '0.85rem', borderBottom: '2px solid #000000', minWidth: '180px' }}>TOTAL BAYAR</th>
                                <th style={{ ...cellStyle, fontWeight: '800', fontSize: '0.85rem', borderBottom: '2px solid #000000', minWidth: '150px' }}>STATUS</th>
                                <th style={{ ...cellStyle, fontWeight: '800', fontSize: '0.85rem', borderBottom: '2px solid #000000', minWidth: '180px' }}>UPDATE STATUS</th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: '#ffffff' }}>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '50px', textAlign: 'center', color: '#000000', fontWeight: 'bold' }}>Memuat data...</td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => {
                                    const id = order.order_id || order.id_laundry;
                                    return (
                                        <tr key={id} style={{ transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                                            <td style={{ ...cellStyle, fontWeight: '800' }}>#{id}</td>
                                            <td style={{ ...cellStyle, fontWeight: '600' }}>{order.buyer_name || order.username || 'Pelanggan'}</td>
                                            <td style={{ ...cellStyle, fontWeight: '700' }}>
                                                Rp {Number(order.total_amount || order.total_harga || 0).toLocaleString('id-ID')}
                                            </td>
                                            <td style={{ ...cellStyle }}>
                                                <span style={{ 
                                                    padding: '6px 15px', fontSize: '0.75rem', fontWeight: '800', 
                                                    borderRadius: '8px', border: '1px solid #000000', display: 'inline-block'
                                                }}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ ...cellStyle }}>
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(id, e.target.value)}
                                                    style={{ 
                                                        padding: '8px 12px', borderRadius: '8px', border: '1px solid #000000',
                                                        fontSize: '0.85rem', backgroundColor: '#ffffff', color: '#000000', fontWeight: '600', cursor: 'pointer', width: '100%'
                                                    }}
                                                >
                                                    {statusOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt.replace('_', ' ').toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '50px', textAlign: 'center', color: '#000000' }}>Belum ada data pesanan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;