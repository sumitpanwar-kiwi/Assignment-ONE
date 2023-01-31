const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.set('strictPopulate', false);

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true
});