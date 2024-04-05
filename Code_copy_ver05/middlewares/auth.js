//check login only
const checkLoginSession = (req, res, next) => { //chỉ check login, ko phân quyền
    if (req.session.email) {
       next();
    } else {
       res.redirect('/auth/login');
    }
 }

 //check Admin
const checkAdminSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da3') {
      next();
   }
   else {
      res.redirect('/auth/login');
      return;
   }
}

//check Marketing Manager
const checkMMSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da4') {
      next();
   }
   else {
      res.redirect('/auth/login');
      return;
   }
}
 
//check Marketing Coordinator
const checkMCSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da5') {
      next();
   }
   else {
      res.redirect('/auth/login');
      return;
   }
}
 
//check Student
const checkStudentSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da6') {
      next();
   }
   else {
      res.redirect('/auth/login');
      return;
   }
}




 module.exports = {
    checkLoginSession,
    checkAdminSession,
    checkMCSession,
    checkMMSession,
    checkStudentSession
 }
 
 