
import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fcbarselona1",
    database: "signup"
});



const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


//RADI PROF
/*app.post('/signup', (req, res) => {
    const checkEmailSql = "SELECT * FROM login WHERE email = ?";
    const insertUserSql = "INSERT INTO login (name, email, password, JMBG, address) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.JMBG,
        req.body.address
    ];

    db.query(checkEmailSql, [req.body.email], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length > 0) {
            return res.json({ status: "Email already exists" });
        } else {
            db.query(insertUserSql, [values], (err, data) => {
                if (err) {
                    return res.json(err);
                }
                return res.json({ status: "Success" });
            });
        }
    });
});*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//RADI SLIKA
/*app.post('/signup', upload.single('profilePic'), (req, res) => {
    console.log('Request received:', req.body, req.file); // Log the request data

    const checkEmailSql = "SELECT * FROM login WHERE email = ?";
    const insertUserSql = "INSERT INTO login (name, email, password, JMBG, address, profile_pic) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.JMBG,
        req.body.address,
        req.file ? req.file.filename : null
        
    ];

    db.query(checkEmailSql, [req.body.email], (err, data) => {
        if (err) {
            console.log('Error checking email:', err); // Log the error
            return res.status(500).json(err); // Add status code for error
        }
        if (data.length > 0) {
            return res.status(400).json({ status: "Email already exists" }); // Add status code for error
        } else {
            db.query(insertUserSql, [values], (err, data) => {
                if (err) {
                    console.log('Error inserting user:', err); // Log the error
                    return res.status(500).json(err); // Add status code for error
                }
                return res.json({ status: "Success" });
            });
        }
    });
});*/

app.post('/signup', upload.single('profilePic'), (req, res) => {
    const checkEmailSql = "SELECT * FROM login WHERE email = ?";
    const insertUserSql = "INSERT INTO login (name, email, password, JMBG, address, profile_pic, region) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.JMBG,
        req.body.address,
        req.file ? req.file.filename : null,
        req.body.region // Ensure this field is included
    ];

    db.query(checkEmailSql, [req.body.email], (err, data) => {
        if (err) {
            console.log('Error checking email:', err);
            return res.status(500).json(err);
        }
        if (data.length > 0) {
            return res.status(400).json({ status: "Email already exists" });
        } else {
            db.query(insertUserSql, [values], (err, data) => {
                if (err) {
                    console.log('Error inserting user:', err);
                    return res.status(500).json(err);
                }
                return res.json({ status: "Success" });
            });
        }
    });
});

//RADI PROF
/*app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const adminEmail = "admin@gmail.com";

    db.query("SELECT * FROM login WHERE id = ?", [userId], async (err, data) => {
        if (err) {
            return res.json(err);
        }

        if (data.length > 0 && data[0].email === adminEmail) {
            db.query("SELECT id, name, email, JMBG, address FROM login", (err, accounts) => {
                if (err) {
                    return res.json(err);
                }
                return res.json({ status: "Admin", accounts });
            });
        } else {
            const user = {
                id: data[0].id,
                name: data[0].name,
                email: data[0].email,
                JMBG: data[0].JMBG,
                address: data[0].address,
                bills: []
            };

            const fetchBills = async (month) => {
                return new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM ${month} WHERE user_id = ?`, [userId], (err, bills) => {
                        if (err) return reject(err);
                        bills.forEach(bill => {
                            bill.month = month;
                            user.bills.push(bill);
                        });
                        resolve();
                    });
                });
            };

            try {
                for (const month of months) {
                    await fetchBills(month);
                }
                return res.json(user);
            } catch (err) {
                return res.json(err);
            }
        }
    });
});*/

