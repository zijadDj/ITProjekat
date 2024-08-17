import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../Styles/testUpdate.css'


/*function Update() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [bill, setBill] = useState({ month: '', amount: '', consumptionId: '', billingDate: '', dueDate: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/user/${id}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUserData();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBill(prevBill => ({ ...prevBill, [name]: value }));
    };

    const handleAddBill = async () => {
        try {
            // Ensure the required fields are set correctly
            await axios.post('http://localhost:8081/addBill', {
                userId: id,
                consumptionId: bill.consumptionId,
                billingDate: bill.billingDate,
                dueDate: bill.dueDate,
                totalAmount: bill.amount
            });
            alert("Bill added successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to add bill: " + err.response.data.status || err.message);
        }
    };

    return (
        <div className='container-update'>
            {user ? (
                <div>
                    <h1>Update User: {user.name}</h1>
                    <p>Email: {user.email}</p>
                    <p>JMBG: {user.JMBG}</p>
                    <p>Address: {user.address}</p>
                    <p>Region: <b>{user.region}</b></p>
                    <div>
                        <select name="month" value={bill.month} onChange={handleInputChange}>
                            <option value="">Select Month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                        <input 
                            className='input-number'
                            type="number" 
                            name="amount" 
                            placeholder="Amount" 
                            value={bill.amount} 
                            onChange={handleInputChange} 
                        />
                        <input 
                            type="text" 
                            name="consumptionId" 
                            placeholder="Consumption ID" 
                            value={bill.consumptionId} 
                            onChange={handleInputChange} 
                        />
                        <input 
                            type="date" 
                            name="billingDate" 
                            placeholder="Billing Date" 
                            value={bill.billingDate} 
                            onChange={handleInputChange} 
                        />
                        <input 
                            type="date" 
                            name="dueDate" 
                            placeholder="Due Date" 
                            value={bill.dueDate} 
                            onChange={handleInputChange} 
                        />
                        <button onClick={handleAddBill}>Add</button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Update;*/
function Update() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [bill, setBill] = useState({ month: '', amount: '', consumptionId: '', billingDate: '', dueDate: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/user/${id}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUserData();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBill(prevBill => ({ ...prevBill, [name]: value }));
    };

    const handleAddBill = async () => {
        try {
            await axios.post('http://localhost:8081/addBill', {
                userId: id,
                consumptionId: bill.consumptionId,
                billingDate: bill.billingDate,
                dueDate: bill.dueDate,
                totalAmount: bill.amount
            });
            alert("Bill added successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to add bill: " + (err.response.data.status || err.message));
        }
    };

    return (
        <div className='container'>
            {user ? (
                <div>
                    <h1>Update User: {user.name}</h1>
                    <p>Email: {user.email}</p>
                    <p>JMBG: {user.JMBG}</p>
                    <p>Address: {user.address}</p>
                    <p>Region: <b>{user.region}</b></p>
                    <div className="form-group">
                        <select name="month" value={bill.month} onChange={handleInputChange} className="form-control mb-2">
                            <option value="">Select Month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                        <input 
                            className='form-control mb-2'
                            type="number" 
                            name="amount" 
                            placeholder="Amount" 
                            value={bill.amount} 
                            onChange={handleInputChange} 
                        />
                        <input 
                            className='form-control mb-2'
                            type="text" 
                            name="consumptionId" 
                            placeholder="Consumption ID" 
                            value={bill.consumptionId} 
                            onChange={handleInputChange} 
                        />
                        <input 
                            className='form-control mb-2'
                            type="date" 
                            name="billingDate" 
                            placeholder="Billing Date" 
                            value={bill.billingDate} 
                            onChange={handleInputChange} 
                        />
                        <input 
                            className='form-control mb-2'
                            type="date" 
                            name="dueDate" 
                            placeholder="Due Date" 
                            value={bill.dueDate} 
                            onChange={handleInputChange} 
                        />
                        <button onClick={handleAddBill} className="btn btn-primary btn-add-bill">Add</button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Update;