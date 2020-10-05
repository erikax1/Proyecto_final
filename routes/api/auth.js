const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY || 'miClave');
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'No tiene permiso'
        });
    }
};
