import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../Styles/home.css'


function Home() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [reportText, setReportText] = useState('');
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
            <div className="container">
                <h1 className="h1-home">Admin View</h1>
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
        );
    }

    return (
        <div className="container">
            {user ? (
                <div>
                    <h1>{user.name}</h1>
                    <p className="user-info">{user.email}</p>
                    <p className="user-info">JMBG: {user.JMBG}</p>
                    <p className="user-info">Address: {user.address}</p>
                    <div>
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


