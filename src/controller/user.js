const User = require('../model/user');


//create user funciton
const createUsers = async(req, res)=>{
    try {
        if(req.user.role =='user'){
            throw new Error('To create a new user, Please login as an ADMIN')
        }
        
        const user = new User(req.body);

        if(user.role=='admin'){
            throw new Error('Admin already exists! Cannot create two admins');
        }
        user.avatar = req.file.buffer;
        await user.save();
        res.status(201).send({message : 'New user Created', user})
    } catch (error) {
        res.status(500).send({error : error.message});
    }
};


//get all users function
const getAllUsers = async(req, res)=>{
    try {
        if(req.user.role =='user'){
            throw new Error('To view all users, Please login as an ADMIN')
        }
        const users = await User.find({role : 'user'});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
};


//login function
const login = async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});    
    } catch (error) {
        res.status(500).send({error : error.message})
    }
};


//logout function
const logout = async(req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token);
        await req.user.save();
        res.send({message : 'Logout Successfully'});
    } catch (error) {
        res.status(500).send({error : error.message});
    }
};


//update user by id funciton
const updateSpecificUser = async(req, res)=>{
    if(req.user.role =='user'){
        return res.status(400).send({error : 'To update a specific user, Please login as an ADMIN'})
    }
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).send({Invalid_Id : 'User not found'});
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone_no', 'password', 'address','active'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error : "Cannot update the given fields "});
    }

    try {
        updates.forEach((update)=>{
            user[update] = req.body[update];
        })
    
        await user.save();
        res.send({message : 'User Updated',user});
    } catch (error) {
        res.status(500).send({error : error.message});
    }
}


//delete user by id fucntion
const deleteSpecificUser = async(req, res)=>{
    if(req.user.role =='user'){
        return res.status(400).send({error : 'To delete a specific user, Please login as an ADMIN'})
    }

    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).send({Invalid_Id : 'User not found'})
        }
        if(user.role == 'admin'){
            return res.status(400).send({error : 'Admin cannot be removed'});
        }
        await user.remove();
        res.send({message : 'User removed', user})
    } catch (error) {
        res.status(400).send({error : error.message});
    }
};


//view your own profile function
const viewProfile = (req, res)=>{
    res.send(req.user);
};

//update your own profile funciton
const updateProfile = async(req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone_no', 'password', 'address','active'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error : "Cannot update the given fields "});
    }

    try {
        updates.forEach((update)=>{
            req.user[update] = req.body[update];
        })
    
        await req.user.save();
        res.send({message : 'User Updated',user: req.user});
    } catch (error) {
        res.status(500).send({error : error.message});
    }
};


//exporting all the funcitons
module.exports = {
    createUsers,
    getAllUsers,
    login,
    logout,
    updateSpecificUser,
    deleteSpecificUser,
    viewProfile,
    updateProfile,
}