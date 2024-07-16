import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"


function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        JMBG: '',
        address: ''
    });

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };
    
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/signup', values)
            .then(res => {
                if (res.data.status === "Success") {
                    navigate('/')
                } else {
                    
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleInput} required />
                <input type="email" name="email" placeholder="Email" onChange={handleInput} required />
                <input type="password" name="password" placeholder="Password" onChange={handleInput} required />
                <input type="text" name="JMBG" placeholder="JMBG" onChange={handleInput} required pattern="\d{13}" />
                <input type="text" name="address" placeholder="Address" onChange={handleInput} required />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;