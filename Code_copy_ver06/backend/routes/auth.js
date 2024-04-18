var express = require('express')
var router = express.Router()
var UserModel = require('../models/UserModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var MarketingManagerModel = require('../models/MarketingManagerModel');
var StudentModel = require('../models/StudentModel');
var GuestModel = require('../models/GuestModel');
const {verifyToken} = require('../middlewares/auth');
const jwt = require('jsonwebtoken')

//import "bcryptjs" library
var bcrypt = require('bcryptjs');
var salt = 8; //random value

//check if user is logged in
router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId).select('-password')
		if (!user){
			return res.status(400).json({ success: false, message: 'User not found' })
      }
		res.json({ success: true, user })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/login', async (req, res) => {
   try {
      var userLogin = req.body;
      var user = await UserModel.findOne({ email: userLogin.email }) //email: tên cột, userLogin.email: người dùng nhập vào //dùng hàm findOne để đối chiếu dữ liệu đc nhập vào và db có khớp ko
      
      if (user) {
         var hash = bcrypt.compareSync(userLogin.password, user.password);
         if (hash) {
            //----------Token---------------------------------
            const accessToken = jwt.sign(
               { userId: user._id },
               process.env.ACCESS_TOKEN_SECRET
            )
      
            //-----------------Session----------------------------------
            var userId = user._id;
            //Marketing Coordinator
            var MarketingCoordinatorData = await MarketingCoordinatorModel.findOne({user: userId});
            if(MarketingCoordinatorData){
               req.session.mc_id = MarketingCoordinatorData._id;
            }
            //MarketingManager
            var MarketingManagerData = await MarketingManagerModel.findOne({user: userId});
            if(MarketingManagerData){
               req.session.mm_id = MarketingManagerData._id;
            }
            //Student
            var StudentData = await StudentModel.findOne({user: userId});
            if(StudentData){
               req.session.st_id = StudentData._id;
            }
            //Guest
            var GuestData = await GuestModel.findOne({user: userId});
            if(GuestData){
               req.session.guest_id = GuestData._id;
            }
            //--------------------------------------------------------------------------------------
            req.session.user_id = user._id;
            req.session.email = user.email;
            req.session.role = user.role; //take role from db, put it to session so it can be checked in middleware
            const sessionRole = req.session.role;
            const sessionEmail = req.session.email;
            const sessionUserId = req.session.user_id;
            // if (user.role == '65e61d9bb8171b6e90f92da3') { //role: admin
            //    res.redirect('/admin');
            // }
            // else if(user.role == '65e61d9bb8171b6e90f92da4') { //role: Marketing Manager
            //    res.redirect('/marketingmanager');
            // }
            // else if(user.role == '65e61d9bb8171b6e90f92da5'){ //role: Marketing Coordinator
            //    res.redirect('/marketingcoordinator/mcpage');
            // }
            // else if(user.role == '65e61d9bb8171b6e90f92da6'){ //role: Student
            //     res.redirect('/student/studentpage');
            // } 
            // else if (user.role == '65e61d9bb8171b6e90f92da7'){ //role guest
            //    res.redirect(''); //sửa ở đây, thêm route
            // }
            return res.json({
               success: true,
               message: 'User logged in successfully',
               accessToken,
               sessionRole,
               sessionEmail,
               sessionUserId             
            });
         } else {
            return res.status(400).json({ success: false, message: 'Incorrect email or password' })
         }
      } else {
         return res.status(400).json({ success: false, message: 'Incorrect email or password' })
      }
   } catch (err) {
      res.status(500).json({success: false, error: 'Internal Error'});
      console.log("Error", err);
   }
});

router.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect("/auth/login");
})

module.exports = router