require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet')
const app = express();

// Routes
const usersRoutes = require('./routes/users');
const publicationsRoutes = require('./routes/publications');
const commentsRoutes = require('./routes/comments')

app.use(express.json());
app.use(cors());
app.use(helmet())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use(express.urlencoded({extended: true}));

// Definition of the main accesses
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/users', usersRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/comments', commentsRoutes);

module.exports = app;