const { getAll, create, getOne, remove, update, verifyUser } = require('../controllers/user.controllers');
const express = require('express');

const userRouter = express.Router();

userRouter.route('/users')
    .get(getAll)
    .post(create);

userRouter.route('/users/verify/:code')
    .get(verifyUser)

userRouter.route('/users/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = userRouter;