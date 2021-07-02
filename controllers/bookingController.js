const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Bus = require('../models/busModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked bus
  const bus = await Bus.findById(req.params.busId);
  //console.log(bus);

  // 2) Create checkout session
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   // success_url: `${req.protocol}://${req.get('host')}/my-buss/?bus=${
  //   //   req.params.busId
  //   // }&user=${req.user.id}&price=${bus.price}`,
  //   success_url: `${req.protocol}://${req.get('host')}/`,
  //   cancel_url: `${req.protocol}://${req.get('host')}/`,
  //   customer_email: req.user.email,
  //   client_reference_id: req.params.busId,
  //   line_items: [
  //     {
  //       amount: bus.price,
  //       name: `${bus.name} Bus`,
  //       description: bus.summary,
  //       images: [
  //         `${req.protocol}://${req.get('host')}/img/buss/${bus.images}`
  //       ],
  //       currency: 'usd',
  //       quantity: 1
  //     }
  //   ]
  // });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${bus.type} bus No: ${bus.busNumber}`,
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: bus.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/bookings/payment-success?busId=${req.params.busId}&userId=${req.user.id}`,
    cancel_url: `https://www.google.com`,
    customer_email: req.user.email,
    client_reference_id: req.params.busId
  });


  

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { busId, userId } = req.query;

  const bus = await Bus.findById(busId);
  const user = await User.findById(userId);


  if (!bus && !user) return next(new AppError('no user or bus',404));
  
 await Booking.create({ bus: busId, user: userId});
 await Bus.findByIdAndUpdate(bus,{available_seats: bus.available_seats - 1});
 
//  res.status(200).json({
//   status: 'success',
//   message: "Bus booked successfully"
// });
res.redirect("http://127.0.0.1:5500/Home.html?alert");

});

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
