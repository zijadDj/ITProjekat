import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Validation from "./LoginValidation.js";
import axios from "axios";



function Login(){
    const [values, setValues] = useState({
        email:'',
        password:''
    })

    const navigate = useNavigate();
    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        if (!validationErrors.email && !validationErrors.password) {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data.status === "Success") {
                        navigate(`/home/${res.data.id}`);  // Redirect to /home with user ID
                    } else {
                        alert("No record exists.");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return(
        <div>
            <div>
                <h2>Log-in</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" name="email" placeholder="Enter Email" onChange={handleInput}/>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder="Enter Password" onChange={handleInput}/>
                        {errors.password && <span>{errors.password}</span>}
                    </div>
                    <button type="submit">Log in</button>
                    <Link to="/signup">Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login

