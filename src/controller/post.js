const Post = require('../model/post');

const createPost = async(req, res)=>{
    try {
        const post = new Post({
            ...req.body,
            owner : req.user._id
        });

        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
};

const viewPost = async(req, res)=>{
    const posts = await Post.find({owner : req.user._id});
    res.send(posts);
};

const viewSpecificPost = async(req, res)=>{
    try {
        if(req.user.role == 'user'){
            return res.status(400).send('You cannot read a specific post. Login as an admin to see post details');
        }
        const post = await Post.findById(req.params.id);
        if(!post){
            throw new Error('Invalid post id');
        }
        await post.populate({
            path : 'owner'
        })
        res.send(post);
    } catch (error) {
        res.status(400).send({error : error.message});
    }
};

const deleteSpecificPost = async(req, res)=>{
    try {
        if(req.user.role == 'user'){
            return res.status(400).send('You cannot delete a specific post. Login as an admin to see delete a post');
        }
        const post = await Post.findById(req.params.id);
        if(!post){
            throw new Error('Invalid post id');
        }
        post.remove();
        res.send({message : 'Post removed sucessfully',post});
    } catch (error) {
        res.status(400).send({error : error.message});
    }
};

module.exports={
    createPost,
    viewPost,
    viewSpecificPost,
    deleteSpecificPost,
}