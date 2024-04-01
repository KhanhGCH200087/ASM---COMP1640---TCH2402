var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');
var ContributionModel = require('../models/ContributionModel');
 
const {checkAdminSession, checkStudentSession} = require('../middlewares/auth');
//------------------------------------------------
//import "bcryptjs" library
var bcrypt = require('bcryptjs');
const NotificationMCModel = require('../models/NotificationMCModel');
var salt = 8;                     //random value

//----------------------------------Phần này cho Role Admin---------------------------------------
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
router.get('/', checkAdminSession, async(req, res) => {
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
router.get('/delete/:id', checkAdminSession, async(req, res) => {
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
router.get('/add', checkAdminSession, async (req, res) => {
    try{
        var facultyList = await FacultyModel.find({});
        res.render('student/add', {facultyList});
    }catch(error){
        console.error("Error while adding MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', checkAdminSession, upload.single('image'), async (req, res) => {
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
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('student/add', { InputErrors, student });
        }
     }
    
});

//---------------------------------------------------------------------------
//edit student
// Render form for editing a specific student
router.get('/edit/:id', checkAdminSession, async (req, res) => {
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
router.post('/edit/:id', checkAdminSession, upload.single('image'), async (req, res) => {
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
        user.password = bcrypt.hashSync(req.body.password, salt);
        await user.save();

        // Redirect to student list page
        res.redirect('/student');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('student/edit', { InputErrors, student });
        }
     }
});

//-----------------Phần này cho role Student-----------------------------------------------
//trang chủ của Student
router.get('/studentpage', checkStudentSession, async (req, res) => {
    try{ 
        res.render('student/studentpage');
    }catch(error){
        console.error("Error while fetching ST:", error);
        res.status(500).send("Internal Server Error");
    }
});

//đọc thông tin của Student----------------------------------
router.get('/profile', checkStudentSession, async (req, res) => {
    try{
        var stUserId = req.session.user_id;
        var UserData = await UserModel.findById(stUserId);
      if(UserData){
        var stID = req.session.st_id;
        var STData = await StudentModel.findById(stID);
      } else {
        req.status().send('MC not found');
      }
        res.render('student/profile', {UserData, STData});
    }catch(error){
        console.error("Error while fetching M0:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----sửa thông tin của Student--------------------------------
router.get('/editST/:id', checkStudentSession, async (req, res) => {
    const studentId = req.params.id;
    const studentData = await StudentModel.findById(studentId);
    if (!studentData) {
        throw new Error('Student not found');
    }
    // Fetch user details by ID
    const userId = studentData.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if(userId == req.session.user_id && studentId == req.session.st_id){
        try {
            res.render('student/editST', { studentData, user});
        } catch (error) {
            // Handle errors (e.g., marketingcoordinator not found)
            console.error(error);
            res.status(404).send('Student not found');
        }
    } else {
        res.status(404).send('Student not found');
    }
    
});

router.post('/editST/:id', checkStudentSession, upload.single('image'), async (req, res) => {
    const studentID = req.params.id;
    const studentData = await StudentModel.findById(studentID);
    if (!studentData) {
        throw new Error('Student not found');
    }
    // Fetch user details by ID
    const userId = studentData.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if(userId == req.session.user_id && studentID == req.session.st_id){
        try {
            // Update marketingcoordinator details
            studentData.name = req.body.name;
            studentData.dob = req.body.dob;
            studentData.gender = req.body.gender;
            studentData.address = req.body.address;
            // If a new image is uploaded, update it
            if (req.file) {
                const imageData = fs.readFileSync(req.file.path);
                studentData.image = imageData.toString('base64');  
            } 
            await studentData.save();
            
            user.password = bcrypt.hashSync(req.body.password, salt);
            await user.save();
    
            // Redirect to marketingcoordinator list page
            res.redirect('/student/profile');
        } catch (err) {
            if (err.name === 'ValidationError') {
               let InputErrors = {};
               for (let field in err.errors) {
                  InputErrors[field] = err.errors[field].message;
               }
               res.render('student/editST', { InputErrors, studentData });
            }
         }
    } else {
        res.status(404).send('Student not found');
    }
   
});

//-----------------------------lấy thông tin của faculty----------------------------
router.get('/facultypage', checkStudentSession, async(req, res) => {
    try{
        var stUserId = req.session.user_id;
        var UserData = await UserModel.findById(stUserId);
        var stID = req.session.st_id;
        var STData = await StudentModel.findById(stID);
      if(UserData && STData){
        var facultyID = STData.faculty;
      } else {
        req.status().send('MC not found');
      }

        var facultyData = await FacultyModel.findOne({_id: facultyID});
        if(facultyData){
            var eventData = await EventModel.find({faculty: facultyID});
            res.render('student/facultypage', {facultyData, eventData});
        } else {
            req.status().send('Faculty not found');
        }

    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------nộp bài trong event ----------------------------------------------
router.get('/submitContribution/:id', async (req, res) => {
    try {
        // Fetch contribution details by ID
        const eventId = req.params.id;
        const eventData = await EventModel.findById(eventId);
        if (!eventData) {
            throw new Error('Event not found');
        }

        const eventFacultyID = eventData.faculty;

        const stID = req.session.st_id
        const STData = await StudentModel.findById(stID);
        const facultyID = STData.faculty;

        if(facultyID.equals(eventFacultyID)){
            res.render('student/submitContribution', { eventData});
        } else {
            res.status(500).send("Event Faculty not matched")
        }

    } catch (error) {
        console.error(error);
        res.status(404).send('Event not found');
    }
});

router.post('/submitContribution/:id', upload.single('image'), async (req, res) => {
    try{
        var eventId = req.params.id;
        const eventData = await EventModel.findById(eventId);
        var eventFacultyID = eventData.faculty;

        var stID = req.session.st_id;
        const STData = await StudentModel.findById(stID);
        var facultyID = STData.faculty;

        if(facultyID.equals(eventFacultyID) ){
            if (eventData){
                const student = stID;
                const choosen = 'No';
                const comment = 'Nothing';
                const date = Date.now();
                const event = eventId;

                const image = req.file;
                const submitData = fs.readFileSync(image.path);
                const base64File = submitData.toString('base64');

                const status = 'Submit new'

                const deadline1 = eventData.deadline1;

                if(date <= deadline1.getTime()){
                    const contributionID = await ContributionModel.create({
                        student: student,
                        choosen: choosen,
                        comment: comment,
                        date: date,
                        event: event,
                        contribution: base64File
                    });

                    await NotificationMCModel.create({
                        student: student,
                        contribution: contributionID,
                        event: event,
                        faculty: eventFacultyID,
                        date: date,
                        status: status
                    });

                    res.redirect('/student/facultypage');
                } else {
                    res.status(400).send("Deadline 1 for this event has passed. You cannot submit new documents.");
                }
           } else {
                throw new Error('Event not found');
           }
        } else {
            res.status(500).send("Event Faculty not matched");
            console.log({facultyID});
            console.log({eventFacultyID});
        }
    }catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('student/eventDetail', { InputErrors, eventData});
        }
     }
});

//----------xem bài đã submit trong event----------------------------------------------
router.get('/eventDetail/:id', checkStudentSession, async (req, res) => { 
    try{
        var eventId = req.params.id;
        const eventData = await EventModel.findById(eventId);
        var eventFacultyID = eventData.faculty;

        var stID = req.session.st_id;
        const STData = await StudentModel.findById(stID);
        var facultyID = STData.faculty;

        if(facultyID.equals(eventFacultyID) ){
            if (eventData){
                const contributionList = await ContributionModel.find({event: eventId} && {student: stID});
                if (contributionList){
                    res.render('student/eventDetail', {eventData, contributionList, STData});
                } else {
                    throw new Error('Contribution not found');
                }
           } else {
                throw new Error('Event not found');
           }
        } else {
            res.status(500).send("Event Faculty not matched");
            console.log({facultyID});
            console.log({eventFacultyID});
        }

    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-------------------------Delete contribution hiện có trong event-------------------------------------
router.get('/deleteContribution/:id', checkStudentSession, async(req, res) => {
    try{
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId);
        if (!contribution) {
            throw new Error('File not found');
        }
        const studentID = req.session.st_id;
        const eventID = contribution.event;
        const eventData = await EventModel.findById(eventID);
        const facultyID = eventData.faculty;
        const date = Date.now();
        const status = 'Delete'; 

        const deadline1 = eventData.deadline1;

        if(date <= deadline1.getTime()){
            const notiMC = await NotificationMCModel.create({
                student: studentID,
                contribution: contributionId,
                event: eventID,
                faculty: facultyID,
                date: date,
                status: status
            });

            if(notiMC){
                await ContributionModel.findByIdAndDelete(contributionId);
                res.redirect('/student/facultypage');
            }
        } else {
            res.status(400).send("Deadline 1 for this event has passed. You cannot submit new documents.");
        }

    }catch(error){
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-------------------------edit contribution hiện có trong event ----------------------------------------------------
router.get('/editContribution/:id', checkStudentSession, async(req, res) => {
    try {
        // Fetch contribution details by ID
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId).populate('event');
        if (!contribution) {
            throw new Error('Contribution not found');
        }
        const stID2 = contribution.student;

        const stID = req.session.st_id
        const STData = await StudentModel.findById(stID);
        const facultyID = STData.faculty;

        const eventID = contribution.event;
        const eventData = await EventModel.findById(eventID);
        const eventFacultyID = eventData.faculty;

        if(facultyID.equals(eventFacultyID) && stID2 == req.session.st_id){
            res.render('student/editContribution', { contribution});
        } else {
            res.status(500).send("Event Faculty not matched")
        }

    } catch (error) {
        // Handle errors (e.g., contribution not found)
        console.error(error);
        res.status(404).send('Contribution not found');
    }
});

router.post('/editContribution/:id', upload.single('contribution'), checkStudentSession, async(req, res) => {
    try {
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId).populate('event');
        if (!contribution) {
            throw new Error('Contribution not found');
        }
        const stID2 = contribution.student;

        const stID = req.session.st_id
        const STData = await StudentModel.findById(stID);
        const facultyID = STData.faculty;

        const eventID = contribution.event;
        const eventData = await EventModel.findById(eventID);
        const eventFacultyID = eventData.faculty;

        const deadline1 = eventData.deadline1;
        const deadline2 = eventData.deadline2;

        const date = Date.now;
        const status = "Update";

        if(facultyID.equals(eventFacultyID) && stID2 == req.session.st_id){
            if (req.file) {
                const submitData = fs.readFileSync(req.file.path);
                contribution.contribution = submitData.toString('base64');  
                contribution.date = date;
            } 

            if(date > deadline1.getTime() && date <= deadline2.getTime()){
                await contribution.save();

                await NotificationMCModel.create({
                    student: stID,
                    contribution: contributionId,
                    event: eventID,
                    faculty: eventFacultyID,
                    date: date,
                    status: status
                });
    
                res.redirect('/student/facultypage');
            } else {
                res.status(400).send("Deadline 2 for this event has passed. You cannot edit available documents.");
            }

        } else {
            res.status(500).send("Event Faculty not matched");
        }
        
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('student/editContribution', { InputErrors, contribution });
        }
     }
});




//-----------------------------------
module.exports = router;
