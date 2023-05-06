const AdminModel = require("../../models/admin");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {validateCreateAdmin, loginValidator, validateCreateMaterials,validateCreateDate} = require("../validator/adminValidator")
const jwt = require("jsonwebtoken");
const config = require("config");
const MaterialsModel = require("../../models/materials");
const moment = require('jalali-moment');


class AdminController {
    async getAdminList(req, res) {
        const list = await AdminModel.find().select('name lastName code adminUsername phoneNumber accessLevel');
        res.send(list);
    }



    async createDate(req, res) {
        const {error} = validateCreateDate(req.body);
        const data=req.body;
        if (error) return res.status(400).send(error.message);
        var datee= moment(data.date, 'YYYY-M-D')
            .locale('fa')
            .format('YYYY/M/D');
        console.log(datee+":test")
        data.date = datee;

        let Date = new MaterialsModel(

            _.pick(data, [
                'date',
            ]),
        );
        Date = await Date.save();
        // console.timeEnd("timer")
        res.send(Date);
    }

    async getIdAdmin(req, res) {
        const id = req.params.id;
        const admin = await AdminModel.findById(id).select('-adminPassword');
        if (!admin) return res.status(404).send('not found adminId');
        res.send(admin);
    }


    async createAdmin(req, res) {
        const {error} = validateCreateAdmin(req.body);
        if (error) return res.status(400).send(error.message);
        let admin = new AdminModel(
            _.pick(req.body, [
                'name',
                'phoneNumber',
                'lastName',
                'accessLevel',
                'code',
                'email',
                'adminUsername',
                'adminPassword',
            ]),
        );
        const salt = await bcrypt.genSalt(10);
        admin.adminPassword = await bcrypt.hash(admin.adminPassword, salt);
        admin = await admin.save();
        res.send(admin);
    }

    async login(req, res) {
        const {error} = loginValidator(req.body);
        if (error) return res.status(400).send(error.message);
        let admin = await AdminModel.findOne({adminUsername: req.body.userName});
        if (!admin) return res.status(400).send({message: " ادمینی با نام کاربری یا یسورد یافت نشد"});
        const result = await bcrypt.compare(req.body.password, admin.adminPassword);
        if (!result) return res.status(400).send({message: " ادمینی نام کاربری یا یسورد یافت نشد"});
        const token = admin.generateAuthToken();
        res.header("Access-Control-Expose-headers", 'x-auth-token').header('x-auth-token', token).status(200).send({success: true});
    }

    async adminSearch(req, res) {
        const requestBody = _.pick(req.body, ["name"]);
        if (!requestBody.name) return res.status(400).send({message: "لطفا نام ازسال کنید"});
        let Name = requestBody.name;
        const search = await AdminModel.findOne({name: {'$regex': Name}});
        res.send(search.adminUsername);
    }

    async update(req, res) {
        const id = req.params.id;
        const {error} = validateCreateAdmin(req.body);
        if (error) return res.status(400).send(error.message);
        const result = await AdminModel.findByIdAndUpdate(id, {
            $set: _.pick(req.body, [
                'name',
                'phoneNumber',
                'lastName',
                'accessLevel',
                'code',
                'email',
                'adminUsername',
                'adminPassword',
            ]),
        });
        if (!result) return res.status(404).send("not found");
        res.send(
            _.pick(req.body, [
                'name',
                'phoneNumber',
                'lastName',
                'accessLevel',
                'code',
                'email',
                'adminUsername',
                'adminPassword',
            ]),
        );
    }

    async delete(req, res) {
        const id = req.params.id;
        const result = await AdminModel.findByIdAndRemove(id);
        res.send('delete');
    }
}

module.exports = new AdminController();