const router = require("express").Router();
const Auth =require("../http/middleware/auth");
const panelAdmin =require("../http/middleware/panelAdmin");
const controller = require("../http/controller/recipeController");
//recipe
router.post('/createRecipe',controller.createRecipe);
router.get('/getListRecipe',controller.getListRecipe);
router.get('/getIdRecipe',controller.getIdRecipe);
router.delete('/deleteRecipe',controller.deleteRecipe);
router.put('/createRecipe',controller.updateRecipe);

//send email
router.get('/sendEmail',controller.sendEmail);

//recipe box
router.post('/recipeBox/:id',controller.recipeBox);
router.get('/getListForRecipeBox/:id',controller.getListForRecipeBox);
router.delete('/deleteRecipeBox/:id/:boxId',controller.deleteRecipeBox);
router.put('/updateRecipeBox/:id/:boxId',controller.updateRecipeBox);

//recipe material box
router.post('/addMaterialToRecipeBox',controller.addMaterialToRecipeBox);
router.put('/updateMaterialToRecipeBox',controller.updateMaterialToRecipeBox);


module.exports = router;