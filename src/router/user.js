const express = require('express');
const multer = require('multer');
const Usercontroller = require('../controller/user');
const auth = require('../middleware/auth')

const router = express.Router();


//get all users
router.get('/all',auth, Usercontroller.getAllUsers);


//avatar configuration
const avatar = multer({
    limits :{
        fileSize : 5000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('File must be in jpg OR png OR jpeg format!'));
        }
        cb(undefined, true);
    }
})


//Create new users
router.post('/create',auth, avatar.single('avatar'),Usercontroller.createUsers);


//login route
router.post('/login', Usercontroller.login);


//logout user
router.post('/logout', auth, Usercontroller.logout);



//update user by admin
router.patch('/update/:id', auth, Usercontroller.updateSpecificUser);


//delete user by admin
router.delete('/delete/:id', auth, Usercontroller.deleteSpecificUser);


//view details by user
router.get('/me', auth, Usercontroller.viewProfile);


//update details by user
router.patch('/me', auth, Usercontroller.updateProfile);



module.exports = router;
