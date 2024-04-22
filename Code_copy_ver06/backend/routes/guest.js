var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');
var ContributionModel = require('../models/ContributionModel');
var GuestModel = require('../models/GuestModel');

const {checkAdminSession, checkGuestSession, verifyToken} = require('../middlewares/auth');
//-------------------------------------------
//import "bcryptjs" library
var bcrypt = require('bcryptjs');
const { equal } = require('assert');
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


//-------------------Phần này cho Role Admin-----------------------------------------------------
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
            var guestList = await GuestModel.find({}).populate('user');
            //render view and pass data
            res.status(200).json({ success: true, data: guestList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
       
    }catch(error){
        console.error("Error while fetching Guest list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific guest
router.get('/delete/:id', verifyToken, async(req, res) => {
    //req.params: get value by url
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const guestId = req.params.id;
            const guest = await GuestModel.findById(guestId);
            if (!guest) {
                res.status(404).json({ success: false, error: "Guest not found" });
                return;
            }
            // Fetch user details by ID
            const userId = guest.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: "Guest not found" });
                return;
            }
            await GuestModel.findByIdAndDelete(guestId);
            await UserModel.findByIdAndDelete(userId);
            res.status(200).json({ success: true, message: "Guest deleted successfully" });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    }catch(error){
        console.error("Error while deleting Guest list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create guest
//render form for user to input
router.get('/add', verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            res.status(200).json({ success: true, message: "Render add guest form"});
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while adding Guest list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', verifyToken, upload.single('image'), async (req, res) => {
    //get value by form : req.body
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const name = req.body.name;
            const dob = req.body.dob;
            const gender = req.body.gender;
            const address = req.body.address;
            const image = req.file //access the uplodaded image
    
            const email = req.body.email;
            const password = req.body.password;
            const hashPassword = bcrypt.hashSync(password, salt);
            const role = ''; //objectID
          
            //read the image file
            const imageData = fs.readFileSync(image.path);
            //convert image data to base 64
            const base64Image = imageData.toString('base64');
            //create users then add new created users to user field of collection marketing_manager
            const availableUser = await UserModel.findOne({email: email});
            if(availableUser){
                res.status(500).json({ success: false, error: "User existed"});
            } else {
                const users = await UserModel.create(
                    {
                        email: email,
                        password: hashPassword,
                        role: role
                    }
                );
                const newG = await GuestModel.create(
                    {
                    name: name,
                    dob: dob,
                    gender: gender,
                    address: address,
                    image: base64Image,
                    user: users
                    }
                );
                if(newG){
                    res.status(201).json({ success: true, message: "Guest created successfully" });
                } else {
                    res.status(500).json({ success: false, message: "Error Guest created " });
                }
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           console.error("Error while adding guest:", err);
            res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
        }
     }
    
});

//---------------------------------------------------------------------------
//edit guest
// Render form for editing a specific guest
router.get('/edit/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const guestId = req.params.id;
            const guest = await GuestModel.findById(guestId);
            if (!guest) {
                res.status(404).json({ success: false, error: "Guest not found" });
                return;
            }
            // Fetch user details by ID
            const userId = guest.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: "User not found" });
                return;
            }
    
            // Render edit form with guest details and dropdown options
            res.status(200).json({ success: true, message: "Render add guest form", guest, user});
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    } catch (error) {
        // Handle errors (e.g., guest not found)
        console.error(error);
        res.status(404).send('Guest not found');
    }
});

// Handle form submission for editing a guest
router.post('/edit/:id', verifyToken,  upload.single('image'), async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const guestId = req.params.id;
            const guest = await GuestModel.findById(guestId);
            if (!guest) {
                res.status(404).json({ success: false, error: "Guest not found" });
                return;
            }
            // Fetch user details by ID
            const userId = guest.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: "User not found" });
                return;
            }
    
            // Update guest details
            guest.name = req.body.name;
            guest.dob = req.body.dob;
            guest.gender = req.body.gender;
            guest.address = req.body.address;
            // If a new image is uploaded, update it
            if (req.file) {
                const imageData = fs.readFileSync(req.file.path);
                guest.image = imageData.toString('base64');  
            } 
            const editG = await guest.save();
            if(editG){
                res.status(200).json({ success: true, message: "Guest updated successfully" });
            } else {
                res.status(500).json({ success: false, message: "Guest updated fail" });
            }
            
            user.email = req.body.email;
            user.password = bcrypt.hashSync(req.body.password, salt);
            const editUser = await user.save();
            if(editUser){
                res.status(200).json({ success: true, message: "User of Guest updated successfully" });
            } else {
                res.status(500).json({ success: false, message: "User of Guest updated fail" });
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           console.error("Error while updating guest:", err);
            res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
        }
     }
});



