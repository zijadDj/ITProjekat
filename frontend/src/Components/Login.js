import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import '../Styles/login.css'

//RADI PROF
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
                <h1>Power&Co</h1>
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

/*function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [profilePic, setProfilePic] = useState(null);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                if (res.data.status === "Success") {
                    setProfilePic(res.data.profilePic); // Set profile picture
                    navigate('/home', { state: { id: res.data.id, profilePic: res.data.profilePic } });
                } else if (res.data.status === "Admin") {
                    setProfilePic(res.data.profilePic); // Set profile picture
                    navigate('/admin', { state: { id: res.data.id, profilePic: res.data.profilePic } });
                } else {
                    console.log("Login failed");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <img src={require('../logo.png')} className="logo"/>
            <h1>Power&Co</h1>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleInput} required />
                <input type="password" name="password" placeholder="Password" onChange={handleInput} required />
                <button type="submit">Login</button>
            </form>
            {profilePic && <img src={`http://localhost:8081/uploads/${profilePic}`} alt="Profile" />}
        </div>
    );
}

export default Login;*/
