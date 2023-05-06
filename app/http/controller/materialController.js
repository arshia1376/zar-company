const MaterialsModel = require("../../models/materials");
const _ = require("lodash");
const {validateCreateAdmin, validateCreateMaterials} = require("../validator/adminValidator");
const AdminModel = require("../../models/admin");
const moment = require('moment');
const excelJS = require("exceljs");
const fs = require('fs');
const path = require('path')
const http = require('http')
class MaterialController {

    async downloadMaterial(req, res) {
        const fileUrl = './input1.txt'; // Replace with the actual file URL
        const fileName = 'input2.txt'; // Replace with the desired file name

        const file = fs.createWriteStream(fileName);
        const request = http.get(fileUrl, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(function() {
                    res.download(path.join(__dirname, fileName), function(err) {
                        if (err) {
                            // Handle error while downloading
                            console.error('Error while downloading:', err);
                        } else {
                            // Clean up the downloaded file
                            fs.unlinkSync(fileName);
                        }
                    });
                });
            });
        }).on('error', function(err) {
            // Handle error while making the request
            console.error('Error while making the request:', err);
        });

    }


    async createMaterials(req, res) {
        const {error} = validateCreateMaterials(req.body);
        if (error) return res.status(400).send(error.message);
        const Time = moment().calendar();
        let Materials = new MaterialsModel(
            _.pick(req.body, [
                'name',
            ]),
        );
        Materials = await Materials.save();
        // console.timeEnd("timer")
        res.send(Materials+' : '+Time);
    }

    async ListMaterialsDownload(req,res){
        const User = await MaterialsModel.find().select('name');
        const workbook = new excelJS.Workbook();  // Create a new workbook
        const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
        const path = "./files";  // Path to download excel
        // Column for data in excel. key must match data key
        worksheet.columns = [
            { header: "S no.", key: "s_no", width: 10 },
            { header: "name", key: "name", width: 10 }

        ];
// Looping through User data
        let counter = 1;
        User.forEach((user) => {
            user.s_no = counter;
            worksheet.addRow(user); // Add data in worksheet
            counter++;
        });
        //generate file
        fs.appendFile(`${path}/materials.xlsx`, 'Hello content!', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        //delete file
        // fs.unlink(`${path}/users.xlsx`, function (err) {
        //     if (err) throw err;
        //     console.log('File deleted!');
        // });

        //rename file
        // fs.rename(`${path}/users.xlsx`, `${path}/users11.xlsx`, function (err) {
        //     if (err) throw err;
        //     console.log('File Renamed!');
        // });

// Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        try {
            const data = await workbook.xlsx.writeFile(`${path}/materials.xlsx`)
                .then(() => {
                    res.send({
                        status: "success",
                        message: "file successfully downloaded",
                        path: `${path}/users.xlsx`,
                    });
                });
        } catch (err) {
            res.send({
                status: "error",
                message: err.message,
            });
        }
    }

    async getListMaterials(req, res) {
        const list = await MaterialsModel.find().select('name');
        res.send(list);
    }

    async getIdMaterials(req, res) {
        const id = req.params.id;
        const materials = await MaterialsModel.findById(id).select('name ');
        if (!materials) return res.status(404).send('not found materialsId');
        res.send(materials);
    }

    async fakeMaterial(req,res){
        for (var i = 0; i < 10; i++) {
            var fake = new MaterialsModel({
                name: faker.name.firstName()

            });
            fake.save((err, data) => {
                if (err) {
                    console.log(err);
                }
                res.send(fake)
            });
        }
    }

    async deleteMaterials(req, res) {
        const id = req.params.id;
        const result = await MaterialsModel.findByIdAndRemove(id);
        res.send('delete');
    }

    async updateMaterials(req, res) {
        const id = req.params.id;
        const {error} = validateCreateMaterials(req.body);
        if (error) return res.status(400).send(error.message);
        const result = await MaterialsModel.findByIdAndUpdate(id, {
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
}

module.exports = new MaterialController();