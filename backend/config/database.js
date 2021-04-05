const mongoose = require('mongoose');
require('dotenv').config();

const devConn = process.env.DB_STRING;
const prodConn = process.env.DB_STRING_PROD;

if(process.env.NODE_ENV === 'development') {
    mongoose.connect(devConn, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection.on('connection', () => {
        console.log('Development DB Connected');
    })
} else {
    mongoose.connect(prodConn, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection.on('connection', () => {
        console.log('Production DB Connected.');
    })
}

