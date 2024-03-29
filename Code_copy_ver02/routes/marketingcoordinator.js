var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');

//-------------------------------------------
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
router.get('/delete/:id', async(req, res) => {
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
router.get('/add', async (req, res) => {
    try{
        var facultyList = await FacultyModel.find({});
        res.render('marketingcoordinator/add', {facultyList});
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
router.get('/edit/:id', async (req, res) => {
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
router.post('/edit/:id', upload.single('image'), async (req, res) => {
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

//-----------------------------------
//edit function for user as MC
router.get('/editMC/:id', async (req, res) => {
    try {
        // Fetch marketingcoordinator details by ID
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

        // Render edit form with marketingcoordinator details and dropdown options
        res.render('marketingcoordinator/editMC', { marketingcoordinator, user});
    } catch (error) {
        // Handle errors (e.g., marketingcoordinator not found)
        console.error(error);
        res.status(404).send('MarketingCoordinator not found');
    }
});

// Handle form submission for editing a marketingcoordinator
router.post('/editMC/:id', upload.single('image'), async (req, res) => {
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
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            marketingcoordinator.image = imageData.toString('base64');  
        } 
        await marketingcoordinator.save();
        
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

module.exports = router;