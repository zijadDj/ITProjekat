

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import '../Styles/testLogin.css'


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8081/login", { email, password });
            setLoading(false);
            if (res.data.status === "Success") {
                alert("Login successful!");
                navigate(`/home/${res.data.id}`);
            } else if (res.data.status === "Admin") {
                alert("Admin login successful!");
                navigate(`/home/${res.data.id}`);
            } else {
                alert("Login failed. Please check your email and password.");
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="body-login fade-in">
            <div className="login-content">
                <img src={require('../logo.png')} className="logo" alt="Logo"/>
                <h1>Powerz&Co</h1>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        required 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        required 
                    />
                    <button className="button-login" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <Link to="/signup">Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;

