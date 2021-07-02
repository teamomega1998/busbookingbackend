const multer = require('multer');
const sharp = require('sharp');
const Bus = require('../models/busModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const { query } = require('express');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadBusPhoto = upload.single('photo');

exports.resizeBusPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `bus-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/buses/${req.file.filename}`);

  next();
});


exports.getAvailabeBuses = catchAsync(async (req,res,next) => {
     req.query = Object.assign(req.query,{$and: [{$or: [{"departureTime" : { gt : Date.now() }},{"departureTime" : { $eq: null }}]},{"available_seats": {gt: 0}}]});
     
     next();
});


exports.getAllBuses = factory.getAll(Bus);
exports.getBus = factory.getOne(Bus);
exports.createBus = factory.createOne(Bus);
exports.updateBus = factory.updateOne(Bus);
exports.deleteBus = factory.deleteOne(Bus);
