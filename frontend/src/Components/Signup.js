import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';
import '../Styles/testSignup.css'


/*function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        JMBG: '',
        address: '',
        region: 'Sjeverni', // Set default value for the region
        phone: ''
    });

    const [emailError, setEmailError] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file);
        }
    };
    
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateEmail(values.email)) {
            setEmailError(true); // Show floating error message
            return;
        } else {
            setEmailError(false); // Clear error if email is valid
        }

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
        <div className="body-signup">
            <div className="signup-content">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="column">
                        <input type="text" name="name" placeholder="Name" onChange={handleInput} required />
                        <div className="email-container">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                onChange={handleInput} 
                                required 
                            />
                            {emailError && (
                                <div className="email-error-float">
                                    Invalid email address!
                                </div>
                            )}
                        </div>
                        <input type="password" name="password" placeholder="Password" onChange={handleInput} required />
                        <input type="text" name="JMBG" placeholder="JMBG" onChange={handleInput} required pattern="\d{13}" />
                        <input type="text" name="address" placeholder="Address" onChange={handleInput} required />
                    </div>
                    <div className="column">
                        
                        <select name="region" onChange={handleInput} value={values.region} required>
                            <option value="Sjeverni">Sjeverni</option>
                            <option value="Juzni">Juzni</option>
                            <option value="Centralni">Centralni</option>
                        </select>
                        <input type="text" name="phone" placeholder="Phone Number" onChange={handleInput}></input>
                        <div className="file-input-container">
                            <input 
                                type="file" 
                                name="profilePic" 
                                className="file-input" 
                                onChange={handleFileChange} 
                                required 
                            />
                            <label className="file-label">
                                {preview ? (
                                    <img src={preview} alt="Profile Preview" className="file-preview" />
                                ) : (
                                    <>
                                        <span className="plus-sign">+</span>
                                        <span className="file-text">Choose your profile picture</span>
                                    </>
                                )}
                            </label>
                        </div>
                        
                    </div>        
                </form>

                <div className="button-submit-container">
                    <button className="button-submit" type="submit">Signup</button>
                </div>
            </div>
        </div>
    );

}

export default Signup;*/

/*function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        JMBG: '',
        address: '',
        region: 'Sjeverni',
        phone: ''
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
        <div className="container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit} className="form-group">
                <input type="text" name="name" placeholder="Name" onChange={handleInput} required className="form-control mb-2"/>
                <input type="email" name="email" placeholder="Email" onChange={handleInput} required className="form-control mb-2"/>
                <input type="password" name="password" placeholder="Password" onChange={handleInput} required className="form-control mb-2"/>
                <input type="text" name="JMBG" placeholder="JMBG" onChange={handleInput} required pattern="\d{13}" className="form-control mb-2"/>
                <input type="text" name="address" placeholder="Address" onChange={handleInput} required className="form-control mb-2"/>
                <select name="region" onChange={handleInput} value={values.region} required className="form-control mb-2">
                    <option value="Sjeverni">Sjeverni</option>
                    <option value="Juzni">Juzni</option>
                    <option value="Centralni">Centralni</option>
                </select>
                <input type="text" name="phone" placeholder="Phone Number" onChange={handleInput} className="form-control mb-2"/>
                <input type="file" name="profilePic" required className="form-control mb-2"/>
                <button type="submit" className="btn btn-primary">Signup</button>
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
        region: 'Sjeverni', // Set default value for the region
        phone: ''
    });

    const [emailError, setEmailError] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };
    
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateEmail(values.email)) {
            setEmailError(true); // Show floating error message
            return;
        } else {
            setEmailError(false); // Clear error if email is valid
        }

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="body-signup">
            <div className="signup-content">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-column-left">
                            <input className="input-signup" type="text" name="name" placeholder="Name" onChange={handleInput} required />
                            <div className="email-container">
                                <input 
                                    className="input-signup"
                                    type="email" 
                                    name="email" 
                                    placeholder="Email" 
                                    onChange={handleInput} 
                                    required 
                                />
                                {emailError && (
                                    <div className="email-error-float">
                                        Invalid email address!
                                    </div>
                                )}
                            </div>
                            <input className="input-signup" type="password" name="password" placeholder="Password" onChange={handleInput} required />
                            <input className="input-signup" type="text" name="JMBG" placeholder="JMBG" onChange={handleInput} required pattern="\d{13}" />
                            <input className="input-signup" type="text" name="address" placeholder="Address" onChange={handleInput} required />
                        </div>
                        
                        <div className="form-column-right">
                            <select className="input-signup" name="region" onChange={handleInput} value={values.region} required>
                                <option value="Sjeverni">Sjeverni</option>
                                <option value="Juzni">Juzni</option>
                                <option value="Centralni">Centralni</option>
                            </select>
                            <input  className="input-signup" type="text" name="phone" placeholder="Phone Number" onChange={handleInput}></input>
                            <div className="file-input-container">
                                <input 

                                    type="file" 
                                    name="profilePic" 
                                    className="file-input" 
                                    id="profilePic" 
                                    onChange={handleFileChange} 
                                    required 
                                />
                                <label className="file-label" htmlFor="profilePic">
                                    {preview ? (
                                        <img src={preview} alt="Profile Preview" className="file-preview" />
                                    ) : (
                                        <>
                                            <span className="plus-sign">+</span>
                                            
                                        </>
                                    )}
                                </label>
                                <p className="file-text">Choose your profile picture</p>
                        </div>
                    </div>
                </div>
                    <button className="button-submit" type="submit">Signup</button>
                </form>
            </div>
        </div>
    );

}

export default Signup;