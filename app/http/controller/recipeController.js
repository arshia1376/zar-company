const _ = require("lodash");
const {validateRecipe, validateRecipeBox, validateRecipeMaterial} = require("../validator/recipeValidator");
const RecipeModel = require("../../models/recipe");
const MaterialModel = require("../../models/materials");



class RecipeController {

    //start recipeController

    async createRecipe(req, res) {
        const {error} = validateRecipe(req.body);
        if (error) return res.status(400).send(error.message);
        let recipe = new RecipeModel(
            _.pick(req.body, [
                'name',
            ]),
        );
        recipe = await recipe.save();
        res.send(recipe);
    }



    async sendEmail(req,res){

    }

    async getListRecipe(req, res) {
        const list = await RecipeModel.find().select('name recipeBoxs');
        res.send(list);
    }

    async getIdRecipe(req, res) {
        const id = req.params.id;
        const recipe = await RecipeModel.findById(id).select('name');
        if (!recipe) return res.status(404).send('not found recipeId');
        res.send(recipe);
    }

    async deleteRecipe(req, res) {
        const id = req.params.id;
        const result = await RecipeModel.findByIdAndRemove(id);
        res.send('delete');

    }

    async updateRecipe(req, res) {
        const id = req.params.id;
        const {error} = validateRecipe(req.body);
        if (error) return res.status(400).send(error.message);
        const result = await RecipeModel.findByIdAndUpdate(id, {
            $set: _.pick(req.body, [
                'name',
            ]),
        });
        if (!result) return res.status(404).send("not found");
        res.send(
            _.pick(req.body, [
                'name',
            ]),
        );
    }

    //end recipeController
    //start recipeBoxController

    // async recipeBox(req, res) {
    //     const id = req.params.id;
    //     const data = await RecipeModel.findById(id);
    //     if (!data) return res.status(400).send("قزمول مربوطه یافت نشد");
    //     const body = {
    //         name: req.body.name,
    //         boxType: req.body.boxType,
    //     }
    //     data.recipeBoxs.push(body)
    //     await data.save();
    //     res.send(true)
    // }

    async addMaterialToRecipeBox(req, res) {
        const requestBody = _.pick(req.body, ["weight","recipeId","recipeBoxId","materialId"]);
        if (!requestBody.weight) return res.status(400).send({message: "لطفا وزن ازسال کنید"});
        if (!requestBody.recipeId) return res.status(400).send({message: "لطفا فرمول ازسال کنید"});
        if (!requestBody.recipeBoxId) return res.status(400).send({message: "لطفا باکس ازسال کنید"});
        if (!requestBody.materialId) return res.status(400).send({message: "لطفا ماده ازسال کنید"});
        const weight=requestBody.weight;
        const recipe = await RecipeModel.findById(requestBody.recipeId);// finding current recipe
        const recipeBox = recipe.recipeBoxs.id(requestBody.recipeBoxId);// finding current box of recipe
        const material = await MaterialModel.findById(requestBody.materialId); //finding the new material
        recipeBox.recipeMaterials.push({"material":material,"weight":weight});// adding material to box
        await recipe.save();// save all
        res.send("ماده به باکس اضافه شد");
    }

    async updateMaterialToRecipeBox(req, res) {
        const requestBody = _.pick(req.body, ["weight","recipeId","recipeBoxId","materialId"]);
        if (!requestBody.weight) return res.status(400).send({message: "لطفا وزن ازسال کنید"});
        if (!requestBody.recipeId) return res.status(400).send({message: "لطفا فرمول ازسال کنید"});
        if (!requestBody.recipeBoxId) return res.status(400).send({message: "لطفا باکس ازسال کنید"});
        if (!requestBody.materialId) return res.status(400).send({message: "لطفا ماده ازسال کنید"});
        const weight=requestBody.weight;
        const recipe = await RecipeModel.findById(requestBody.recipeId);// finding current recipe
        const recipeBox = recipe.recipeBoxs.id(requestBody.recipeBoxId);// finding current box of recipe
        const material = await MaterialModel.findById(requestBody.materialId); //finding the new material
        recipeBox.recipeMaterials=[{"material": material, "weight": weight}];// adding material to box
        await recipe.save();// save all
        res.send("ماده به باکس اضافه شد");
    }

    async recipeBox(req, res) {
        const basketBody = _.pick(req.body, ["boxTypeId", "name"]);
        if (!basketBody.name) return res.status(400).send({message: "لطفا یک نام انتخاب کنید"});
        if (!basketBody.boxTypeId) return res.status(400).send({message: "لطفا مشخصات باکس رو انتخاب کنید"});

        const recipeID = req.params.id;
        const recipe = await RecipeModel.findById(recipeID);

        recipe.recipeBoxs = basketBody; //add box to recipe boxes
        await recipe.save();
        res.send("باکس به فرمول اضافه شد")
    }

    async getListForRecipeBox(req, res) {
        const id = req.params.id;
        const list = await RecipeModel.findById(id).select('recipeBoxs');
        res.send(list);
    }

    async deleteRecipeBox(req, res) {
        const id = req.params.id;
        const boxId = req.params.boxId;
        const result = await RecipeModel.findById(id);
        const recipeBox = result.recipeBoxs.id(boxId)
        if (recipeBox) {
            recipeBox.remove()
        } else {
            res.send("not found boxId")
        }
        await result.save();
        res.send(true);
    }

    async updateRecipeBox(req, res) {
        const id = req.params.id;
        const boxId = req.params.boxId;
        const result = await RecipeModel.findById(id)
        const recipeBox = result.recipeBoxs.id(boxId);
        if (recipeBox) {
            if (req.body.name)
                recipeBox.name = req.body.name
            if (req.body.boxTypeId)
                recipeBox.boxTypeId = req.body.boxTypeId
        } else {
            res.send("not found boxId")
        }
        await result.save();
        res.send(true);
    }

    //end recipeBoxController

}

module.exports = new RecipeController();