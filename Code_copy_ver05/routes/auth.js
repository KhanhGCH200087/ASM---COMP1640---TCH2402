var express = require('express')
var router = express.Router()
var UserModel = require('../models/UserModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var MarketingManagerModel = require('../models/MarketingManagerModel');
var StudentModel = require('../models/StudentModel');

//import "bcryptjs" library
var bcrypt = require('bcryptjs');
var salt = 8;                     //random value

router.get('/login', (req, res) => {
   res.render('auth/login')
})

router.post('/login', async (req, res) => {
   try {
      var userLogin = req.body;
      var user = await UserModel.findOne({ email: userLogin.email }) //email: tên cột, userLogin.email: người dùng nhập vào //dùng hàm findOne để đối chiếu dữ liệu đc nhập vào và db có khớp ko
      
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


      if (user) {
         var hash = bcrypt.compareSync(userLogin.password, user.password)
         if (hash) {
            //initialize session after login success
            req.session.user_id = user._id;
            req.session.email = user.email;
            req.session.role = user.role; //take role from db, put it to session so it can be checked in middleware

            if (user.role == '65e61d9bb8171b6e90f92da3') { //role: admin
               res.redirect('/admin');
            }
            else if(user.role == '65e61d9bb8171b6e90f92da4') { //role: Marketing Manager
               res.redirect('/marketingmanager');
            }
            else if(user.role == '65e61d9bb8171b6e90f92da5'){ //role: Marketing Coordinator
               res.redirect('/marketingcoordinator/mcpage');
            }
            else if(user.role == '65e61d9bb8171b6e90f92da6'){ //role: Student
                res.redirect('/student/studentpage');
            }
         }
         else {
            res.redirect('/auth/login');
         }
      }
   } catch (err) {
      res.send(err)
   }
});

router.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect("/auth/login");
})

module.exports = router