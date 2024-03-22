var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var StudentModel = require('../models/StudentModel');
var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');

//import "bcryptjs" library
var bcrypt = require('bcryptjs');
var salt = 8;                     //random value

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
        var studentList = await StudentModel.find({}).populate('user').populate('faculty');
        //render view and pass data
        res.render('student/index', {studentList});
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific student
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        const studentId = req.params.id;
        const student = await StudentModel.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        // Fetch user details by ID
        const userId = student.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await StudentModel.findByIdAndDelete(studentId);
        await UserModel.findByIdAndDelete(userId);
        res.redirect('/student');
    }catch(error){
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create student
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var facultyList = await FacultyModel.find({});
        res.render('student/add', {facultyList});
    }catch(error){
        console.error("Error while adding MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', upload.single('image'), async (req, res) => {
    //get value by form : req.body
    try{
        const name = req.body.name;
        const dob = req.body.dob;
        const gender = req.body.gender;
        const address = req.body.address;
        const faculty = req.body.faculty;
        const image = req.file //access the uplodaded image

        const email = req.body.email;
        const password = req.body.password;
        const hashPassword = bcrypt.hashSync(password, salt);
        const role = '65e61d9bb8171b6e90f92da6'; //objectID
      
        //read the image file
        const imageData = fs.readFileSync(image.path);
        //convert image data to base 64
        const base64Image = imageData.toString('base64');
        //create users then add new created users to user field of collection marketing_manager
        const users = await UserModel.create(
                                {
                                    email: email,
                                    password: hashPassword,
                                    role: role
                                }
                            );
        await StudentModel.create(
            {
                name: name,
                dob: dob,
                gender: gender,
                address: address,
                image: base64Image,
                faculty: faculty,
                user: users
            }
        );
        
        res.redirect('/student');
    }catch(error){
        console.error("Error while adding MM list:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

//---------------------------------------------------------------------------
//edit student
// Render form for editing a specific student
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch student details by ID
        const studentId = req.params.id;
        const student = await StudentModel.findById(studentId).populate('faculty');
        if (!student) {
            throw new Error('Student not found');
        }
        const facultyList = await FacultyModel.find({});
        // Fetch user details by ID
        const userId = student.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Render edit form with student details and dropdown options
        res.render('student/edit', { student, user, facultyList});
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
        // Fetch user details by ID
        const userId = student.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update student details
        student.name = req.body.name;
        student.dob = req.body.dob;
        student.gender = req.body.gender;
        student.address = req.body.address;
        student.faculty = req.body.faculty;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            student.image = imageData.toString('base64');  
        } 
        await student.save();
        
        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);;
        await user.save();

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
