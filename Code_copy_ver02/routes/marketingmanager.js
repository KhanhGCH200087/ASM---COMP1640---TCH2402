var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var MarketingManagerModel = require('../models/MarketingManagerModel');
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
        var marketingmanagerList = await MarketingManagerModel.find({}).populate('user');
        //render view and pass data
        res.render('marketingmanager/index', {marketingmanagerList});
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingmanager
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        const marketingmanagerId = req.params.id;
        const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
        if (!marketingmanager) {
            throw new Error('MarketingManager not found');
        }
        // Fetch user details by ID
        const userId = marketingmanager.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await MarketingManagerModel.findByIdAndDelete(marketingmanagerId);
        await UserModel.findByIdAndDelete(userId);
        res.redirect('/marketingmanager');
    }catch(error){
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create marketingmanager
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        res.render('marketingmanager/add');
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
        const image = req.file //access the uplodaded image

        const email = req.body.email;
        const password = req.body.password;
        const hashPassword = bcrypt.hashSync(password, salt);
        const role = '65e61d9bb8171b6e90f92da4'; //objectID
      
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
        await MarketingManagerModel.create(
            {
                name: name,
                dob: dob,
                gender: gender,
                address: address,
                image: base64Image,
                user: users
            }
        );
        
        res.redirect('/marketingmanager');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('marketingmanager/add', { InputErrors, marketingmanager });
        }
     }
    
});

//---------------------------------------------------------------------------
//edit marketingmanager
// Render form for editing a specific marketingmanager
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch marketingmanager details by ID
        const marketingmanagerId = req.params.id;
        const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
        if (!marketingmanager) {
            throw new Error('MarketingManager not found');
        }

        // Fetch user details by ID
        const userId = marketingmanager.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Render edit form with marketingmanager details and dropdown options
        res.render('marketingmanager/edit', { marketingmanager, user});
    } catch (error) {
        // Handle errors (e.g., marketingmanager not found)
        console.error(error);
        res.status(404).send('MarketingManager not found');
    }
});

// Handle form submission for editing a marketingmanager
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        // Fetch marketingmanager by ID
        const marketingmanagerId = req.params.id;
        const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
        if (!marketingmanager) {
            throw new Error('MarketingManager not found');
        }
        // Fetch user details by ID
        const userId = marketingmanager.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update marketingmanager details
        marketingmanager.name = req.body.name;
        marketingmanager.dob = req.body.dob;
        marketingmanager.gender = req.body.gender;
        marketingmanager.address = req.body.address;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            marketingmanager.image = imageData.toString('base64');  
        } 
        await marketingmanager.save();
        
        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);
        await user.save();

        // Redirect to marketingmanager list page
        res.redirect('/marketingmanager');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('marketingmanager/edit', { InputErrors, marketingmanager });
        }
     }
});

//-----------------------------------
module.exports = router;
