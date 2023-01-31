require('dotenv').config();
require('./database/mongodb');

const express = require('express');

const userRouter = require('./src/router/user');
const postRouter = require('./src/router/post');

const app = express();


app.use(express.json());

app.use('/user', userRouter);
app.use('/post', postRouter);

app.listen(8000, ()=>console.log('Server is running on the PORT 8000'));