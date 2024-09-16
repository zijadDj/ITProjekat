/*import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Pay() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handlePayment = () => {
        // Handle payment logic here (e.g., API call to process payment)
        alert(`Payment for bill ${id} processed!`);
        navigate('/'); // Redirect back to the home page or another page after payment
    };

    return (
        <div className="container-pay">
            <h1>Pay Your Bill</h1>
            <p>You are about to pay the bill with ID: <strong>{id}</strong></p>
            <button className="btn btn-success" onClick={handlePayment}>
                Confirm Payment
            </button>
        </div>
    );
}

export default Pay;*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/testPay.css'

function Pay() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/bill/${id}`);
                setBill(res.data);
            } catch (err) {
                console.log(err);
                alert('Failed to fetch bill details');
            }
        };

        fetchBill();
    }, [id]);

    const validateCardDetails = () => {
        const cardNumberRegex = /^\d{16}$/;
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^\d{3}$/;

        if (!cardNumberRegex.test(cardNumber)) {
            setError('Card number must be 16 digits.');
            return false;
        }

        if (!expiryDateRegex.test(expiryDate)) {
            setError('Expiry date must be in MM/YY format.');
            return false;
        }

        const [month, year] = expiryDate.split('/');
        const expiryDateObject = new Date(`20${year}`, month - 1);
        if (expiryDateObject < new Date()) {
            setError('Expiry date cannot be in the past.');
            return false;
        }

        if (!cvvRegex.test(cvv)) {
            setError('CVV must be 3 digits.');
            return false;
        }

        setError(''); // Clear error if all validations pass
        return true;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateCardDetails()) return;

        try {
            const res = await axios.post(`http://localhost:8081/pay/${id}`, {
                cardNumber,
                expiryDate,
                cvv,
                nameOnCard
            });

            if (res.data.success) {
                alert('Payment successful!');
                navigate('/');
            } else {
                alert('Payment failed. Please try again.');
            }
        } catch (err) {
            console.log(err);
            alert('Payment failed');
        }
    };

    const handleExpiryDateChange = (e) => {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (input.length >= 3) {
            input = input.slice(0, 2) + '/' + input.slice(2); // Add '/' after the second digit
        }
        setExpiryDate(input);
    };

    return (
        <div className="pay-container mt-2 mb-2 fade-in-delayed">
            {bill ? (
                <div className="card p-5 shadow-sm">
                    <h1 className="text-center mb-4 h1-pay">Pay Bill</h1>
                    <p className='bill-info'><strong>Bill ID:</strong> {bill.bill_id}</p>
                    <p className='bill-info'><strong>Month:</strong> {new Date(bill.billing_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    <p className='bill-info'><strong>Amount:</strong> ${bill.total_amount}</p>

                    <h2 className="mt-5 h2-pay">Enter Your Payment Details</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <form onSubmit={handlePayment}>
                        <div className="form-group">
                            <label>Card Number</label>
                            <input 
                                type="text" 
                                className="form-control custom-input" 
                                value={cardNumber} 
                                onChange={(e) => setCardNumber(e.target.value)} 
                                placeholder="1234 5678 9012 3456" 
                                maxLength="16" 
                                required 
                            />
                        </div>
                        <div className='ed-cvv-div'>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Expiry Date</label>
                                    <input 
                                        type="text" 
                                        className="form-control custom-input" 
                                        value={expiryDate} 
                                        onChange={handleExpiryDateChange} 
                                        placeholder="MM/YY" 
                                        maxLength="5" 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label>CVV</label>
                                <input 
                                    type="text" 
                                    className="form-control custom-input" 
                                    value={cvv} 
                                    onChange={(e) => setCvv(e.target.value)} 
                                    placeholder="123" 
                                    maxLength="3" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Name on Card</label>
                            <input 
                                type="text" 
                                className="form-control custom-input" 
                                value={nameOnCard} 
                                onChange={(e) => setNameOnCard(e.target.value)} 
                                placeholder="John Doe" 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block mt-4 custom-button">Submit Payment</button>
                    </form>
                </div>
            ) : (
                <div className="loading-container">
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
}

export default Pay;