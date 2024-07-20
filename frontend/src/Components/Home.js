import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto'; // This is required for Chart.js v3+
import '../Styles/home.css'

//RADI PROF
function Home() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState('Users');
    const [reportText, setReportText] = useState('');
    const [regionData, setRegionData] = useState({});
    const [billData, setBillData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/user/${id}`);
                if (res.data.status === "Admin") {
                    setAccounts(res.data.accounts);
                    setIsAdmin(true);
                } else {
                    setUser(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'Statistics') {
            const fetchRegionData = async () => {
                try {
                    const res = await axios.get('http://localhost:8081/user-stats');
                    const regions = res.data.reduce((acc, region) => {
                        acc[region.region] = region.count;
                        return acc;
                    }, { Sjeverni: 0, Centralni: 0, Juzni: 0 });
                    setRegionData({
                        labels: Object.keys(regions),
                        datasets: [{
                            label: 'Number of Users by Region',
                            data: Object.values(regions),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(75, 192, 192, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(75, 192, 192, 1)'
                            ],
                            borderWidth: 1
                        }]
                    });
                } catch (err) {
                    console.log(err);
                }
            };

            const fetchBillData = async () => {
                try {
                    const res = await axios.get('http://localhost:8081/monthly-bill-stats');
                    const labels = res.data.map(item => item.month);
                    const data = res.data.map(item => item.total);
                    setBillData({
                        labels,
                        datasets: [{
                            label: 'Total Bill Amount by Month',
                            data,
                            fill: false,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1
                        }]
                    });
                } catch (err) {
                    console.log(err);
                }
            };

            
            fetchRegionData();
            fetchBillData();
        }
    }, [activeTab]);

    const toggleMonth = (month) => {
        setExpandedMonth(expandedMonth === month ? null : month);
    };

    const groupBillsByMonth = (bills) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return bills.reduce((acc, bill) => {
            const monthName = months.find(m => m === bill.month);
            if (!acc[monthName]) acc[monthName] = [];
            acc[monthName].push(bill);
            return acc;
        }, {});
    };

    const deleteAccount = async (accountId) => {
        try {
            await axios.delete(`http://localhost:8081/account/${accountId}`);
            setAccounts(accounts.filter(account => account.id !== accountId));
        } catch (err) {
            console.log(err);
        }
    };

    const handleReportSubmit = async () => {
        try {
            await axios.post('http://localhost:8081/report', {
                user_id: id,
                text_report: reportText,
                date: new Date().toISOString()
            });
            alert("Report submitted successfully");
            setReportText('');
        } catch (err) {
            console.error(err);
            alert("Failed to submit report");
        }
    };

    if (isAdmin) {
        return (
            <div className="container-home-admin">
                <nav className="navbar">
                    <ul>
                        <li onClick={() => setActiveTab('Users')} className={activeTab === 'Users' ? 'active' : ''}>Users</li>
                        <li onClick={() => setActiveTab('Statistics')} className={activeTab === 'Statistics' ? 'active' : ''}> Statistics</li>
                    </ul>
                </nav>
                <h1 className="h1-home">Admin View</h1>
                <div className="">
                    {activeTab === 'Users' && ( 
                    <div>
                        <h2>All Accounts</h2>
                        <ul className="admin-view">
                            {accounts.map(account => (
                                <li key={account.id} className="account-item">
                                    <div className="account-info">
                                        <span className="account-name">{account.name}</span>
                                        <span className="account-email">{account.email}</span>
                                        <span className="account-details">JMBG: {account.JMBG}, Address: {account.address}</span>
                                    </div>
                                    <div className="account-buttons">
                                        <button className="add-bill-button" onClick={() => navigate(`/update/${account.id}`)}>Add bill</button>
                                        <button className="delete-button" onClick={() => deleteAccount(account.id)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}
                    <div className="div-stat">
                        {activeTab === 'Statistics' && (
                            <div className="div-bar chart">
                                <h2>Statistics</h2>
                                {regionData.labels && (
                                    <Bar 
                                        data={regionData}
                                        options={{ 
                                            scales: {
                                                y: { 
                                                    beginAtZero: true 
                                                } 
                                            } 
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {billData.labels && activeTab==='Statistics' && (  
                        <div className="div-line chart">
                            <h2>Bill Data</h2> 
                            <Line 
                                data={billData}
                                options={{ 
                                    scales: {
                                        y: { 
                                            beginAtZero: true 
                                        } 
                                    } 
                                }}
                            />
                        </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-home">
            {user ? (
                <div>
                    <h1>Welcome, {user.name}</h1>
                    {user.profilePic && <img className="user-picture" src={`http://localhost:8081/uploads/${user.profilePic}`} alt="Profile" />}
                    <p className="user-info">{user.email}</p>
                    <p className="user-info">JMBG: {user.JMBG}</p>
                    <p className="user-info">Address: {user.address}</p>
                    <div className="div-bills">
                        {user.bills && user.bills.length > 0 ? (
                            Object.entries(groupBillsByMonth(user.bills)).map(([month, bills]) => (
                                <div key={month}>
                                    <h3 onClick={() => toggleMonth(month)} style={{ cursor: "pointer" }}>
                                        {month}
                                    </h3>
                                    {expandedMonth === month && (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Amount</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bills.map(bill => (
                                                    <tr key={bill.id}>
                                                        <td>{bill.amount}</td>
                                                        <td>{bill.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No bills available.</p>
                        )}
                    </div>
                    <div className="report-section">
                        <h4>Report a malfunction</h4>
                        <input 
                            type="text" 
                            value={reportText} 
                            onChange={(e) => setReportText(e.target.value)} 
                            placeholder="Enter your report" 
                        />
                        <button onClick={handleReportSubmit}>Report</button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Home;




