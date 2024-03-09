var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var RoleModel = require('../models/RoleModel');
var FacultyModel = require('../models/FacultyModel');

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
        var marketingcoordinatorList = await MarketingCoordinatorModel.find({}).populate('role').populate('faculty');
        //render view and pass data
        res.render('marketingcoordinator/index', {marketingcoordinatorList});
    }catch(error){
        console.error("Error while fetching MC list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingcoordinator
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await MarketingCoordinatorModel.findByIdAndDelete(id);
        res.redirect('/marketingcoordinator');
    }catch(error){
        console.error("Error while deleting MC:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create marketingcoordinator
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var roleList = await RoleModel.find({});
        var facultyList = await FacultyModel.find({});
        res.render('marketingcoordinator/add', {roleList, facultyList});
    }catch(error){
        console.error("Error while adding MC:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', upload.single('image'), async (req, res) => {
    //get value by form : req.body
    try{
        const name = req.body.name;
        const dob = req.body.dob;
        const role = req.body.role;
        const faculty = req.body.faculty;
        const gender = req.body.gender;
        const address = req.body.address;
        const email = req.body.email;
        const password = req.body.password;
        const image = req.file //access the uplodaded image
    
        //read the image file
        const imageData = fs.readFileSync(image.path);
        //convert image data to base 64
        const base64Image = imageData.toString('base64');
        await MarketingCoordinatorModel.create(
            {
                name: name,
                dob: dob,
                role: role,
                faculty: faculty,
                gender: gender,
                address: address,
                email: email,
                password: password,
                image: base64Image
            }
    );
    res.redirect('/marketingcoordinator');
    }catch(error){
        console.error("Error while adding MC:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
//edit marketingcoordinator
//phần edit bị lỗi ở đoạn chọn Role, chưa xử lý đc phần chọ khóa phụ từ những bảng khác. 

//-----------------------------------
module.exports = router;
