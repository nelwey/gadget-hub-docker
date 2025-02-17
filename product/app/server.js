const express = require('express');
const bodyParser = require('body-parser');
const productsRoutes = require('./products');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = 3000;

const mongoURI = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27018/product-db?authSource=admin';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB product'))
    .catch(err => console.error('Could not connect to MongoDB product:', err));

app.use('/api/product', productsRoutes);

app.listen(PORT, () => {
    console.log(`Server product is running on http://0.0.0.0:${PORT}`);
});