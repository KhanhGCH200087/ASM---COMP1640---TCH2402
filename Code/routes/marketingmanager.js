var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var MarketingManagerModel = require('../models/MarketingManagerModel');
var RoleModel = require('../models/RoleModel');

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
        var marketingmanagerList = await MarketingManagerModel.find({}).populate('role');
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
        var id = req.params.id;
        await MarketingManagerModel.findByIdAndDelete(id);
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
        var roleList = await RoleModel.find({});
        res.render('marketingmanager/add', {roleList});
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
        const role = req.body.role;
        const gender = req.body.gender;
        const address = req.body.address;
        const email = req.body.email;
        const password = req.body.password;
        const image = req.file //access the uplodaded image
      
        //read the image file
        const imageData = fs.readFileSync(image.path);
        //convert image data to base 64
        const base64Image = imageData.toString('base64');
        await MarketingManagerModel.create(
            {
                name: name,
                dob: dob,
                role: role,
                gender: gender,
                address: address,
                email: email,
                password: password,
                image: base64Image
            }
        );
        res.redirect('/marketingmanager');
    }catch(error){
        console.error("Error while adding MM list:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

//---------------------------------------------------------------------------
//edit marketingmanager
// Render form for editing a specific marketingmanager
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch marketingmanager details by ID
        const marketingmanagerId = req.params.id;
        const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId).populate('role');
        if (!marketingmanager) {
            throw new Error('MarketingManager not found');
        }
        // Fetch role lists for dropdowns
        const roleList = await RoleModel.find({});
        // Render edit form with marketingmanager details and dropdown options
        res.render('marketingmanager/edit', { marketingmanager, roleList });
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
        // Update marketingmanager details
        marketingmanager.name = req.body.name;
        marketingmanager.dob = req.body.dob;
        marketingmanager.role = req.body.role;
        marketingmanager.gender = req.body.gender;
        marketingmanager.address = req.body.address;
        marketingmanager.email = req.body.email;
        marketingmanager.password = req.body.password;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            marketingmanager.image = imageData.toString('base64');
        }
        // Save updated marketingmanager to the database
        await marketingmanager.save();
        // Redirect to marketingmanager list page
        res.redirect('/marketingmanager');
    } catch (error) {
        // Handle errors (e.g., marketingmanager not found, validation errors)
        console.error(error);
        res.status(400).send(error.message);
    }
});

//-----------------------------------
module.exports = router;
