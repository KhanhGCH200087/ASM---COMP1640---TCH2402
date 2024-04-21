var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var AdminModel = require('../models/AdminModel');
var UserModel = require('../models/UserModel');
const {checkAdminSession, verifyToken} = require('../middlewares/auth');

//import "bcryptjs" library
var bcrypt = require('bcryptjs');
var salt = 8; //random value

//-------------------------------------------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/'); // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()); // Set the filename to avoid name conflicts
    }
});

const upload = multer({ storage: storage });

//-----------------------------------------------------------------------------------------------
//for Admin
//------------------------------------------------------------------------
// Route to get all admins
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            var adminList = await AdminModel.find({}).populate('user');
            res.status(200).json({ success: true, data: adminList });
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }

    } catch (error) {
        console.error("Error while fetching admin list:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//---------------------------------------------------------------------------
//edit admin
// Render form for editing a specific admin
router.get('/edit/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
             // Fetch admin details by ID
            const adminId = req.params.id;
            const admin = await AdminModel.findById(adminId);
            if (!admin) {
                throw new Error('Admin not found');
            }
            // Fetch user details by ID
            const userId = admin.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Send JSON response with admin details and user details
            res.status(200).json({ success: true, data: { admin, user } });
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
       
    } catch (error) {
        // Handle errors (e.g., admin not found)
        console.error(error);
        res.status(404).json({ success: false, error: "Admin not found" });
    }
});

// Handle form submission for editing an admin
router.post('/edit/:id',verifyToken, upload.single('image'), async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            // Fetch admin by ID
            const adminId = req.params.id;
            const admin = await AdminModel.findById(adminId);
            if (!admin) {
                throw new Error('Admin not found');
            }
            // Fetch user details by ID
            const userId = admin.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Update admin details
            admin.name = req.body.name;
            admin.dob = req.body.dob;
            admin.gender = req.body.gender;
            admin.address = req.body.address;
            // If a new image is uploaded, update it
            if (req.file) {
                const imageData = fs.readFileSync(req.file.path);
                admin.image = imageData.toString('base64');
            }
            await admin.save();

            user.email = req.body.email;
            user.password = bcrypt.hashSync(req.body.password, salt);
            await user.save();

            // Send success JSON response
            res.status(200).json({ success: true, message: "Admin updated successfully" });
            } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            let InputErrors = {};
            for (let field in err.errors) {
                InputErrors[field] = err.errors[field].message;
            }
            res.status(400).json({ success: false, error: "Validation Error", InputErrors });
        } else {
            // Handle other errors
            console.error("Error while updating admin:", err);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
});

module.exports = router;
