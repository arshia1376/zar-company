const jwt = require("jsonwebtoken");
const config = require("config");
module. exports = function (req, res, next) {
  try{
      const role=req.admin.role
      if (role==="zarAdmin")
          return next();
      else
          return res.status(401).send("اجازه دسترسی به دیتا رو ندارید")
  }catch (err){
      console.log(err)
  }
}
