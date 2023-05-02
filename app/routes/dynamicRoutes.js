const router = require("express").Router();
const Auth =require("../http/middleware/auth");
const panelAdmin =require("../http/middleware/panelAdmin");
const controller = require("../http/controller/dynamicController");
//recipe Box
router.post('/createDynamic',controller.createDynamic);
router.get('/getDynamicList',controller.getDynamicList);

module.exports = router;