const express = require('express');
const app = express();
const passport = require('passport');

// require('dotenv').config();
require('./config/database');
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(express.json());
// app.use(express.urlencoded({extended: false}));

app.use(require('./routers/index'));

app.listen(3000, () => {
    console.log('listening 3000');
});