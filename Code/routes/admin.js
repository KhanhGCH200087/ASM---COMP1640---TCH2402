var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var AdminModel = require('../models/AdminModel');
var RoleModel = require('../models/RoleModel');

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
router.get('/', async(req, res) => {
    try{
        var adminList = await AdminModel.find({}).populate('role');
        //render view and pass data
        res.render('admin/index', {adminList});
    }catch(error){
        console.error("Error while fetching admin list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingcoordinator
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await AdminModel.findByIdAndDelete(id);
        res.redirect('/admin');
    }catch(error){
        console.error("Error while deleting admin:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create marketingcoordinator
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var roleList = await RoleModel.find({});
        res.render('admin/add', {roleList});
    }catch(error){
        console.error("Error while adding admin:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', upload.single('image'), async (req, res) => {
    //get value by form : req.body
    try{
        const name = req.body.name;
        const dob = req.body.dob;
        const role = req.body.role;
        const gender = req.body.gender;
        const address = req.body.address;
        const email = req.body.email;
        const password = req.body.password;
        const image = req.file //access the uplodaded image
    
        //read the image file
        const imageData = fs.readFileSync(image.path);
        //convert image data to base 64
        const base64Image = imageData.toString('base64');
        await AdminModel.create(
            {
                name: name,
                dob: dob,
                role: role,
                gender: gender,
                address: address,
                email: email,
                password: password,
                image: base64Image
            }
    );
    res.redirect('/admin');
    }catch(error){
        console.error("Error while adding admin:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
//edit marketingcoordinator
//phần edit bị lỗi ở đoạn chọn Role, chưa xử lý đc phần chọ khóa phụ từ những bảng khác. 

//-----------------------------------
module.exports = router;
