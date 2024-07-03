import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

/*function Home() {
    
    const People = () => {
        const [people, setPeople] = useState([]);

        useEffect(() => {
            const fetchAllPeople = async () => {
                try {
                    const res = await axios.get("https://localhost:8081/home");
                    setPeople(res.data);
                }catch(err){
                    console.log(err);
                }
            };
            fetchAllPeople();
        }, [])

        console.log(people);

        return (
            <div>
                <h1>People</h1>
                <div>
                    {People.map((man) => (
                        <div >
                            <h2>{man.name}</h2>
                            <p>{man.email}</p>
                            <span>{man.password}</span>
                            
                        </div>
                    ))}
                </div>
            
            </div>
    );
    }
   
    
}

export default Home;*/

/*function Home() {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const fetchAllPeople = async () => {
            try {
                const res = await axios.get("http://localhost:8081/home");
                setPeople(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllPeople();
    }, []);

    return (
        <div>
            <h1>People</h1>
            <div>
                {people.map((man) => (
                    <div key={man.email}>
                        <h2>{man.name}</h2>
                        <p>{man.email}</p>
                        <span>{man.password}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;*/

function Home() {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchUserAndBills = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/user/${id}`);
                setUser({
                    id: res.data.id,
                    name: res.data.name,
                    email: res.data.email,
                    password: res.data.password
                });
                setBills(res.data.bills);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserAndBills();
    }, [id]);

    return (
        <div>
            <h1>User Info</h1>
            {user && (
                <div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <span>{user.password}</span>
                </div>
            )}
            <h1>Bills</h1>
            <div>
                {bills.map((bill) => (
                    <div key={bill.id}>
                        <h2>Amount: {bill.amount}</h2>
                        <p>Date: {bill.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;