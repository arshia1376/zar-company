const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("شما اجازه دسترسی به این دیتا رو ندارید");
    try {
        const admin = jwt.verify(token, config.get('jwtPrivateKey'));
        req.admin = admin;
        next()
    } catch (ex) {
        return res.status(401), send('1شما اجازه دسترسی به این دیتا رو ندارید"')
    }
}
