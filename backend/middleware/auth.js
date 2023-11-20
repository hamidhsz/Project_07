require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.MY_TOKEN_KEY);
        const userId = decodedToken.userId;

        if(req.body.userId && req.body.userId !== userId) {
            res.status(403).json({ message: 'Unauthorized request'});
        } else {
            next();
        }
    }
    catch(error) {
        res.status(401).json({ error: new Error('Invalid request') })
    }
};