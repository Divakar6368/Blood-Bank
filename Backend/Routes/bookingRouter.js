const express = require('express');
const { createBooking, getUserBooking } = require('../Components/createbooking');
const userMiddleware = require('../Middleware/userMiddleware');
const bookingrouter = express.Router();

bookingrouter.post('/book',userMiddleware, createBooking);
bookingrouter.get('/my-bookings',userMiddleware, getUserBooking);

module.exports = bookingrouter;