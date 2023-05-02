const _ = require("lodash");
const {validateCreateFormDynamic} = require("../validator/adminValidator");
const DynamicModel = require("../../models/formDynamic");
const AdminModel = require("../../models/admin");

class DynamicController {

    async createDynamic(req, res) {
        let Body=req.body
        // const {error} = validateCreateFormDynamic(req.body);
        // if (error) return res.status(400).send(error.message);
        let dynamic = new DynamicModel(
            _.pick(Body, [
                'name',
                'label',
                'value',
                'placeholder',
                'type',
                'pattern',
                'min',
                'max',
                'fieldOptions',
                'field',
                'arrange',
                'step',
                'required',
                'checkExistUrl',
            ]),
        );
        dynamic = await dynamic.save();
        res.send(dynamic);
    }

    async getDynamicList(req, res) {
        const list = await DynamicModel.find().select('name label value placeholder type pattern min max fieldOptions field arrange step required checkExistUrl');
        res.send(list);
    }
}

module.exports = new DynamicController();