const catchError = require('../utils/catchError');
const User = require('../models/User');
const Code = require('../models/Code');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const { where } = require('sequelize');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { email, password, firstName, lastName, image, country, frontBaseUrl } = req.body
    const hashed_password = await bcrypt.hash(password, 10)
    const createdUser = await User.create({
        email, 
        password: hashed_password,
        firstName, 
        lastName, 
        image, 
        country
    });

    const code = require('crypto').randomBytes(32).toString('hex')
    const link = `${frontBaseUrl}/${code}`

    await Code.create({
        code: code,
        userId: createdUser.id
    })

    await sendEmail({
        to: `${req.body.email}`,
        subject: `Verificate email user app`,
        html: `
            <h1>Hello ${req.body.firstName} ${req.body.lastName}</h1>
            <h2>Thanks for signing up in user app</h2>
            <p>Please confirm your account by clicking this link:</p>
            <a href="${link}">${link}</a>
            `
    })

    return res.status(201).json(createdUser);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, image, country } = req.body
    const result = await User.update(
        { email, firstName, lastName, image, country },
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const verifyUser = catchError(async(req, res) => {
    const { code } = req.params
    // se busca si existe el codigo
    const userCode = await Code.findOne({ where: {code: code} })
    if (!userCode) return (res.status(401).json({message: 'no se encontró el codigo de verificación'}))
    // se actualiza el user (si existe el codigo)
    const user = await User.findByPk(userCode.userId)
    user.isVerified = true
    await user.save() // cuando se actualizan los atributos de esta forma
    // se elimina el codigo de la db
    await Code.destroy({ where: { id: userCode.id }})

    return res.json(user)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    verifyUser
}