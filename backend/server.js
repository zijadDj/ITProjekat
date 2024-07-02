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

app.get("/home", (req, res) => {
    const q = "SELECT * FROM login";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  });


app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err){
            return res.json(err);
        }
        if(data.length > 0){
            return res.json("Success");
        }else{
            return res.json("Failed");
        }
        
    })
})

app.listen(8081, () => {
    console.log("Server started.");
})