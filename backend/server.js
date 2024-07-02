import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"fcbarselona1",
    database:"signup"
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]

    db.query(sql, [values], (err, data) => {
        if(err){
            return res.json(err);
        }

        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("Server started.");
})