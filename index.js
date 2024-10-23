const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// Middleware to parse JSON requests
app.use(bodyParser.json());
const db = mysql.createConnection({
    host: 'mysql-container',
    port: 3307,  
    user: 'root',
    password: 'myd',  // Blank password
    database: 'student_db'
});

// Function to connect to the database using async/await
const connectToDatabase = async () => {
    try {
        // Wrap db.connect in a Promise
        await new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    reject(new Error('Database connection failed: ' + err.stack));
                } else {
                    console.log('Connected to MySQL database.');
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);  // Exit process if database connection fails
    }
};

// Call the function to connect to the database
connectToDatabase();
app.get('/', (req, res) => {
    res.send('Welcome to the Student API!');
});
// POST endpoint to add a new student
app.post('/student', async (req, res) => {
    const { studentID, studentName, course, presentDate } = req.body;
    const query = `INSERT INTO students (studentID, studentName, course, presentDate) VALUES (?, ?, ?, ?)`;

    try {
        // Wrap the db.query function in a Promise to use async/await
        const result = await new Promise((resolve, reject) => {
            db.query(query, [studentID, studentName, course, presentDate], (err, result) => {
                if (err) {
                    reject(err);  // Reject on error
                } else {
                    resolve(result);  // Resolve on success
                }
            });
        });

        // Send success response
        res.status(201).json({ message: 'Student created successfully', result });

    } catch (error) {
        // Handle query or any other errors
        res.status(500).json({ message: 'Error inserting data', error });
    }
});
app.put('/student/update', async (req, res) => {
    
    const {studentID, studentName, course, presentDate } = req.body;

    // SQL query to update the student's information
    const query = `UPDATE students SET studentName = ?, course = ?, presentDate = ? WHERE studentID = ?`;

   
   
    try {
        // Wrap the db.query function in a Promise to use async/await
        const updateResult = await new Promise((resolve, reject) => {
            db.query(query, [studentName, course, presentDate, studentID], (err, result) => {
                if (err) {
                    reject(err);  // Reject on error
                } else if (result.affectedRows === 0) {
                    resolve(null);  // Resolve null if no rows were updated (student not found)
                } else {
                    resolve(result);  // Resolve on success
                }
            });
        });

        if (!updateResult) {
            // Send a 404 response if no rows were affected (i.e., student not found)
            res.status(404).json({ message: 'Student not found' });
        } else {
            // Send success response without the result
            res.status(200).json({ message: 'Student updated successfully' });
        }
    } catch (error) {
        // Handle query or any other errors
        res.status(500).json({ message: 'Error updating data', error });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