//------------Phần này cho role Guest--------------
//trang chủ của Guest---------------------------------------------------
router.get('/gpage', verifyToken, async (req, res) => {
    try{ 
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da7'){
            //Code ở đây--------------------------
            var gUserId = req.userId;
            var UserData = await UserModel.findById(gUserId); 
            var GData = await GuestModel.findOne({user: gUserId});
            if(UserData && GData){
                var facultyID = GData.faculty;
            } else {
                res.status(400).json({ success: false, error: "Guest not found" });
            }
            var facultyData = await FacultyModel.findOne({_id: facultyID});
            if(facultyData){
                var studentData = await StudentModel.find({faculty: facultyID});
                var eventData = await EventModel.find({faculty: facultyID});
            } else {
                res.status(400).json({success: false, error: "Not found Faculty"});
            }
            res.status(200).json({ success: true, message: "Guest Menu page", facultyData, eventData, studentData });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while fetching G list:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/eventDetail/:id',  verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da7'){
            //Code ở đây--------------------------
            var eventId = req.params.id;
            const eventData = await EventModel.findById(eventId);
            var eventFacultyID = eventData.faculty;
            
            var gUserId = req.userId;
            var GData = await GuestModel.findOne({user: gUserId});

            var facultyID = GData.faculty;
    
            if(facultyID.equals(eventFacultyID) ){
                if (eventData){
                    const contributionList = await ContributionModel.find({event: eventId}).populate('student');
                    const chosenYesContributions = await contributionList.filter(contribution => contribution.choosen === true);
                    if (chosenYesContributions){
                        res.status(200).json({ success: true, eventData, chosenYesContributions, GData  });
                    } else {
                        res.status(404).json({ success: false, error: "Contribution not found" });
                        return;
                    }
               } else {
                    res.status(404).json({ success: false, error: "Event not found" });
                    return;
               }
            } else {
                res.status(500).send("Event Faculty not matched");
                console.log({facultyID});
                console.log({eventFacultyID});
            }
    
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/contributionDetail/:id',  verifyToken, async(req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da7'){
            //Code ở đây--------------------------
            // Fetch contribution details by ID
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId).populate('student').populate('event');
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }

            const GData = await GuestModel.findOne({user: userId});
            const facultyID = GData.faculty;

            const eventID = contribution.event;
            const eventData = await EventModel.findById(eventID);
            const eventFacultyID = eventData.faculty;

            if(facultyID.equals(eventFacultyID)){
                res.status(200).json({ success: true, message: "Render edit marketing coordinator form", data: contribution });
            } else {
                res.status(500).json({ success: false, error: "Not matched Faculty" });
                return;
            }

            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (error) {
        // Handle errors (e.g., contribution not found)
        console.error(error);
        res.status(404).send('Contribution not found');
    }
});

//đọc thông tin của Guest-------------------------------------------------
router.get('/profile', verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da7'){
            //Code ở đây--------------------------
            var gUserId = req.userId;
            var UserData = await UserModel.findById(gUserId);
            if(UserData){
                var GData = await GuestModel.findOne({user: userId});
            } else {
                res.status(500).json({ success: false, error: "Profile not found" });
            }
            res.status(200).json({ success: true, message: "Render edit guest form", UserData, GData });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while fetching M0:", error);
        res.status(500).send("Internal Server Error");
    }
});


//sửa thông tin của Guest-------------------------------------------
router.get('/editG/:id', verifyToken, async (req, res) => {
    const userId = req.userId;
    const userData = await UserModel.findById(userId);
    if(!userData){
        return res.status(400).json({success: false, error: "Not found user"});
    }
    const userRole = userData.role.toString();
    if(userRole === '65e61d9bb8171b6e90f92da7'){
        //Code ở đây--------------------------
        const guestUserId = req.userId;
        const guestId = req.params.id;
        const guest = await GuestModel.findById(guestId);
        if (!guest) {
            res.status(404).json({ success: false, error: "Guest not found" });
            return;
        }
        // Fetch user details by ID
        const userId = guest.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        if(userId.equals(guestUserId)){
            try {
                res.status(200).json({ success: true, message: "Render add guest form", guest, user });
            } catch (error) {
                // Handle errors (e.g., guest not found)
                console.error(error);
                res.status(404).send('Guest not found');
            }
        } else {
            res.status(404).send('Guest not found');
        }
        //----------------------------------
    } else {
        return res.status(400).json({ success: false, error: "Not right Role" });
    }
    //-------------------------------------------------
});

router.post('/editG/:id', verifyToken, upload.single('image'), async (req, res) => {
    const userId = req.userId;
    const userData = await UserModel.findById(userId);
    if(!userData){
        return res.status(400).json({success: false, error: "Not found user"});
    }
    const userRole = userData.role.toString();
    if(userRole === '65e61d9bb8171b6e90f92da7'){
        //Code ở đây--------------------------
        const guestUserId = req.userId;
        const guestId = req.params.id;
        const guest = await GuestModel.findById(guestId);
        if (!guest) {
            res.status(404).json({ success: false, error: "Guest not found" });
            return;
        }
        // Fetch user details by ID
        const userId = guest.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        if(userId.equals(guestUserId)){
            try {
                // Update guest details
                guest.name = req.body.name;
                guest.dob = req.body.dob;
                guest.gender = req.body.gender;
                guest.address = req.body.address;
                // If a new image is uploaded, update it
                if (req.file) {
                    const imageData = fs.readFileSync(req.file.path);
                    guest.image = imageData.toString('base64');  
                } 
                await guest.save();
                
                user.password = bcrypt.hashSync(req.body.password, salt);
                await user.save();
        
                // Redirect to guest list page
                res.status(200).json({ success: true, message: "Update my Guest data success" });
            } catch (err) {
                if (err.name === 'ValidationError') {
                   let InputErrors = {};
                   for (let field in err.errors) {
                      InputErrors[field] = err.errors[field].message;
                   }
                   console.error("Error while updating guest:", err);
                    res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
                }
             }
        } else {
            res.status(404).send('Guest not found');
        }
        //----------------------------------
    } else {
        return res.status(400).json({ success: false, error: "Not right Role" });
    }
    //-------------------------------------------------
});
//---------------------------------------------------

module.exports = router;
