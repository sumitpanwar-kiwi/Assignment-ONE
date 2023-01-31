const express = require('express');

const postController = require('../controller/post');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res)=> res.send('Hello from the post page'));

//reject the user while creating post if the user is inactive
const canPost = (req,res,next)=>{
    try {
        if(req.user.active == false){
            throw new Error();
        }
        next();
    } catch (error) {
        res.status(400).send({error : 'User is not active'});
    }
}

//create post
router.post('/create',auth, canPost, postController.createPost);

//read post
router.get('/view', auth, postController.viewPost);

//get specific post by admin
router.get('/view/:id', auth, postController.viewSpecificPost);

//delete specific post by admin
router.delete('/delete/:id', auth, postController.deleteSpecificPost);

module.exports = router;
