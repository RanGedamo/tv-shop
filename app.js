require('dotenv').config();
require('./DB');

const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// views //
const viewRoutes = require('./routes/viewRoutes');
app.use('/', viewRoutes);
// views //


const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
