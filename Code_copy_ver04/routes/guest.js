var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var GuestModel = require('../models/GuestModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');
var ContributionModel = require('../models/ContributionModel');

const {checkAdminSession, checkGSession} = require('../middlewares/auth');
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
router.get('/', async(req, res) => {
    try{
        var guestList = await GuestModel.find({}).populate('user');
        //render view and pass data
        res.render('guest/index', {guestList});
    }catch(error){
        console.error("Error while fetching Guest list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific guest
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        const guestId = req.params.id;
        const guest = await GuestModel.findById(guestId);
        if (!guest) {
            throw new Error('Guest not found');
        }
        // Fetch user details by ID
        const userId = guest.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await GuestModel.findByIdAndDelete(guestId);
        await UserModel.findByIdAndDelete(userId);
        res.redirect('/guest');
    }catch(error){
        console.error("Error while deleting Guest list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create guest
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        res.render('guest/add');
    }catch(error){
        console.error("Error while adding Guest list:", error);
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
        const users = await UserModel.create(
                                {
                                    email: email,
                                    password: hashPassword,
                                    role: role
                                }
                            );
        await GuestModel.create(
            {
                name: name,
                dob: dob,
                gender: gender,
                address: address,
                image: base64Image,
                user: users
            }
        );
        
        res.redirect('/guest');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('guest/add', { InputErrors, guest });
        }
     }
    
});

//---------------------------------------------------------------------------
//edit guest
// Render form for editing a specific guest
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch guest details by ID
        const guestId = req.params.id;
        const guest = await GuestModel.findById(guestId);
        if (!guest) {
            throw new Error('Guest not found');
        }
        // Fetch user details by ID
        const userId = guest.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Render edit form with guest details and dropdown options
        res.render('guest/edit', { guest, user });
    } catch (error) {
        // Handle errors (e.g., guest not found)
        console.error(error);
        res.status(404).send('Guest not found');
    }
});

// Handle form submission for editing a guest
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        // Fetch guest by ID
        const guestId = req.params.id;
        const guest = await GuestModel.findById(guestId);
        if (!guest) {
            throw new Error('Guest not found');
        }
        // Fetch user details by ID
        const userId = guest.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
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
        await guest.save();
        
        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);
        await user.save();

        // Redirect to guest list page
        res.redirect('/guest');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('guest/edit', { InputErrors, guest });
        }
     }
});



//------------Phần này cho role Guest--------------
//trang chủ của Guest---------------------------------------------------
router.get('/gpage', checkGSession, async (req, res) => {
    try{ 
        var facultyList = await FacultyModel.find({});
        res.render('guest/gpage', { facultyList });
    }catch(error){
        console.error("Error while fetching Guest list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/facultyDetail/:id', checkGSession, async (req, res) => {
    try {
        var facultyID = req.params.id;
        const eventData = await EventModel.find({faculty: facultyID});
        const MCData = await MarketingCoordinatorModel.find({facultyID: facultyID});
        const StudentData = await StudentModel.find({facultyID: facultyID});
        res.render('guest/facultyDetail', { eventData, MCData, StudentData });
    } catch(err) {
        throw new Error('Faculty Detail not found');
    }
});

router.get('/eventDetail/:id', checkGSession, async (req, res) => {
    try {
        var eventID = req.params.id;
        const eventData = await EventModel.find({event: eventID});
        const contributionData = await ContributionModel.find({eventID: eventID});
        const chosenYesContributions = await contributionData.filter(contribution => contribution.choosen === true);
        res.render('guest/eventDetail', { chosenYesContributions, eventData });
    } catch(err) {
        throw new Error('Event Detail not found');
    }
});

//đọc thông tin của Guest-------------------------------------------------
router.get('/profile', checkGSession, async (req, res) => {
    try{
        var gUserId = req.session.user_id;
        var UserData = await UserModel.findById(gUserId);
      if(UserData){
        var gID = req.session.g_id;
        var GData = await GuestModel.findById(gID);
      } else {
        req.status().send('Guest not found');
      }
      console.log(gID);
        res.render('guest/profile', {UserData, GData});
    }catch(error){
        console.error("Error while fetching M0:", error);
        res.status(500).send("Internal Server Error");
    }
});


//sửa thông tin của Guest-------------------------------------------
router.get('/editG/:id', checkGSession, async (req, res) => {
    const guestId = req.params.id;
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
        throw new Error('Guest not found');
    }
    // Fetch user details by ID
    const userId = guest.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if(userId == req.session.user_id && guestId == req.session.g_id){
        try {
            res.render('guest/editG', { guest, user});
        } catch (error) {
            // Handle errors (e.g., guest not found)
            console.error(error);
            res.status(404).send('Guest not found');
        }
    } else {
        res.status(404).send('Guest not found');
    }
    
});

router.post('/editG/:id', checkGSession, upload.single('image'), async (req, res) => {
    const guestId = req.params.id;
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
        throw new Error('Guest not found');
    }
    // Fetch user details by ID
    const userId = guest.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if(userId == req.session.user_id && guestId == req.session.g_id){
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
            res.redirect('/guest/profile');
        } catch (err) {
            if (err.name === 'ValidationError') {
               let InputErrors = {};
               for (let field in err.errors) {
                  InputErrors[field] = err.errors[field].message;
               }
               res.render('guest/editG', { InputErrors, guest });
            }
         }
    } else {
        res.status(404).send('Guest not found');
    }
   
});

//---------------------------------------------------




module.exports = router;
