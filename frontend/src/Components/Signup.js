import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"

//RADI PROF
/*function Signup() {
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

export default Signup;*/

//RADI SLIKA
/*function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        JMBG: '',
        address: ''
    });
    const [profilePic, setProfilePic] = useState(null);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleFileInput = (event) => {
        setProfilePic(event.target.files[0]);
    };

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('JMBG', values.JMBG);
        formData.append('address', values.address);
        formData.append('profilePic', profilePic);

        axios.post('http://localhost:8081/signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                if (res.data.status === "Success") {
                    navigate('/');
                } else {
                    console.log(res.data); // Handle error or display message
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
                <input type="file" name="profilePic" onChange={handleFileInput} />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;*/

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        JMBG: '',
        address: '',
        region: 'Sjeverni' // Set default value for the region
    });

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        for (const key in values) {
            formData.append(key, values[key]);
        }
        formData.append('profilePic', event.target.profilePic.files[0]);

        axios.post('http://localhost:8081/signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            if (res.data.status === "Success") {
                navigate('/');
            } else {
                console.log(res.data.status);
            }
        })
        .catch(err => {
            console.log(err);
        });
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
                <select name="region" onChange={handleInput} value={values.region} required>
                    <option value="Sjeverni">Sjeverni</option>
                    <option value="Juzni">Juzni</option>
                    <option value="Centralni">Centralni</option>
                </select>
                <input type="file" name="profilePic" required />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;