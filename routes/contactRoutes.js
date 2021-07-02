const express = require('express');


const authController = require('./../controllers/authController');
const contactController = require('./../controllers/contactController');


const router = express.Router();

router.route('/')
.get(authController.protect,authController.restrictTo('admin'),contactController.getAllContacts)
.post(contactController.sendMail,contactController.createContact);


authController.restrictTo('admin')

router.route('/:id')
.get(contactController.getContact)
.patch(contactController.updateContact)
.delete(contactController.deleteContact);

module.exports = router;