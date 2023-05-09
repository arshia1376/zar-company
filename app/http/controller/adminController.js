const AdminModel = require("../../models/admin");
const _ = require("lodash");
const phone = require('node-phonenumber');
const bcrypt = require("bcrypt");
const {
    validateCreateAdmin,
    loginValidator,
    validateCreateMaterials,
    validateCreateDate
} = require("../validator/adminValidator")
const jwt = require("jsonwebtoken");
const config = require("config");
const MaterialsModel = require("../../models/materials");
const DateModel = require("../../models/date");
const moment = require('jalali-moment');


class AdminController {

    async phoneNumber(req,res){
        const phoneNumberString = req.query.phone;
        const phoneUtil = phone.PhoneNumberUtil.getInstance();
        const phoneNumber = phoneUtil.parse(phoneNumberString,'IR');
        const toNumber = phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.INTERNATIONAL);
        res.send(toNumber)
    }

    async getAdminList(req, res) {
        const list = await AdminModel.find().select('name lastName code adminUsername phoneNumber accessLevel');
        res.send(list);
    }

    async postDate(req, res) {
        const {error} = validateCreateDate(req.body);
        if (error) return res.status(400).send(error.message);
        let Materials = new DateModel(
            _.pick(req.body, [
                'name',
                'email',
                'date',
            ]),
        );
        Materials = await Materials.save();
        // console.timeEnd("timer")
        res.send(Materials);
    }

    async twoDate(req, res) {
        try {
            const {startDate, endDate} = req.query;
            console.log("123123")
            // Query the database for users with birthdates between the start and end dates
            const users = await DateModel.find({
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            });

            res.json(users);
        } catch (error) {
            console.error('Error retrieving users:', error);
            res.status(500).send('An error occurred while retrieving users.');
        }
    }

    async setDate(req, res) {
        const specificDate = ['2023-01-01', '2021-01-01', '2019-01-01', '2010-02-01'];


        const {startDate} = req.query;
        console.log(startDate)
        for (let i = 0; i < specificDate.length; i++) {
            console.log(specificDate[i])
            if (specificDate[i] == startDate) {
                res.send("lock")
            }
        }

        res.send("accept")

        // Query the database for users with birthdates between the start and end dates

    }


    async createDate(req, res) {
        const {error} = validateCreateDate(req.body);
        const data = req.body;
        if (error) return res.status(400).send(error.message);
        var datee = moment(data.date, 'YYYY-M-D')
            .locale('fa')
            .format('YYYY/M/D');
        console.log(datee + ":test")
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