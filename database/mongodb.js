const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.set('strictPopulate', false);

mongoose.connect('mongodb://127.0.0.1:27017/ASSIGNMENT-1',{
    useNewUrlParser : true
});