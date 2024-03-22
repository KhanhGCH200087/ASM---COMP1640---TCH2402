var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var AdminModel = require('../models/AdminModel');
var UserModel = require('../models/UserModel');

const checkLoginSession = require('../middlewares/auth');
//-------------------------------------------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/') // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()) // Set the filename to avoid name conflicts
    }
});

const upload = multer({ storage: storage });


//------------------------------------------------------------------------
//show all 
router.get('/',checkLoginSession, async(req, res) => {
    try{
        var adminList = await AdminModel.find({}).populate('user');
        //render view and pass data
        res.render('admin/index', {adminList});
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});


//---------------------------------------------------------------------------
//edit admin
// Render form for editing a specific admin
router.get('/edit/:id',checkLoginSession, async (req, res) => {
    try {
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

        // Render edit form with admin details and dropdown options
        res.render('admin/edit', { admin, user});
    } catch (error) {
        // Handle errors (e.g., admin not found)
        console.error(error);
        res.status(404).send('Admin not found');
    }
});

// Handle form submission for editing a admin
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
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
        user.password = req.body.password;
        await user.save();

        // Redirect to admin list page
        res.redirect('/admin');
    } catch (error) {
        // Handle errors (e.g., admin not found, validation errors)
        console.error(error);
        res.status(400).send(error.message);
    }
});

//-----------------------------------
module.exports = router;
