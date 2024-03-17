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
    try{
        var studentList = await StudentModel.find({}).populate('role').populate('faculty');
        //render view and pass data
        res.render('student/index', {studentList});
    } catch (error){
        console.error("Error while fetching student list:", error);
        res.status(500).send("Internal Server Error");
    }  
});

//-----------------------------------------------------------------------
//delete specific student
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await StudentModel.findByIdAndDelete(id);
        res.redirect('/student');
    } catch (error){
        console.error("Error while deleting student list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create student
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var roleList = await RoleModel.find({});
        var facultyList = await FacultyModel.find({});
        res.render('student/add', {roleList, facultyList});
    } catch (error){
        console.error("Error while making new student:", error);
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
    }catch(error){
        console.error("Error while making new student:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
// edit student
// Render form for editing a specific student
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch student details by ID
        const studentId = req.params.id;
        const student = await StudentModel.findById(studentId).populate('role').populate('faculty');
        if (!student) {
            throw new Error('Student not found');
        }
        // Fetch role and faculty lists for dropdowns
        const roleList = await RoleModel.find({});
        const facultyList = await FacultyModel.find({});
        // Render edit form with student details and dropdown options
        res.render('student/edit', { student, roleList, facultyList });
    } catch (error) {
        // Handle errors (e.g., student not found)
        console.error(error);
        res.status(404).send('Student not found');
    }
});

// Handle form submission for editing a student
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        // Fetch student by ID
        const studentId = req.params.id;
        const student = await StudentModel.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        // Update student details
        student.name = req.body.name;
        student.dob = req.body.dob;
        student.role = req.body.role;
        student.faculty = req.body.faculty;
        student.gender = req.body.gender;
        student.address = req.body.address;
        student.email = req.body.email;
        student.password = req.body.password;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            student.image = imageData.toString('base64');
        }
        // Save updated student to the database
        await student.save();
        // Redirect to student list page
        res.redirect('/student');
    } catch (error) {
        // Handle errors (e.g., student not found, validation errors)
        console.error(error);
        res.status(400).send(error.message);
    }
});






//-----------------------------------
module.exports = router;
