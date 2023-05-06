const router = require("express").Router();
const controller=require("../http/controller/materialController");
const Auth =require("../http/middleware/auth");
const panelAdmin =require("../http/middleware/panelAdmin");
router.post('/createMaterials',controller.createMaterials);
router.get('/getListMaterials',controller.getListMaterials);
router.get('/downloadMaterial',controller.downloadMaterial);
router.get('/getIdMaterials/:id',controller.getIdMaterials);
router.put('/updateMaterials/:id',controller.updateMaterials);
router.delete('/deleteMaterials/:id',controller.deleteMaterials);
router.get('/ListMaterialsDownload',controller.ListMaterialsDownload);
// router.post('/fakeMaterial',controller.fakeMaterial);

module.exports = router;