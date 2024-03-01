var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var MarketingManagerModel = require('../models/MarketingManagerModel');

//URL: localhose:3000/driver
//SQL: SELECT * FROM driver
//must include "async", "await"

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

//---------------------
//show all MM
router.get('/', async(req, res) => {
    var marketing_managerList = await MarketingManagerModel.find({});
    res.render('marketingmanager/index', {marketing_managerList});
});

//-------------------------------------------------------
//delete specific MM
router.get('/delete/:id', async(req, res) =>{
    //req.params: get value by url
    var id = req.params.id;
    await MarketingManagerModel.findByIdAndDelete(id);
    res.redirect('/marketingmanager');
})

//---------------------------------------------------
//add new MM
//render form for user to input
router.get('/add', async(req, res) => {
    res.render('marketingmanager/add');
});

router.post('/add', upload.single('image'), async (req, res) =>{
    //get value by form : req.body
    const name = req.body.name;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const address = req.body.address;
    const email = req.body.email;
    const password = req.body.password;
    const image = req.file //access the uploaded image

    //read the image file
    const imageData = fs.readFileSync(image.path);
    //convert image data to base 64
    const base64Image = imageData.toString('base64');
    await MarketingManagerModel.create (
        {
            name : name,
            dob : dob,
            gender : gender,
            address : address,
            email : email,
            password : password,
            image : base64Image
        }
    );
    res.redirect('/marketingmanager');
});


module.exports = router;