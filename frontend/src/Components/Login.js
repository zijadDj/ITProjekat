import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Validation from "./LoginValidation.js";
import axios from "axios";
import '../Styles/login.css'


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8081/login", { email, password });
            if (res.data.status === "Success" || res.data.status === "Admin") {
                navigate(`/home/${res.data.id}`);
            } else {
                alert("Login failed");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="login-content">
                <img src={require('../logo.png')} className="logo"/>
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
                    <button type="submit">Login</button>
                    <Link to="/signup">Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
