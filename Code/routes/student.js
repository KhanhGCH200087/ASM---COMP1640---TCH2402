var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var StudentModel = require('../models/StudentModel');
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
    var studentList = await StudentModel.find({}).populate('role').populate('faculty');
    //render view and pass data
    res.render('student/index', {studentList});
});

//-----------------------------------------------------------------------
//delete specific student
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    var id = req.params.id;
    await StudentModel.findByIdAndDelete(id);
    res.redirect('/student');
});

//------------------------------------------------------------------------
//create student
//render form for user to input
router.get('/add', async (req, res) => {
    var roleList = await RoleModel.find({});
    var facultyList = await FacultyModel.find({});
    res.render('student/add', {roleList, facultyList});
})

router.post('/add', upload.single('image'), async (req, res) => {
    //get value by form : req.body
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
    await StudentModel.create(
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
    res.redirect('/student');
})

//---------------------------------------------------------------------------
//edit student
//phần edit bị lỗi ở đoạn chọn Role, chưa xử lý đc phần chọ khóa phụ từ những bảng khác. 

//-----------------------------------
module.exports = router;
