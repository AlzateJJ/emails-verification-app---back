const { getAll, create, getOne, remove, update, verifyUser, login, getLoggedUser } = require('../controllers/user.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT')

const userRouter = express.Router();

userRouter.route('/users')
    .get(verifyJWT, getAll)
    .post(create);

userRouter.route('/users/login')
    .post(login)

userRouter.route('/users/me')
    .post(verifyJWT, getLoggedUser)

userRouter.route('/users/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);
        
userRouter.route('/users/verify/:code')
    .get(verifyUser)


module.exports = userRouter;