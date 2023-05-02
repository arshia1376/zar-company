const router = require("express").Router();
const AdminRoutes=require("./adminRoutes")
const MaterialsRoutes=require('./materialsRoutes')
const RecipeRoutes=require('./recipeRoutes')
const BoxRoutes=require('./boxRoutes');
const dynamicRoutes=require('./dynamicRoutes')
const jwt = require('jsonwebtoken');
const config = require("config");
const Auth=require('../http/middleware/auth')

router.use(function (req,res,next) {
    res.header('access-control-allow-origin','*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,x-auth-token,Content-Type,Accept'
    )
    res.header('x-auth-token','123');
    next();
})
router.use('/adminPanel',AdminRoutes)
router.use('/dynamic',dynamicRoutes)
router.use('/box',BoxRoutes)
router.use('/materials',MaterialsRoutes)
router.use('/recipe',RecipeRoutes)
module.exports = router;