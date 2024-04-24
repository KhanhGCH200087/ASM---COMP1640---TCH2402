const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const RoleModel = require('../models/RoleModel');
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
            .json({success: false, message: 'Access token not found'})

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //verify: kiểm tra, cho 2 dữ liệu vào bao gồm token và khóa

        req.userId = decoded.userId //gán userID vào req, req ko chỉ có các trường dữ liệu name, dob,.... mà còn có thêm userId //có thể lấy userID ở các route khác: const userID = req.userID
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({success: false, message: 'Invalid token'})
    }
};
//---------------------------------------------------------------------------------------------------

//check Admin
const checkAdminSession = (req, res, next) => {
    try {
        const userId = req.userId;
        const userData = UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role;
        console.log("User Role:", userRole);
        console.log("User ID: ", userId);
        const adminRoleID = '65e61d9bb8171b6e90f92da3';
        if (userRole == adminRoleID) {
            //Code ở đây--------------------------
            next()
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

//check Marketing Manager
const checkMMSession = async (req, res, next) => { //Note: Phần này để test
    const userId = req.userId;
    const userData = await UserModel.findById(userId).exec();
    console.log(userData);
    console.log(userId);
    if (!userData) {
        return res.status(400).json({success: false, error: "Not found user"});
    }
    const userRole = userData.role;
    console.log(userData);
    const roleData = await RoleModel.findById(userRole).exec();
    if (!roleData) {
        return res.status(400).json({success: false, error: "Not found Role MM"});
    }
    const roleName = roleData.role;
    console.log(roleData);
    if (roleName === 'marketing manager ') {
        //Code ở đây--------------------------
        next()
        //----------------------------------
    } else {
        return res.status(400).json({success: false, error: "Not right Role"});
    }
};

//check Marketing Coordinator
const checkMCSession = (req, res, next) => {
    const userId = req.userId;
    const userData = UserModel.findById(userId);
    if (!userData) {
        return res.status(400).json({success: false, error: "Not found user"});
    }
    const userRole = userData.role;
    if (userRole.toString() === '65e61d9bb8171b6e90f92da5') {
        //Code ở đây--------------------------
        next()
        //----------------------------------
    } else {
        return res.status(400).json({success: false, error: "Not right Role"});
    }
};

//check Student
const checkStudentSession = (req, res, next) => {
    const userId = req.userId;
    const userData = UserModel.findById(userId);
    if (!userData) {
        return res.status(400).json({success: false, error: "Not found user"});
    }
    const userRole = userData.role;
    if (userRole.toString() === '65e61d9bb8171b6e90f92da6') {
        //Code ở đây--------------------------
        next()
        //----------------------------------
    } else {
        return res.status(400).json({success: false, error: "Not right Role"});
    }
};

//check Guest
const checkGuestSession = (req, res, next) => {
    const userId = req.userId;
    const userData = UserModel.findById(userId);
    if (!userData) {
        return res.status(400).json({success: false, error: "Not found user"});
    }
    const userRole = userData.role;
    if (userRole.toString() === '65e61d9bb8171b6e90f92da7') {
        //Code ở đây--------------------------
        next()
        //----------------------------------
    } else {
        return res.status(400).json({success: false, error: "Not right Role"});
    }
};


//-------------
module.exports = {
    checkAdminSession,
    checkMCSession,
    checkMMSession,
    checkStudentSession,
    checkGuestSession,
    verifyToken
}
 
 