
const _ = require("lodash");
const {validateCreatebox} = require("../validator/boxValidator");
const BoxModel = require("../../models/box");


class BoxController {
    async createBox(req, res) {
        const {error} = validateCreatebox(req.body);
        if (error) return res.status(400).send(error.message);
        let box = new BoxModel(
            _.pick(req.body, [
                'name',
                'weight'
            ]),
        );
        box = await box.save();
        res.send(box);
    }

    async getListBox(req, res) {
        const list = await BoxModel.find().select('name weight');
        res.send(list);
    }

    async getIdBox(req, res) {
        const id = req.params.id;
        const box = await BoxModel.findById(id).select('name weight');
        if (!box) return res.status(404).send('not found boxId');
        res.send(box);
    }

    async deleteBox(req, res) {
        const id = req.params.id;
        const result = await BoxModel.findByIdAndRemove(id);
        if (!result)return res.status(404).send('not found boxId');
        res.send('delete');
    }

    async updateBox(req, res) {
        const id = req.params.id;
        const {error} = validateCreatebox(req.body);
        if (error) return res.status(400).send(error.message);
        const result = await BoxModel.findByIdAndUpdate(id, {
            $set: _.pick(req.body, [
                'name',
                'weight'
            ]),
        });
        if (!result) return res.status(404).send("not found");
        res.send(
            _.pick(req.body, [
                'name',
                'weight'
            ]),
        );
    }

}

module.exports = new BoxController();