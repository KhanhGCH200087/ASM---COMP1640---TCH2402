var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const archiver = require('archiver');

var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');
var ContributionModel = require('../models/ContributionModel');
var NotificationMCModel = require('../models/NotificationMCModel');

const {checkAdminSession, checkMCSession, verifyToken} = require('../middlewares/auth');
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
router.get('/',verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var marketingcoordinatorList = await MarketingCoordinatorModel.find({}).populate('user').populate('faculty');
            res.status(200).json({ success: true, data: marketingcoordinatorList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingcoordinator
router.delete('/delete/:id',verifyToken, async(req, res) => {
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
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create marketingcoordinator
//render form for user to input
router.get('/add',verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var facultyList = await FacultyModel.find({});
            res.status(200).json({ success: true, message: "Render add marketing coordinator form", data: facultyList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while adding MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add',verifyToken, upload.single('image'), async (req, res) => {
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
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
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
router.get('/edit/:id',verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
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
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    } catch (error) {
        // Handle errors (e.g., marketingcoordinator not found)
        console.error(error);
        res.status(404).send('MarketingCoordinator not found');
    }
});

// Handle form submission for editing a marketingcoordinator
router.put('/edit/:id',verifyToken, upload.single('image'), async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
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
                //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
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
//--------------trang chủ của MC---------------------------------------------------
router.get('/mcpage',verifyToken, async (req, res) => {
    try{ 
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da5'){
            //Code ở đây--------------------------
            var mcUserId = req.userId;
            var UserData = await UserModel.findById(mcUserId);
            var MCData = await MarketingCoordinatorModel.findOne({user: mcUserId});
            if(UserData && MCData){
                var facultyID = MCData.faculty;
            } else {
                res.status(400).json({ success: false, error: "MC not found" });
            }
            var facultyData = await FacultyModel.findOne({_id: facultyID});
            if(facultyData){
                var studentData = await StudentModel.find({faculty: facultyID});
            } else {
                res.status(400).json({success: false, error: "Not found Faculty"});
            }
            res.status(200).json({ success: true, message: "Marketing Coordinator Menu page", facultyData, studentData });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//đọc thông tin của MC-------------------------------------------------
router.get('/profile',verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da5'){
            //Code ở đây--------------------------
            var mcUserId = req.userId;
            var UserData = await UserModel.findById(mcUserId);
            if(UserData){
                var MCData = await MarketingCoordinatorModel.findOne({user: mcUserId});
            } else {
                res.status(500).json({ success: false, error: "Profile not found" });
            }
            res.status(200).json({ success: true, message: "Render edit marketing coordinator form", UserData, MCData });
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

//sửa thông tin của MC-------------------------------------------
router.get('/editMC/:id',verifyToken, async (req, res) => {
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
    const MCuserId = req.userId;
    if(userId.equals(MCuserId)){
        try {
            const userId = req.userId;
            const userData = await UserModel.findById(userId);
            if(!userData){
                return res.status(400).json({success: false, error: "Not found user"});
            }
            const userRole = userData.role.toString();
            if(userRole === '65e61d9bb8171b6e90f92da5'){
                //Code ở đây--------------------------
                res.status(200).json({ success: true, message: "Render add marketing coordinator form", marketingcoordinator, user });
                //----------------------------------
            } else {
                return res.status(400).json({ success: false, error: "Not right Role" });
            }
            //-------------------------------------------------
        } catch (error) {
            // Handle errors (e.g., marketingcoordinator not found)
            console.error(error);
            res.status(404).send('MarketingCoordinator not found');
        }
    } else {
        res.status(404).send('MarketingCoordinator not found');
    }
    
});

router.put('/editMC/:id',verifyToken, upload.single('image'), async (req, res) => {
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
    const mcUserId = req.userId;
    if(userId.equals(mcUserId)){
        try {
            const userId = req.userId;
            const userData = await UserModel.findById(userId);
            if(!userData){
                return res.status(400).json({success: false, error: "Not found user"});
            }
            const userRole = userData.role.toString();
            if(userRole === '65e61d9bb8171b6e90f92da5'){
                //Code ở đây--------------------------
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
                //----------------------------------
            } else {
                return res.status(400).json({ success: false, error: "Not right Role" });
            }
            //-------------------------------------------------
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
router.get('/facultypage',verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da5'){
            //Code ở đây--------------------------
            var mcUserId = req.userId;
            var UserData = await UserModel.findById(mcUserId);
            var MCData = await MarketingCoordinatorModel.findOne({user: mcUserId});
            if(UserData && MCData){
                var facultyID = MCData.faculty;
            } else {
                res.status(400).json({ success: false, error: "MC not found" });
            }
            var facultyData = await FacultyModel.findOne({_id: facultyID});
            if(facultyData){
                var notificationMCList = await NotificationMCModel.find({faculty: facultyID});
                var eventData = await EventModel.find({faculty: facultyID});
                res.status(200).json({success: true, eventData, notificationMCList}); 
            } else {
                res.status(400).json({ success: false, error: "Faculty not found" });
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

//xem event detail------------------------------------------------------ (đã có validation, dùng equal, có thể áp dụng để check lỗi các phần khác)
router.get('/eventDetail/:id',verifyToken, async (req, res) => {  
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da5'){
            //Code ở đây--------------------------
            var eventId = req.params.id;
            const eventData = await EventModel.findById(eventId);
            var eventFacultyID = eventData.faculty;
    
            const MCData = await MarketingCoordinatorModel.findOne({user: userId});
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

// comment và chọn Yes/No của contribution của Student-------------------------------------giống edit nên dùng put thay vì post
router.get('/contributionDetail/:id',verifyToken, async(req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da5'){
            //Code ở đây--------------------------
            // Fetch contribution details by ID
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId).populate('student').populate('event');
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }

            const MCData = await MarketingCoordinatorModel.findOne({user: userId});
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

router.put('/contributionDetail/:id',verifyToken, async(req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da5'){
            //Code ở đây--------------------------
             // Fetch contribution by ID
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId);
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }

            const MCData = await MarketingCoordinatorModel.findOne({user: userId});
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
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //------------------------------------------------- 
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

//tải file về để chấm điểm
router.get('/download/:id',verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da5'){
            //Code ở đây--------------------------
            const mcData = await MarketingCoordinatorModel.findOne({user: userId});
            if(!mcData){
                res.status(400).json({success: false, error: 'Not found contribution'});
            }
            const mcFaculty = mcData.faculty;
            //---------------
            const contributionId = req.params.id;
            const contributionData = await ContributionModel.findById(contributionId);
            if(!contributionData){
                res.status(400).json({success: false, error: 'Not found contribution'});
            }
            if(!contributionData.contribution){
                res.status(400).json({success: false, error: 'There are no submition in this contribution'});
            }
            const contributionType = contributionData.filetype;
            const contributionFilename = contributionData.contribution;
            const imagePath = path.join(__dirname, '../public/images/', contributionFilename);  // Sanitize path
            //----------
            const eventId = contributionData.event;
            const eventData = await EventModel.findById(eventId);
            if(!eventData){
                res.status(400).json({success: false, error: 'Not found event'});
            }
            const eventFaculty = eventData.faculty;
            //------------
            const studentId = contributionData.student;
            const studentData = await StudentModel.findById(studentId);
            if(!studentData){
                res.status(400).json({success: false, error: 'Not found student'});
            }
            const studentName = studentData.name;
            const studentFaculty = studentData.faculty;
            //---------------------------------------------------------------------------
            if(mcFaculty.equals(eventFaculty)){
                if(mcFaculty.equals(studentFaculty)){  
                    if(contributionType === 'word'){ //trường hợp đây là file word
                        // Create a zip archive
                        const archive = archiver('zip');
                        res.setHeader('Content-Type', 'application/zip');
                        res.setHeader('Content-Disposition', `attachment; filename="student_${studentName}_word.zip"`);
                        // Pipe the archive data to the response
                        archive.pipe(res);
                        // Add the word document to the archive
                        archive.append(Buffer.from(contributionData.contribution, 'base64'), { name: 'student_word.docx' });
                        // Finalize the archive
                        archive.finalize();
                    } else if (contributionType === 'image') {
                        if (!fs.existsSync(imagePath)) {
                          return res.status(404).json({ success: false, error: 'Image file not found' });
                        }
                  
                        res.setHeader('Content-Type', `image/${contributionFilename.split('.').pop()}`);
                        res.setHeader('Content-Disposition', `attachment; filename="${contributionFilename}"`);
                  
                        const imageStream = fs.createReadStream(imagePath);
                        imageStream.pipe(res);
                  
                        imageStream.on('error', (err) => {
                          console.error('Error streaming image:', err);
                          res.status(500).json({ success: false, error: 'Internal server error' });
                        });
                      }
                } else {
                res.status(500).json({success: false, error: 'Invalid MC account'});
            }
            } else {
                res.status(500).json({success: false, error: 'Invalid MC account'});
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    } catch(error) {
        console.error("Error: ", error);
        res.status(500).json({success: false, error: 'Internal Error'});
    }
});
//---------------------------------------------------


module.exports = router;
