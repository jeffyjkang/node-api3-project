const express = require('express');
const { get, insert, update, remove, getUserPosts } = require('./users-model');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');

const posts = require('../posts/posts-model');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await get()
    res.json(users)
  }
  catch {
    res.status(500).json({message: 'Error retrieving users'})
  }
});

router.get('/:id', validateUserId, async (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post('/', validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const newUser = await insert(req.body);
    if (newUser) {
      res.status(201).json(newUser)
    }
    else {
      res.status(404).json({ message: 'user not found'})
    }
  }
  catch (err) {
    res.status(500).json({ message: 'there was a problem creating new user'})
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const updatedUser = await update(req.params.id, req.body);
    console.log(updatedUser)
    if (updatedUser) {
      res.json(updatedUser)
    } else {
      res.status(404).json({ message: 'user not found'})
    }
  }
  catch (err) {
    res.status(500).json({ message: 'there was a problem updating user'});
  }
});

router.delete('/:id', validateUserId,  async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const deletedUser = req.user
    await remove(req.params.id)
    if (deletedUser) {
      res.json(deletedUser);
    }
    else {
      res.json(404).json({ message: 'user not found'})
    }
  }
  catch {
    res.status(500).json({ message: 'there was a problem deleting user'})
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const posts = await getUserPosts(req.params.id);
    if (posts) {
      res.json(posts)
    } else {
      res.status(404).json({ message: 'cannot find posts'})
    }
  }
  catch {
    res.status(500).json({ message: 'error finding posts'})
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const {id} = req.params
    const {text} = req.body
    const createdPost = await posts.insert({user_id: id, text})
    if (createdPost) {
      res.status(201).json(createdPost)
    }
    else {
      res.status(404).json({message: 'cannot create post'})
    }
  }
  catch (err) {
    res.status(500).json({ message: 'error creating post'})
  }
});

// do not forget to export the router
module.exports = router;