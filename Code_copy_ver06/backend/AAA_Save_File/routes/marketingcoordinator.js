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
        res.status(200).json({ success: true, data: marketingcoordinatorList });
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingcoordinator
router.delete('/delete/:id', checkAdminSession, async(req, res) => {
    //req.params: get value by url
    try{
        const marketingcoordinatorId = req.params.id;
        const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
        if (!marketingcoordinator) {
            res.status(404).json({ success: false, error: "Marketing Coordinator not found" });
            return;
        }
        // Fetch user details by ID
        const userId = marketingcoordinator.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, error: "Marketing Coordinator not found" });
            return;
        }
        await MarketingCoordinatorModel.findByIdAndDelete(marketingcoordinatorId);
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "Marketing Coordinator deleted successfully" });
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
        res.status(200).json({ success: true, message: "Render add marketing coordinator form", data: facultyList });
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
            const newMC = await MarketingCoordinatorModel.create(
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
            if(newMC){
                res.status(201).json({ success: true, message: "Marketing Coordinator created successfully" });
            } else {
                res.status(500).json({ success: false, message: "Error Marketing Coordinator created " });
            }
        }
        
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while adding marketing coordinator:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
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
            res.status(404).json({ success: false, error: "Marketing Coordinator not found" });
            return;
        }
        const facultyList = await FacultyModel.find({});
        // Fetch user details by ID
        const userId = marketingcoordinator.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Render add marketing coordinator form", marketingcoordinator, user, facultyList });
    } catch (error) {
        // Handle errors (e.g., marketingcoordinator not found)
        console.error(error);
        res.status(404).send('MarketingCoordinator not found');
    }
});

// Handle form submission for editing a marketingcoordinator
router.put('/edit/:id', checkAdminSession, upload.single('image'), async (req, res) => {
    try {
        // Fetch marketingcoordinator by ID
        const marketingcoordinatorId = req.params.id;
        const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
        if (!marketingcoordinator) {
            res.status(404).json({ success: false, error: "Marketing Coordinator not found" });
            return;
        }
        // Fetch user details by ID
        const userId = marketingcoordinator.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
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
        const editMC = await marketingcoordinator.save();
        if(editMC){
            res.status(200).json({ success: true, message: "Marketing Coordinator updated successfully" });
        } else {
            res.status(500).json({ success: false, message: "Marketing Coordinator updated fail" });
        }

        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);
        const editUser = await user.save();
        if(editUser){
            res.status(200).json({ success: true, message: "User of Marketing Coordinator updated successfully" });
        } else {
            res.status(500).json({ success: false, message: "User of Marketing Coordinator updated fail" });
        }
        
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while updating marketing coordinator:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});


//------------Phần này cho role Marketing Coordinator--------------
//trang chủ của MC---------------------------------------------------
router.get('/mcpage', checkMCSession, async (req, res) => {
    try{ 
        res.status(200).json({ success: true, message: "Marketing Coordinator Menu page" });
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
        res.status(500).json({ success: false, error: "Profile not found" });
      }
      res.status(200).json({ success: true, message: "Render edit marketing coordinator form", UserData, MCData });
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
        res.status(404).json({ success: false, error: "Marketing Coordinator not found" });
        return;
    }
    // Fetch user details by ID
    const userId = marketingcoordinator.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    if(userId == req.session.user_id && marketingcoordinatorId == req.session.mc_id){
        try {
            res.status(200).json({ success: true, message: "Render add marketing coordinator form", marketingcoordinator, user });
        } catch (error) {
            // Handle errors (e.g., marketingcoordinator not found)
            console.error(error);
            res.status(404).send('MarketingCoordinator not found');
        }
    } else {
        res.status(404).send('MarketingCoordinator not found');
    }
    
});

router.put('/editMC/:id', checkMCSession, upload.single('image'), async (req, res) => {
    const marketingcoordinatorId = req.params.id;
    const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
    if (!marketingcoordinator) {
        res.status(404).json({ success: false, error: "Marketing Coordinator not found" });
        return;
    }
    // Fetch user details by ID
    const userId = marketingcoordinator.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
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
    
            res.status(200).json({ success: true, message: "Update my MC data success" });
        } catch (error) {
            if (error.name === 'ValidationError') {
               let InputErrors = {};
               for (let field in error.errors) {
                  InputErrors[field] = error.errors[field].message;
               }
                console.error("Error while updating marketing coordinator:", error);
                res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
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
        res.status(400).json({ success: false, error: "MC not found" });
      }

        var facultyData = await FacultyModel.findOne({_id: facultyID});
        if(facultyData){
            var notificationMCList = await NotificationMCModel.find({faculty: facultyID});
            var studentData = await StudentModel.find({faculty: facultyID});
            var eventData = await EventModel.find({faculty: facultyID});
            res.status(200).json({success: true, facultyData, eventData, studentData, notificationMCList}); 
        } else {
            res.status(400).json({ success: false, error: "Faculty not found" });
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
                    res.status(200).json({ success: true, eventData, contributionList, MCData  });
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

    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

// comment và chọn Yes/No của contribution của Student-------------------------------------giống edit nên dùng put thay vì post
router.get('/contributionDetail/:id', checkMCSession, async(req, res) => {
    try {
        // Fetch contribution details by ID
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId).populate('student').populate('event');
        if (!contribution) {
            res.status(404).json({ success: false, error: "Contribution not found" });
            return;
        }

        const mcID = req.session.mc_id
        const MCData = await MarketingCoordinatorModel.findById(mcID);
        const facultyID = MCData.faculty;

        const eventID = contribution.event;
        const eventData = await EventModel.findById(eventID);
        const eventFacultyID = eventData.faculty;

        if(facultyID.equals(eventFacultyID)){
            res.status(200).json({ success: true, message: "Render edit marketing coordinator form", data: contribution });
        } else {
            res.status(500).json({ success: false, error: "Not matched Faculty" });
            return;
        }

    } catch (error) {
        // Handle errors (e.g., contribution not found)
        console.error(error);
        res.status(404).send('Contribution not found');
    }
});

router.put('/contributionDetail/:id', checkMCSession, async(req, res) => {
    try {
        // Fetch contribution by ID
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId);
        if (!contribution) {
            res.status(404).json({ success: false, error: "Contribution not found" });
            return;
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

            const submissionDate = contribution.date;
            const currentDate = new Date();
            const timeSinceSubmission = currentDate.getTime() - submissionDate.getTime(); //dùng hàm getTime: chuyển định dạng sang milisecond
            const daysSinceSubmission = timeSinceSubmission / (1000 * 3600 * 24); //1000: số mili giây trong 1 giây / 3600: số giây trong 1 giờ / 24: số h trong 1 ngày

            if(daysSinceSubmission <= 14){
                await contribution.save();
                res.status(200).json({ success: true, message: "Comment and Choose successfully" });
            } else {
                res.status(400).send("Cannot comment because out of date");
            }

        } else {
            res.status(500).send("Event Faculty not matched");
            return;
        }
        
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while checking submission:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

//---------------------------------------------------


module.exports = router;
