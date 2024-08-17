
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
    database: "project"
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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


app.post('/signup', upload.single('profilePic'), (req, res) => {
    const checkEmailSql = "SELECT * FROM Users WHERE email = ?";
    const insertUserSql = `
        INSERT INTO Users (name, email, password, JMBG, address, profile_pic, region, phone, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.JMBG,
        req.body.address,
        req.file ? req.file.filename : null,
        req.body.region,
        req.body.phone
    ];

    db.query(checkEmailSql, [req.body.email], (err, data) => {
        if (err) {
            console.log('Error checking email:', err);
            return res.status(500).json(err);
        }
        if (data.length > 0) {
            return res.status(400).json({ status: "Email already exists" });
        } else {
            db.query(insertUserSql, values, (err, data) => {
                if (err) {
                    console.log('Error inserting user:', err);
                    return res.status(500).json(err);
                }
                return res.json({ status: "Success" });
            });
        }
    });
});


app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;

    db.query("SELECT * FROM users WHERE user_id = ?", [userId], async (err, data) => {
        if (err) {
            return res.json(err);
        }

        if (data.length > 0 && data[0].role === 'admin') {
            db.query("SELECT user_id, name, email, JMBG, address, profile_pic, region FROM users", (err, accounts) => {
                if (err) {
                    return res.json(err);
                }
                return res.json({ status: "Admin", accounts });
            });
        } else {
            const user = {
                id: data[0].user_id,
                name: data[0].name,
                email: data[0].email,
                JMBG: data[0].JMBG,
                address: data[0].address,
                profilePic: data[0].profile_pic,
                region: data[0].region,
                bills: []
            };

            db.query("SELECT * FROM bills WHERE user_id = ?", [userId], (err, bills) => {
                if (err) {
                    return res.json(err);
                }
                user.bills = bills;
                return res.json(user);
            });
        }
    });
});



app.post('/login', (req, res) => {
    const sql = "SELECT * FROM Users WHERE email = ? AND password = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length > 0) {
            const user = data[0];
            if (user.role === 'admin') {
                return res.json({ status: "Admin", id: user.user_id, profilePic: user.profile_pic });
            } else {
                return res.json({ status: "Success", id: user.user_id, profilePic: user.profile_pic });
            }
        } else {
            return res.json({ status: "Failed" });
        }
    });
});

app.get('/account/:id', (req, res) => {
    const accountId = req.params.id;

    const sql = "SELECT id, name, email FROM users WHERE id = ?";
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
    const { userId, consumptionId, billingDate, dueDate, totalAmount } = req.body;

    // Validate input data
    if (!userId || !consumptionId || !billingDate || !dueDate || !totalAmount) {
        return res.status(400).json({ status: "Invalid input data" });
    }

    const sql = `INSERT INTO Bills (user_id, consumption_id, billing_date, due_date, total_amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'unpaid', NOW(), NOW())`;

    db.query(sql, [userId, consumptionId, billingDate, dueDate, totalAmount], (err, result) => {
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
    const sql = "INSERT INTO malfunction_reports (user_id, report_date, report_text) VALUES (?, NOW(), ?)";

    db.query(sql, [user_id, text_report], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.json({ status: "Report submitted" });
    });
});

app.get('/user-stats', async (req, res) => {
    try {
        const sql = `
            SELECT region, COUNT(*) as count 
            FROM users
            GROUP BY region
        `;
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                return res.json(results);
            }
        });
    } catch (err) {
        console.error('Error in /user-stats endpoint:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/monthly-bill-stats', (req, res) => {
    const sql = `
        SELECT MONTHNAME(billing_date) as month, SUM(total_amount) as total 
        FROM Bills 
        GROUP BY MONTHNAME(billing_date), MONTH(billing_date)
        ORDER BY MONTH(billing_date)
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching monthly bill stats:', err);
            return res.status(500).json({ message: 'Failed to fetch monthly bill stats', error: err });
        }
        res.json(results);
    });
});


