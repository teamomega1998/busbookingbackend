const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');


const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRoutes");
const busRouter = require("./routes/busRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const contactRouter = require("./routes/contactRoutes");


app.use(express.json());

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: ["POST,GET,PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));


app.options('*', cors());

app.use(cookieParser());

app.use('/api/buses', busRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't fid ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
