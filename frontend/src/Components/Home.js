

    import React, { useState, useEffect, useCallback } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import { Bar, Line } from 'react-chartjs-2';
    import { Chart, registerables } from 'chart.js';
    import { FaCheckCircle } from 'react-icons/fa';
    import 'bootstrap/dist/css/bootstrap.css';
    import '../Styles/testHome.css'
    
    
    
    Chart.register(...registerables);
    
    function Home() {
        const { id } = useParams();
        const [user, setUser] = useState(null);
        const [expandedMonth, setExpandedMonth] = useState(null);
        //const [accounts, setAccounts] = useState(null);
        const [accounts, setAccounts] = useState([]);
        const [isAdmin, setIsAdmin] = useState(false);
        const [activeTab, setActiveTab] = useState('Users');
        const [activeTabHome, setActiveTabHome] = useState('Bills');
        const [reportText, setReportText] = useState('');
        const [regionData, setRegionData] = useState({});
        const [billData, setBillData] = useState({ labels: [], datasets: [] });
        const [latestBills, setLatestBills] = useState([]);
        const [searchQuery, setSearchQuery] = useState('');
        const [reports, setReports] = useState([]);  // State to store reports
        const navigate = useNavigate();
        

        useEffect(() => {
            const fetchReports = async () => {
                try {
                    const res = await axios.get('http://localhost:8081/reports');
                    console.log(res.data); // Debugging line
                    setReports(res.data);
                } catch (err) {
                    console.log(err);
                }
            };
        
            fetchReports();
        }, []);

        /*const handleStatusChange = async (reportId, newStatus) => {
            try {
                await axios.put(`http://localhost:8081/report/status/${reportId}`, { status: newStatus });
                // Update the status in the UI after a successful update
                setReports((prevReports) =>
                    prevReports.map((report) =>
                        report.r_id === reportId ? { ...report, sts: newStatus } : report
                    )
                );
            } catch (err) {
                console.error('Error updating status:', err);
            }
        };*/

        const handleStatusChange = async (reportId, newStatus) => {
            try {
                // Update the status in the backend
                await axios.put(`http://localhost:8081/report/status/${reportId}`, { status: newStatus });
                
                // Refetch the updated reports from the backend
                const res = await axios.get('http://localhost:8081/reports');
                setReports(res.data);  // Update state with the latest reports data
            } catch (err) {
                console.error('Error updating status:', err);
            }
        };

        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8081/user/${id}`);
                    console.log("User data response:", res.data); // Debugging line
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
                        console.log("Region stats response:", res.data); // Debugging line
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
                        console.log("Bill stats response:", res.data); // Debugging line
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
    
                const fetchLatestBills = async () => {
                    try {
                        const res = await axios.get('http://localhost:8081/latest-bills');
                        console.log("Latest bills response:", res.data); // Debugging line
                        setLatestBills(res.data);
                    } catch (err) {
                        console.log(err);
                    }
                };
    
                fetchRegionData();
                fetchBillData();
                fetchLatestBills();
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
                const monthName = months[new Date(bill.billing_date).getMonth()];
                if (!acc[monthName]) acc[monthName] = [];
                acc[monthName].push(bill);
                return acc;
            }, {});
        };
    
        const deleteAccount = async (accountId) => {
            try {
                await axios.delete(`http://localhost:8081/account/${accountId}`);
                setAccounts(accounts.filter(account => account.user_id !== accountId));
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

        const filteredAccounts = (accounts || []).filter(account =>
            account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.JMBG.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.address.toLowerCase().includes(searchQuery.toLowerCase())
        );

        useEffect(() => {
            if (activeTabHome === 'Report') {
                const fetchUserReports = async () => {
                    try {
                        const res = await axios.get(`http://localhost:8081/user/${id}/reports`);
                        setReports(res.data); // Set reports data for the user
                    } catch (err) {
                        console.error('Error fetching user reports:', err);
                    }
                };
        
                fetchUserReports();
            }
        }, [activeTabHome, id]);

    
        if (isAdmin) {
            return (
                <div className="container-home-admin fade-in-delayed">
                    <nav className="navbar">
                        <ul>
                            <li onClick={() => setActiveTab('Users')} className={activeTab === 'Users' ? 'active' : ''}>Users</li>
                            <li onClick={() => setActiveTab('Statistics')} className={activeTab === 'Statistics' ? 'active' : ''}>Statistics</li>
                            <li onClick={() => setActiveTab('Reports')} className={activeTab === 'Reports' ? 'active' : ''}>Reports</li>
                        </ul>
                    </nav>
                    <h1 className="h1-home">Admin View</h1>
                    <div className="">
                        {activeTab === 'Users' && (
                            <div>
                                <h2>All Accounts</h2>
                                <input
                                type="text"
                                placeholder="Search by name, email, JMBG, or address"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar"
                                />
                                <ul className="admin-view">
                                    {filteredAccounts.map(account => (
                                        <li key={account.user_id} className="account-item">
                                            <div className="account-info">
                                                <span className="account-name">{account.name} </span>
                                                <span className="account-email">{account.email}</span>
                                                <span className="account-details"><br/>JMBG: {account.JMBG}, <br/>Address: {account.address}</span>
                                            </div>
                                            <div className="account-buttons">
                                                <button className="add-bill-button" onClick={() => navigate(`/update/${account.user_id}`)}>Add bill</button>
                                                <button className="delete-button" onClick={() => deleteAccount(account.user_id)}>Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'Statistics' && (
                            <div className="div-stat">
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
    
                                {billData.labels && (
                                    <div className="div-line chart">
                                        <h2>Statistics</h2>
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
                        )}
                            {activeTab === 'Statistics' && (
                                <div className="latest-bills">
                                    <h2>Latest Bills</h2>
                                    <ul className="ul-bills">
                                        {latestBills.map(bill => (
                                            <li key={bill.id} className="bill-item">
                                                <div>
                                                    <p>{bill.user_name}</p>
                                                    <p className="bill-amount">Amount: {bill.amount}</p>
                                                    <p className="bill-date">Date: {new Date(bill.date).toLocaleDateString()}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'Reports' && (
                                <div className="reports-section">
                                    <h4>Reports</h4>
                                    {reports.length > 0 ? (
                                        <table className="reports-table">
                                            <thead>
                                                <tr>
                                                    <th>Report ID</th>
                                                    <th>User ID</th>
                                                    <th>Date</th>
                                                    <th>Text</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reports.map(report => (
                                                    <tr key={report.report_id}>
                                                        <td>{report.report_id}</td>
                                                        <td>{report.user_id}</td>
                                                        <td>{new Date(report.report_date).toLocaleDateString()}</td>
                                                        <td>{report.report_text}</td>
                                                        <td>
                                                            <select 
                                                                value={report.status}
                                                                onChange={(e) => handleStatusChange(report.report_id, e.target.value)}
                                                                className={
                                                                    report.status === 'open' ? 'status-open' :
                                                                    report.status === 'in progress' ? 'status-in-progress' :
                                                                    'status-closed'
                                                                }
                                                            >
                                                                <option value="open">Open</option>
                                                                <option value="in progress">In Progress</option>
                                                                <option value="closed">Closed</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No reports found.</p>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                );
            }
        
            return (
                <div className="container-home fade-in">
                    {user ? (
                        <div className="user-details">
                            <h1>Welcome, {user.name}</h1>
                            {user.profilePic && <img className="user-picture" src={`http://localhost:8081/uploads/${user.profilePic}`} alt="Profile" />}
                            <p className="user-info">{user.email}</p>
                            <p className="user-info">JMBG: {user.JMBG}</p>
                            <p className="user-info">Address: {user.address}</p>
        
                            <nav className="navbar navbar-user">
                                <ul>
                                    <li onClick={() => setActiveTabHome('Bills')} className={activeTabHome === 'Bills' ? 'active' : ''}>Bills</li>
                                    <li onClick={() => setActiveTabHome('Report')} className={activeTabHome === 'Report' ? 'active' : ''}>Report</li>
                                </ul>
                            </nav>
        
                            {activeTabHome === 'Bills' && (
                                <div className="div-bills">
                                    {user.bills && user.bills.length > 0 ? (
                                        Object.entries(groupBillsByMonth(user.bills)).map(([month, bills]) => (
                                            <div key={month} className="month-bills">
                                                <h3 className="month" onClick={() => toggleMonth(month)} style={{ cursor: "pointer" }}>
                                                    {month}
                                                </h3>
                                                {expandedMonth === month && (
                                                    <table className="bills-table fade-in">
                                                        <thead>
                                                            <tr>
                                                                <th>Amount</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead> 
                                                        <tbody>
                                                            {bills.map(bill => (
                                                                <tr key={bill.id}>
                                                                    <td>{bill.total_amount}</td>
                                                                    <td>{new Date(bill.billing_date).toLocaleDateString()}</td>
                                                                    <td>
                                                                        {bill.status === 'paid' ? (
                                                                            <span style={{ color: 'green' }}>
                                                                                <FaCheckCircle style={{ marginRight: '5px' }} />
                                                                                Paid
                                                                            </span>
                                                                        ) : (
                                                                            <span style={{ color: 'red' }}>
                                                                                Unpaid
                                                                                <button 
                                                                                     className="pay-button btn btn-danger" 
                                                                                     onClick={() => navigate(`/pay/${bill.bill_id}`)}
                                                                                    style={{ marginLeft: '10px' }}
                                                                                >
                                                                                    Pay the bill
                                                                                </button>
                                                                            </span>
                                                                        )}
                                                                    </td>
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
                            )}
                            {activeTabHome === 'Report' && (
                                <div className="report-section">
                                    <h4>Report a malfunction</h4>
                                    <input 
                                        type="text" 
                                        value={reportText} 
                                        onChange={(e) => setReportText(e.target.value)} 
                                        placeholder="Enter your report" 
                                    />
                                    <button onClick={handleReportSubmit}>Report</button>
                                    
                                    <h4>Your Past Reports</h4>
                                    {reports.length > 0 ? (
                                        <table className="reports-table">
                                            <thead>
                                                <tr>
                                                    <th>Report ID</th>
                                                    <th>Date</th>
                                                    <th>Report Text</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reports.map(report => (
                                                    <tr key={report.report_id}>
                                                        <td>{report.report_id}</td>
                                                        <td>{new Date(report.report_date).toLocaleDateString()}</td>
                                                        <td>{report.report_text}</td>
                                                        <td>{report.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No past reports found.</p>
                                    )}
                                    
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            );
        }
        
        export default Home;

       /* function Home() {
            const { id } = useParams();
            const [user, setUser] = useState(null);
            const [expandedMonth, setExpandedMonth] = useState(null);
            const [accounts, setAccounts] = useState(null);
            const [isAdmin, setIsAdmin] = useState(false);
            const [activeTab, setActiveTab] = useState('Users');
            const [activeTabHome, setActiveTabHome] = useState('Bills');
            const [reportText, setReportText] = useState('');
            const [regionData, setRegionData] = useState({});
            const [billData, setBillData] = useState({ labels: [], datasets: [] });
            const [latestBills, setLatestBills] = useState([]);
            const navigate = useNavigate();
        
            useEffect(() => {
                const fetchUserData = async () => {
                    try {
                        const res = await axios.get(`http://localhost:8081/user/${id}`);
                        console.log("User data response:", res.data); // Debugging line
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
                            console.log("Region stats response:", res.data); // Debugging line
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
                            console.log("Bill stats response:", res.data); // Debugging line
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
        
                    const fetchLatestBills = async () => {
                        try {
                            const res = await axios.get('http://localhost:8081/latest-bills');
                            console.log("Latest bills response:", res.data); // Debugging line
                            setLatestBills(res.data);
                        } catch (err) {
                            console.log(err);
                        }
                    };
        
                    fetchRegionData();
                    fetchBillData();
                    fetchLatestBills();
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
                    const monthName = months[new Date(bill.billing_date).getMonth()];
                    if (!acc[monthName]) acc[monthName] = [];
                    acc[monthName].push(bill);
                    return acc;
                }, {});
            };
        
            const deleteAccount = async (accountId) => {
                try {
                    await axios.delete(`http://localhost:8081/account/${accountId}`);
                    setAccounts(accounts.filter(account => account.user_id !== accountId));
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
                    <div className="container container-home-admin">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <ul className="navbar-nav">
                                <li className={`nav-item ${activeTab === 'Users' ? 'active' : ''}`} onClick={() => setActiveTab('Users')}>
                                    <a className="nav-link">Users</a>
                                </li>
                                <li className={`nav-item ${activeTab === 'Statistics' ? 'active' : ''}`} onClick={() => setActiveTab('Statistics')}>
                                    <a className="nav-link">Statistics</a>
                                </li>
                            </ul>
                        </nav>
                        <h1 className="h1-home">Admin View</h1>
                        <div>
                            {activeTab === 'Users' && (
                                <div>
                                    <h2>All Accounts</h2>
                                    <ul className="list-group">
                                        {accounts.map(account => (
                                            <li key={account.user_id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="font-weight-bold">{account.name}</span>
                                                    <p className="mb-0">{account.email}</p>
                                                    <p className="mb-0">JMBG: {account.JMBG}, Address: {account.address}</p>
                                                </div>
                                                <div>
                                                    <button className="btn btn-primary mr-2" onClick={() => navigate(`/update/${account.user_id}`)}>Add bill</button>
                                                    <button className="btn btn-danger" onClick={() => deleteAccount(account.user_id)}>Delete</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'Statistics' && (
                                <div>
                                    <div className="chart-container">
                                        <h2>Statistics</h2>
                                        {regionData.labels && (
                                            <div className="chart-wrapper">
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
                                            </div>
                                        )}
                                    </div>
                                    {billData.labels && (
                                        <div className="chart-container">
                                            <div className="chart-wrapper">
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
                                        </div>
                                    )}
                                    <div className="latest-bills">
                                        <h2>Latest Bills</h2>
                                        <ul className="list-group">
                                            {latestBills.map(bill => (
                                                <li key={bill.id} className="list-group-item">
                                                    {bill.user_name} - <strong>Amount:</strong> {bill.amount} <strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
        
            return (
                <div className="container container-home">
                    {user ? (
                        <div className="user-details">
                            <h1 className="text-center">Welcome, {user.name}</h1>
                            {user.profilePic && <img className="user-picture rounded mx-auto d-block" src={`http://localhost:8081/uploads/${user.profilePic}`} alt="Profile" />}
                            <p className="user-info">{user.email}</p>
                            <p className="user-info">JMBG: {user.JMBG}</p>
                            <p className="user-info">Address: {user.address}</p>
        
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <ul className="navbar-nav">
                                    <li className={`nav-item ${activeTabHome === 'Bills' ? 'active' : ''}`} onClick={() => setActiveTabHome('Bills')}>
                                        <a className="nav-link">Bills</a>
                                    </li>
                                    <li className={`nav-item ${activeTabHome === 'Report' ? 'active' : ''}`} onClick={() => setActiveTabHome('Report')}>
                                        <a className="nav-link">Report</a>
                                    </li>
                                </ul>
                            </nav>
        
                            {activeTabHome === 'Bills' && (
                                <div>
                                    {user.bills && user.bills.length > 0 ? (
                                        Object.entries(groupBillsByMonth(user.bills)).map(([month, bills]) => (
                                            <div key={month} className="month-bills mb-4">
                                                <h3 className="month" onClick={() => toggleMonth(month)} style={{ cursor: "pointer" }}>
                                                    {month}
                                                </h3>
                                                {expandedMonth === month && (
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Amount</th>
                                                                <th>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bills.map(bill => (
                                                                <tr key={bill.id}>
                                                                    <td>{bill.total_amount}</td>
                                                                    <td>{new Date(bill.billing_date).toLocaleDateString()}</td>
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
                            )}
                            {activeTabHome === 'Report' && (
                                <div className="report-section">
                                    <h4>Report a malfunction</h4>
                                    <div className="form-group">
                                        <input 
                                            type="text" 
                                            value={reportText} 
                                            onChange={(e) => setReportText(e.target.value)} 
                                            placeholder="Enter your report" 
                                            className="form-control"
                                        />
                                    </div>
                                    <button onClick={handleReportSubmit} className="btn btn-primary">Report</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            );
        }
        
        export default Home;*/
    
