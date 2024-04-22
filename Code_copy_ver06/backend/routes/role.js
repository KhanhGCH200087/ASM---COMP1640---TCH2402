var express = require('express');
var router = express.Router();

//import model before use
var RoleModel = require('../models/RoleModel');
var UserModel = require('../models/UserModel');
const {checkAdminSession, verifyToken} = require('../middlewares/auth');
//------------------------------------------------------------------------
//show all 
router.get('/', verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var roleList = await RoleModel.find({});
            res.status(200).json({ success: true, data: roleList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while fetching role list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//edit 
router.get('/edit/:id', verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var id = req.params.id;
            var role = await RoleModel.findById(id);
            if(!role){
                res.status(404).json({ success: false, error: "Role not found" });
                return;
            }
            res.status(200).json({ success: true, data: role });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while editing role list:", error);
        res.status(500).send("Internal Server Error");
    }  
});

router.put('/edit/:id', verifyToken,  async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var id = req.params.id;
            var data = req.body;
            const updateRole = await RoleModel.findByIdAndUpdate(id, data);
            if(!updateRole){
                res.status(404).json({ success: false, error: "Update role fail" });
                return;
            } else {
                res.status(200).json({ success: true, error: "Update role success" });
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while updating role:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

module.exports = router;
