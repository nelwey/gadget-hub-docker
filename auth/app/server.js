const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000; 

const mongoURI = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/auth-db?authSource=admin';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB auth'))
    .catch(err => console.error('Could not connect to MongoDB auth:', err));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server auth is running on http://0.0.0.0:${PORT}`);
});
