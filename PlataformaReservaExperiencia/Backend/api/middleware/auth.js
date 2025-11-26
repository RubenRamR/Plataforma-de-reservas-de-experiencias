const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Token faltante' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contiene role, status, name, _id
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};
