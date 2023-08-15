// mongo db connection 
const mongoose = require('mongoose');

// Replace 'YOUR_MONGODB_URI' with your actual MongoDB Atlas connection URI
const dbURI = 'YOUR_MONGODB_URI';

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB Connection Error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB Cloud');
    // Start your application logic here
});

module.exports = db;
