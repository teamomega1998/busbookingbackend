const express = require('express');
const busController = require('./../controllers/busController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', busController.checkID);

// POST /bus/234fad4/reviews
// GET /bus/234fad4/reviews

//router.use('/:busId/reviews', reviewRouter);



router.route('/availableBuses').get(busController.getAvailabeBuses,busController.getAllBuses);

router
  .route('/')
  .get(busController.getAllBuses)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    busController.createBus
  );

router
  .route('/:id')
  .get(busController.getBus)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    busController.uploadBusPhoto,
    busController.resizeBusPhoto,
    busController.updateBus
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    busController.deleteBus
  );

module.exports = router;
