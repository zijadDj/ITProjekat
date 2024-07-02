import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";
import axios from "axios"

function Signup() {
    const [values, setValues] = useState({
        name:'',
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
        setErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/signup', values)
            .then(res => {
                navigate('/')
            })
            .catch(err => console.log(err));
        }
    }


    return(
        <div>
            <div>
                <h2>Sign-up</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input type="text" name="name" placeholder="Enter Name" onChange={handleInput}/>
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>
                    <div>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" name="email" placeholder="Enter Email" onChange={handleInput} />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder="Enter Password" onChange={handleInput} />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <button type="submit">Sign up</button>
                    <Link to="/">Login</Link>
                    
                </form>
            </div>
        </div>
    )
}

export default Signup