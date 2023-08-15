const app = require('express')();
const jwt = require('jsonwebtoken');


// app.post('/signup', (req, res) => {
//     console.log(req.body);
//     // jwt.sign
//     res.json({ "message": "User has been made, please login" });
// });

// app.post('/login', async (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     const user = await User.findOne({ email });
//     const isMatch = await bcrypt.compare(password, user.password);
//     // jwt.verify
//     res.json({ "message": "User has been logged in" });
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

const express = require("express");
//const cors = require("cors");


var corsOptions = {
    origin: "http://localhost:3000"
};

//app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./models");


app.get("/", (req, res) => {
    res.json({ message: "Welcome to Login application." });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/scrape.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
