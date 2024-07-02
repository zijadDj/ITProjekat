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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/user/${id}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUser();
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
        </div>
    );
}

export default Home;