app.get('/latest-bills', async (req, res) => {
    try {
        const sql = `
            SELECT users.name, bills.total_amount, bills.billing_date 
            FROM bills
            JOIN users ON bills.user_id = users.user_id
            ORDER BY bills.billing_date DESC
            LIMIT 9
        `;
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                const bills = results.map(row => ({
                    id: row.user_id,
                    user_name: row.name,
                    amount: row.total_amount,
                    date: row.billing_date
                }));
                return res.json(bills);
            }
        });
    } catch (err) {
        console.error('Error in /latest-bills endpoint:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/*
app.get('/reports', async (req, res) => {
    try {
        const sql = `
             SELECT mr.report_id, mr.user_id, mr.report_date, mr.report_text, mr.status, u.name as user_name
            FROM malfunction_reports mr
            JOIN users u ON mr.user_id = u.user_id
            ORDER BY mr.report_date DESC
        `;
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                const reports = results.map(row => ({
                    r_id: row.report_id,
                    u_id: row.user_id,
                    date: row.report_date,
                    text: row.report_text,
                    sts: row.status,
                }));
                return res.json(reports);
            }
        });
    } catch (err) {
        console.error('Error in /reports endpoint:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
*/ 


app.get('/bill/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT bill_id, billing_date, total_amount FROM Bills WHERE bill_id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching bill:', err);
            return res.status(500).json({ message: 'Failed to fetch bill', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        res.json(results[0]);
    });
});

app.post('/pay/:id', async (req, res) => {
    const { id } = req.params;
    const { cardNumber, expiryDate, cvv } = req.body;

    // Basic validation
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^[0-9]{3}$/;

    if (!cardNumberRegex.test(cardNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid card number' });
    }

    if (!expiryDateRegex.test(expiryDate)) {
        return res.status(400).json({ success: false, message: 'Invalid expiry date format' });
    }

    if (!cvvRegex.test(cvv)) {
        return res.status(400).json({ success: false, message: 'Invalid CVV' });
    }

    // Check if the expiry date is in the past
    const [month, year] = expiryDate.split('/');
    const expiryDateObject = new Date(`20${year}`, month - 1);

    if (expiryDateObject < new Date()) {
        return res.status(400).json({ success: false, message: 'Card expiry date is in the past' });
    }

    try {
        // Fetch the bill by ID
        const sqlGetBill = 'SELECT * FROM Bills WHERE bill_id = ?';
        db.query(sqlGetBill, [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            const bill = results[0];
            if (!bill) {
                return res.status(404).json({ success: false, message: 'Bill not found' });
            }

            if (bill.status === 'paid') {
                return res.status(400).json({ success: false, message: 'Bill is already paid' });
            }

            // Update the bill status to 'paid'
            const sqlUpdateBill = 'UPDATE Bills SET status = ? WHERE bill_id = ?';
            db.query(sqlUpdateBill, ['paid', id], (err, updateResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                res.json({ success: true, message: 'Payment successful' });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/reports', (req, res) => {
    const sql = 'SELECT report_id, user_id, report_date, report_text, status FROM malfunction_reports';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: "Server error" });
        }
        res.json(results);
    });
});

app.put('/report/status/:id', (req, res) => {
    const reportId = req.params.id;
    const { status } = req.body;

    if (!['open', 'in progress', 'closed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const sql = 'UPDATE malfunction_reports SET status = ? WHERE report_id = ?';
    db.query(sql, [status, reportId], (err, result) => {
        if (err) {
            console.error('Error updating report status:', err);
            return res.status(500).json({ error: 'Failed to update report status' });
        }
        return res.json({ message: 'Report status updated successfully' });
    });
});

app.get('/user/:id/reports', async (req, res) => {
    const userId = req.params.id;

    try {
        const sql = `
            SELECT report_id, user_id, report_date, report_text, status 
            FROM malfunction_reports 
            WHERE user_id = ? 
            ORDER BY report_date DESC
        `;
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching user reports:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.listen(8081, () => {
    console.log("Server started.");
});
