function Validation(values){
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-3]{8,}$/

    if(values.email === ""){
        error.email = "Email cant be empty."
    }
    else if(!email_pattern.test(values.email)){
        error.email = "Email isnt correct"
    }
    else{
        error.email = ""
    }

    if(values.password === ""){
        error.password = "Password shouldnt be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password = "Password must be something else"
    }
    else{
        error.password = ""
    }

    return error;
}

export default Validation;