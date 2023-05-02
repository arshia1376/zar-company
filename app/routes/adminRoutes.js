const router = require("express").Router();
const multer=require("multer")
const controller=require("../http/controller/adminController");

//settimeout block ip login
const ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);
//upload img option admin
const storage = multer.diskStorage({
    destination: function (req, file, cb) {cb(null, 'uploads/')},
    filename: function (req, file, cb) {cb(null,Date.now()+ '-'+file.originalname)}
})
var upload = multer({ storage: storage });

router.post("/adminCreate",controller.createAdmin);
router.post("/createDate",controller.createDate);
router.post("/login",bruteforce.prevent,controller.login)
router.post("/adminSearch",controller.adminSearch);


router.get("/getAdminList",controller.getAdminList);


router.get("/getAdminId/:id",controller.getIdAdmin);
router.put("/update/:id",controller.update);
router.delete("/delete/:id",controller.delete);

module.exports = router;