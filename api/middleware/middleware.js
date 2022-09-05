const { getById } = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  const logObject = {
    method: req.method,
    url: req.url,
    timestamp: Date.now()
  }
  console.log(logObject)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await getById(req.params.id)
    if (user) {
      req.user = user;
      next();
    }
    else {
      res.status(404).json({ message: 'user not found'})
    }
  }
  catch (err) {
    res.status(500).json({ message: 'there was a problem retrieving user'});
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (req.body.name) {
    req.body.name = req.body.name.trim();
    next();
  }
  else {
    res.status(400).json({ message: 'missing required name field'});
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if (req.body.text) {
    req.body.text = req.body.text.trim()
    next();
  }
  else {
    res.status(400).json({ message: 'missing required text field'})
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}
