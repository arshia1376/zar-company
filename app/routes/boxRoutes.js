const router = require("express").Router();

const Auth =require("../http/middleware/auth");
const panelAdmin =require("../http/middleware/panelAdmin");
const controller = require("../http/controller/boxController");
//recipe Box
router.post('/addboxToRecipe',[Auth],controller.createBox);

router.get('/getListForBox',controller.getListBox);

router.get('/getIdBox/:id',controller.getIdBox);
router.put('/updateBox/:id',controller.updateBox);
router.delete('/deleteBox/:id',controller.deleteBox);
module.exports = router;