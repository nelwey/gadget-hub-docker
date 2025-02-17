const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('./cart');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = 3000;

const mongoURI = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27019/cart-db?authSource=admin';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB cart'))
    .catch(err => console.error('Could not connect to MongoDB cart:', err));

app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server cart is running on http://0.0.0.0:${PORT}`);
});
