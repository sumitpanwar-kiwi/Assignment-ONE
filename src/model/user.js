const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

//User model Schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxLength : 20,
        minLength : 4,
    },
    email :{
        type : String,
        unique : true,
        required : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email format');
            }
        },
    },
    password : {
        type : String,
        required : true,
        minLength : 8,
    },
    phone_no : {
        type : String,
        required : true,
        minLength : 9,
        maxLength : 14,
    },
    address : {
        type : String,
        required : true,
        minLength: 10,
        maxLength: 50,
    },
    role : {
        type : String,
        default : 'user'
    },
    active : {
        type : Boolean,
        default : true
    },
    tokens :[
        {
            token :{
                type : String,
            }
        }
    ],
    avatar : {
        type : Buffer,
    }
},{
    timestamps : true,
});

//deleteing some unwanted data that is unessesary to show in the response
//not deleteing from database, only to response.send()
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    delete userObject.role;
    delete userObject.__v;

    return userObject;
}

//generating auth token
userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const token = jwt.sign({_id : user._id.toString()}, process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

//checking login credentials
userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email});
    
    if(!user){
        throw new Error('Email is not registered');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Wrong Password');
    }
    
    return user;
}

//hashing the password before saving it to the database
userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});


//User model
const User = mongoose.model('users',userSchema);

module.exports = User;