app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const adminEmail = "admin@gmail.com";

    db.query("SELECT * FROM login WHERE id = ?", [userId], async (err, data) => {
        if (err) {
            return res.json(err);
        }

        if (data.length > 0 && data[0].email === adminEmail) {
            db.query("SELECT id, name, email, JMBG, address, profile_pic, region FROM login", (err, accounts) => {
                if (err) {
                    return res.json(err);
                }
                return res.json({ status: "Admin", accounts });
            });
        } else {
            const user = {
                id: data[0].id,
                name: data[0].name,
                email: data[0].email,
                JMBG: data[0].JMBG,
                address: data[0].address,
                profilePic: data[0].profile_pic,
                region:data[0].region,
                bills: []
            };

            const fetchBills = async (month) => {
                return new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM ${month} WHERE user_id = ?`, [userId], (err, bills) => {
                        if (err) return reject(err);
                        bills.forEach(bill => {
                            bill.month = month;
                            user.bills.push(bill);
                        });
                        resolve();
                    });
                });
            };

            try {
                for (const month of months) {
                    await fetchBills(month);
                }
                return res.json(user);
            } catch (err) {
                return res.json(err);
            }
        }
    });
});


//RADI PROF
/*app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length > 0) {
            if (req.body.email === adminEmail && req.body.password === adminPassword) {
                return res.json({ status: "Admin", id: data[0].id });
            } else {
                return res.json({ status: "Success", id: data[0].id });
            }
        } else {
            return res.json({ status: "Failed" });
        }
    });
});*/

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const adminEmail = "admin@gmail.com";
    const adminPassword = "ADmin121212";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length > 0) {
            if (req.body.email === adminEmail && req.body.password === adminPassword) {
                return res.json({ status: "Admin", id: data[0].id, profilePic: data[0].profile_pic });
            } else {
                return res.json({ status: "Success", id: data[0].id, profilePic: data[0].profile_pic });
            }
        } else {
            return res.json({ status: "Failed" });
        }
    });
});

app.get('/account/:id', (req, res) => {
    const accountId = req.params.id;

    const sql = "SELECT id, name, email FROM login WHERE id = ?";
    db.query(sql, [accountId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length > 0) {
            return res.json(data[0]);
        } else {
            return res.json({ status: "Account not found" });
        }
    });
});

app.post('/addBill', (req, res) => {
    const { userId, month, cost } = req.body;

    // Validate the month
    const validMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (!validMonths.includes(month)) {
        return res.status(400).json({ status: "Invalid month" });
    }

    const sql = `INSERT INTO ${mysql.escapeId(month)} (user_id, amount, date) VALUES (?, ?, NOW())`;

    db.query(sql, [userId, cost], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.json({ status: "Success" });
    });
});



app.delete('/account/:id', (req, res) => {
    const accountId = req.params.id;
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    
    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json(err);
        }

        const deleteBills = months.map(month => {
            return new Promise((resolve, reject) => {
                const sql = `DELETE FROM ${month} WHERE user_id = ?`;
                db.query(sql, [accountId], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });

        Promise.all(deleteBills)
            .then(() => {
                const deleteAccountSql = "DELETE FROM login WHERE id = ?";
                db.query(deleteAccountSql, [accountId], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }
                        res.json({ status: "Success" });
                    });
                });
            })
            .catch(err => {
                db.rollback(() => {
                    res.status(500).json(err);
                });
            });
    });
});

app.post('/report', (req, res) => {
    const { user_id, text_report } = req.body;
    const sql = "INSERT INTO report (user_id, text_report, date) VALUES (?, ?, NOW())";

    db.query(sql, [user_id, text_report], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.json({ status: "Report submitted" });
    });
});

app.get('/user-stats', (req, res) => {
    const sql = `
        SELECT region, COUNT(*) as count
        FROM login
        GROUP BY region
    `;
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data);
    });
});

app.get('/monthly-bill-stats', (req, res) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const promises = months.map(month => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT SUM(amount) as total FROM ${mysql.escapeId(month)}`;
            db.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ month, total: result[0].total || 0 });
            });
        });
    });

    Promise.all(promises)
        .then(results => res.json(results))
        .catch(err => res.status(500).json(err));
});


app.listen(8081, () => {
    console.log("Server started.");
});
