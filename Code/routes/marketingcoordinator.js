var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var RoleModel = require('../models/RoleModel');
var FacultyModel = require('../models/FacultyModel');

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
//show all //Admin
router.get('/', async(req, res) => {
    try{
        var marketingcoordinatorList = await MarketingCoordinatorModel.find({}).populate('role').populate('faculty');
        //render view and pass data
        res.render('marketingcoordinator/index', {marketingcoordinatorList});
    }catch(error){
        console.error("Error while fetching MC list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//--------------------------------------------------------------------------
//show all //MC
router.get('/details', async(req, res) => {
    try{
        var marketingcoordinatorList = await MarketingCoordinatorModel.find({}).populate('role').populate('faculty');
        //render view and pass data
        res.render('marketingcoordinator/indexMC', {marketingcoordinatorList});
    }catch(error){
        console.error("Error while fetching MC list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingcoordinator //Admin
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await MarketingCoordinatorModel.findByIdAndDelete(id);
        res.redirect('/marketingcoordinator');
    }catch(error){
        console.error("Error while deleting MC:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create marketingcoordinator
//render form for user to input //Admin
router.get('/add', async (req, res) => {
    try{
        var roleList = await RoleModel.find({});
        var facultyList = await FacultyModel.find({});
        res.render('marketingcoordinator/add', {roleList, facultyList});
    }catch(error){
        console.error("Error while adding MC:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', upload.single('image'), async (req, res) => {
    //get value by form : req.body
    try{
        const name = req.body.name;
        const dob = req.body.dob;
        const role = req.body.role;
        const faculty = req.body.faculty;
        const gender = req.body.gender;
        const address = req.body.address;
        const email = req.body.email;
        const password = req.body.password;
        const image = req.file //access the uplodaded image
    
        //read the image file
        const imageData = fs.readFileSync(image.path);
        //convert image data to base 64
        const base64Image = imageData.toString('base64');
        await MarketingCoordinatorModel.create(
            {
                name: name,
                dob: dob,
                role: role,
                faculty: faculty,
                gender: gender,
                address: address,
                email: email,
                password: password,
                image: base64Image
            }
    );
    res.redirect('/marketingcoordinator');
    }catch(error){
        console.error("Error while adding MC:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
//edit marketingcoordinator //Admin
// Render form for editing a specific marketingcoordinator
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch marketingcoordinator details by ID
        const marketingcoordinatorId = req.params.id;
        const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId).populate('role').populate('faculty');
        if (!marketingcoordinator) {
            throw new Error('MarketingCoordinator not found');
        }
        // Fetch role and faculty lists for dropdowns
        const roleList = await RoleModel.find({});
        const facultyList = await FacultyModel.find({});
        // Render edit form with marketingcoordinator details and dropdown options
        res.render('marketingcoordinator/edit', { marketingcoordinator, roleList, facultyList });
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
        // Update marketingcoordinator details
        marketingcoordinator.name = req.body.name;
        marketingcoordinator.dob = req.body.dob;
        marketingcoordinator.role = req.body.role;
        marketingcoordinator.faculty = req.body.faculty;
        marketingcoordinator.gender = req.body.gender;
        marketingcoordinator.address = req.body.address;
        marketingcoordinator.email = req.body.email;
        marketingcoordinator.password = req.body.password;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            marketingcoordinator.image = imageData.toString('base64');
        }
        // Save updated marketingcoordinator to the database
        await marketingcoordinator.save();
        // Redirect to marketingcoordinator list page
        res.redirect('/marketingcoordinator');
    } catch (error) {
        // Handle errors (e.g., marketingcoordinator not found, validation errors)
        console.error(error);
        res.status(400).send(error.message);
    }
});

//-----------------------------------
//edit marketingcoordinator //MC
router.get('/editMC/:id', async (req, res) => {
    try {
        // Fetch marketingcoordinator details by ID
        const marketingcoordinatorId = req.params.id;
        const marketingcoordinator = await MarketingCoordinatorModel.findById(marketingcoordinatorId);
        if (!marketingcoordinator) {
            throw new Error('MarketingCoordinator not found');
        }
        // Fetch role and faculty lists for dropdown
        // Render edit form with marketingcoordinator details and dropdown options
        res.render('marketingcoordinator/editMC', { marketingcoordinator });
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
        // Update marketingcoordinator details
        marketingcoordinator.name = req.body.name;
        marketingcoordinator.dob = req.body.dob;
        marketingcoordinator.gender = req.body.gender;
        marketingcoordinator.address = req.body.address;
        marketingcoordinator.password = req.body.password;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            marketingcoordinator.image = imageData.toString('base64');
        }
        // Save updated marketingcoordinator to the database
        await marketingcoordinator.save();
        // Redirect to marketingcoordinator list page
        res.redirect('/marketingcoordinator');
    } catch (error) {
        // Handle errors (e.g., marketingcoordinator not found, validation errors)
        console.error(error);
        res.status(400).send(error.message);
    }
});

module.exports = router;
