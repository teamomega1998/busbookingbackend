const factory = require('./handlerFactory');

const Contact = require('../models/contactModel');
const catchAsync = require('../utils/catchAsync');

const Email = require('./../utils/email');

exports.sendMail = catchAsync(async (req,res,next) => {
    await new Email({email: `${process.env.EMAIL_FROM}`,name: `${req.body.name}`}, '', req.body.email).send('contact',`Contact form from ${req.body.name}`,req.body.message);
    next();
});



exports.getAllContacts = factory.getAll(Contact);
exports.getContact = factory.getOne(Contact);
exports.createContact = factory.createOne(Contact);
exports.updateContact = factory.updateOne(Contact);
exports.deleteContact = factory.deleteOne(Contact);