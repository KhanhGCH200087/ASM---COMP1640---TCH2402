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
var NotificationMCModel = require('../models/NotificationMCModel');

const {checkAdminSession, checkMCSession} = require('../middlewares/auth');
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
router.get('/',checkAdminSession, async(req, res) => {
    try{
        var marketingcoordinatorList = await MarketingCoordinatorModel.find({}).populate('user').populate('faculty');
        //render view and pass data
        res.render('marketingcoordinator/index', {marketingcoordinatorList});
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingcoordinator
router.get('/delete/:id', checkAdminSession, async(req, res) => {
    //req.params: get value by url
    try{
        const marketingcoordinatorId = req.params.id;
        const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
        if (!marketingcoordinator) {
            throw new Error('MarketingCoordinator not found');
        }
        // Fetch user details by ID
        const userId = marketingcoordinator.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await MarketingCoordinatorModel.findByIdAndDelete(marketingcoordinatorId);
        await UserModel.findByIdAndDelete(userId);
        res.redirect('/marketingcoordinator');
    }catch(error){
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create marketingcoordinator
//render form for user to input
router.get('/add', checkAdminSession, async (req, res) => {
    try{
        var facultyList = await FacultyModel.find({});
        res.render('marketingcoordinator/add', {facultyList});
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
        const role = '65e61d9bb8171b6e90f92da5'; //objectID
      
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
        await MarketingCoordinatorModel.create(
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
        
        res.redirect('/marketingcoordinator');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('marketingcoordinator/add', { InputErrors, marketingcoordinator });
        }
     }
    
});

//---------------------------------------------------------------------------
//edit marketingcoordinator
// Render form for editing a specific marketingcoordinator
router.get('/edit/:id', checkAdminSession, async (req, res) => {
    try {
        // Fetch marketingcoordinator details by ID
        const marketingcoordinatorId = req.params.id;
        const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId).populate('faculty');
        if (!marketingcoordinator) {
            throw new Error('MarketingCoordinator not found');
        }
        const facultyList = await FacultyModel.find({});
        // Fetch user details by ID
        const userId = marketingcoordinator.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Render edit form with marketingcoordinator details and dropdown options
        res.render('marketingcoordinator/edit', { marketingcoordinator, user, facultyList});
    } catch (error) {
        // Handle errors (e.g., marketingcoordinator not found)
        console.error(error);
        res.status(404).send('MarketingCoordinator not found');
    }
});

// Handle form submission for editing a marketingcoordinator
router.post('/edit/:id', checkAdminSession, upload.single('image'), async (req, res) => {
    try {
        // Fetch marketingcoordinator by ID
        const marketingcoordinatorId = req.params.id;
        const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
        if (!marketingcoordinator) {
            throw new Error('MarketingCoordinator not found');
        }
        // Fetch user details by ID
        const userId = marketingcoordinator.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update marketingcoordinator details
        marketingcoordinator.name = req.body.name;
        marketingcoordinator.dob = req.body.dob;
        marketingcoordinator.gender = req.body.gender;
        marketingcoordinator.address = req.body.address;
        marketingcoordinator.faculty = req.body.faculty;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            marketingcoordinator.image = imageData.toString('base64');  
        } 
        await marketingcoordinator.save();
        
        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);
        await user.save();

        // Redirect to marketingcoordinator list page
        res.redirect('/marketingcoordinator');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('marketingcoordinator/edit', { InputErrors, marketingcoordinator });
        }
     }
});



//------------Phần này cho role Marketing Coordinator--------------
//trang chủ của MC---------------------------------------------------
router.get('/mcpage', checkMCSession, async (req, res) => {
    try{ 
        res.render('marketingcoordinator/mcpage');
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//đọc thông tin của MC-------------------------------------------------
router.get('/profile', checkMCSession, async (req, res) => {
    try{
        var mcUserId = req.session.user_id;
        var UserData = await UserModel.findById(mcUserId);
      if(UserData){
        var mcID = req.session.mc_id;
        var MCData = await MarketingCoordinatorModel.findById(mcID);
      } else {
        req.status().send('MC not found');
      }
        res.render('marketingcoordinator/profile', {UserData, MCData});
    }catch(error){
        console.error("Error while fetching M0:", error);
        res.status(500).send("Internal Server Error");
    }
});


//sửa thông tin của MC-------------------------------------------
router.get('/editMC/:id', checkMCSession, async (req, res) => {
    const marketingcoordinatorId = req.params.id;
    const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
    if (!marketingcoordinator) {
        throw new Error('MarketingCoordinator not found');
    }
    // Fetch user details by ID
    const userId = marketingcoordinator.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if(userId == req.session.user_id && marketingcoordinatorId == req.session.mc_id){
        try {
            res.render('marketingcoordinator/editMC', { marketingcoordinator, user});
        } catch (error) {
            // Handle errors (e.g., marketingcoordinator not found)
            console.error(error);
            res.status(404).send('MarketingCoordinator not found');
        }
    } else {
        res.status(404).send('MarketingCoordinator not found');
    }
    
});

router.post('/editMC/:id', checkMCSession, upload.single('image'), async (req, res) => {
    const marketingcoordinatorId = req.params.id;
    const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
    if (!marketingcoordinator) {
        throw new Error('MarketingCoordinator not found');
    }
    // Fetch user details by ID
    const userId = marketingcoordinator.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if(userId == req.session.user_id && marketingcoordinatorId == req.session.mc_id){
        try {
            // Update marketingcoordinator details
            marketingcoordinator.name = req.body.name;
            marketingcoordinator.dob = req.body.dob;
            marketingcoordinator.gender = req.body.gender;
            marketingcoordinator.address = req.body.address;
            // If a new image is uploaded, update it
            if (req.file) {
                const imageData = fs.readFileSync(req.file.path);
                marketingcoordinator.image = imageData.toString('base64');  
            } 
            await marketingcoordinator.save();
            
            user.password = bcrypt.hashSync(req.body.password, salt);
            await user.save();
    
            // Redirect to marketingcoordinator list page
            res.redirect('/marketingcoordinator/profile');
        } catch (err) {
            if (err.name === 'ValidationError') {
               let InputErrors = {};
               for (let field in err.errors) {
                  InputErrors[field] = err.errors[field].message;
               }
               res.render('marketingcoordinator/editMC', { InputErrors, marketingcoordinator });
            }
         }
    } else {
        res.status(404).send('MarketingCoordinator not found');
    }
   
});

//show all information of faculty-----------------------------------------
router.get('/facultypage', checkMCSession, async(req, res) => {
    try{
        var mcUserId = req.session.user_id;
        var UserData = await UserModel.findById(mcUserId);
        var mcID = req.session.mc_id;
        var MCData = await MarketingCoordinatorModel.findById(mcID);
      if(UserData && MCData){
        var facultyID = MCData.faculty;
      } else {
        req.status().send('MC not found');
      }

        var facultyData = await FacultyModel.findOne({_id: facultyID});
        if(facultyData){
            var notificationMCList = await NotificationMCModel.find({faculty: facultyID});
            var studentData = await StudentModel.find({faculty: facultyID});
            var eventData = await EventModel.find({faculty: facultyID});
            res.render('marketingcoordinator/facultypage', {facultyData, eventData, studentData, notificationMCList});
        } else {
            req.status().send('Faculty not found');
        }

    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//xem event detail------------------------------------------------------ (đã có validation, dùng equal, có thể áp dụng để check lỗi các phần khác)
router.get('/eventDetail/:id', checkMCSession, async (req, res) => {  
    try{
        var eventId = req.params.id;
        const eventData = await EventModel.findById(eventId);
        var eventFacultyID = eventData.faculty;

        var mcID = req.session.mc_id;
        const MCData = await MarketingCoordinatorModel.findById(mcID);
        var facultyID = MCData.faculty;

        if(facultyID.equals(eventFacultyID) ){
            if (eventData){
                const contributionList = await ContributionModel.find({event: eventId}).populate('student');
                if (contributionList){
                    res.render('marketingcoordinator/eventDetail', {eventData, contributionList, MCData});
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

        // if(facultyID != eventFacultyID){
        //     res.status(500).send("Event Faculty not matched");
        // } 

    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

// comment và chọn Yes/No của contribution của Student------------------------------------- 
router.get('/contributionDetail/:id', checkMCSession, async(req, res) => {
    try {
        // Fetch contribution details by ID
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId).populate('student').populate('event');
        if (!contribution) {
            throw new Error('Contribution not found');
        }

        const mcID = req.session.mc_id
        const MCData = await MarketingCoordinatorModel.findById(mcID);
        const facultyID = MCData.faculty;

        const eventID = contribution.event;
        const eventData = await EventModel.findById(eventID);
        const eventFacultyID = eventData.faculty;

        if(facultyID.equals(eventFacultyID)){
            res.render('marketingcoordinator/contributionDetail', { contribution});
        } else {
            res.status(500).send("Event Faculty not matched")
        }

    } catch (error) {
        // Handle errors (e.g., contribution not found)
        console.error(error);
        res.status(404).send('Contribution not found');
    }
});

router.post('/contributionDetail/:id', checkMCSession, async(req, res) => {
    try {
        // Fetch contribution by ID
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId);
        if (!contribution) {
            throw new Error('Contribution not found');
        }

        const mcID = req.session.mc_id;
        const MCData = await MarketingCoordinatorModel.findById(mcID);
        const facultyID = MCData.faculty;

        const eventID = contribution.event;
        const eventData = await EventModel.findById(eventID);
        const eventFacultyID = eventData.faculty;

        if(facultyID.equals(eventFacultyID)){
            contribution.choosen = req.body.choosen;
            contribution.comment = req.body.comment;
            await contribution.save();
            res.redirect('/facultypage');
        } else {
            res.status(500).send("Event Faculty not matched");
        }
        
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('marketingcoordinator/contributionDetail', { InputErrors, contribution });
        }
     }
});

//---------------------------------------------------




module.exports = router;
