const jwt = require('jsonwebtoken');

//check login only
const checkLoginSession = (req, res, next) => { //chỉ check login, ko phân quyền
    if (req.session.email) {
       next();
    } else {
       res.redirect('/auth/login');
    }
 };

 //check Admin
const checkAdminSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da3') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error Admin session"});
      return;
   }
};

//check Marketing Manager
const checkMMSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da4') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error MM session"});
      return;
   }
};
 
//check Marketing Coordinator
const checkMCSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da5') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error MC session"});
      return;
   }
};
 
//check Student
const checkStudentSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da6') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error Student session"});
      return;
   }
};

//check Guest
const checkGuestSession = (req, res, next) => {
   if (req.session.email && req.session.role == '65e61d9bb8171b6e90f92da7') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error Guest session"});
      return;
   }
};

//------------------------Token----------------------------------------------------------------
//Authorization: Bearer          sfsfsfsfsefsfsf   -> đây là Authorization
//               (cần xóa)            token
//đây chỉ là check token, nghĩa là xem người dùng đã login chưa vì nếu đã login rồi thì mới có token
const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1] //lấy đoạn token, lấy phần tử thứ 1 (chính là token)

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //verify: kiểm tra, cho 2 dữ liệu vào bao gồm token và khóa

		req.userId = decoded.userId //gán userID vào req, req ko chỉ có các trường dữ liệu name, dob,.... mà còn có thêm userId //có thể lấy userID ở các route khác: const userID = req.userID
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
};
//---------------------------------------------------------------------------------------------------

//-------------
 module.exports = {
    checkLoginSession,
    checkAdminSession,
    checkMCSession,
    checkMMSession,
    checkStudentSession,
    checkGuestSession, 
    verifyToken
 }
 
 