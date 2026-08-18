const express = require('express');
const { createBooking, getUserBookings } = require('../Components/createbooking');
const bookingrouter = express.Router();

bookingrouter.post('/book', createBooking);
bookingrouter.get('/my-bookings', getUserBookings);

module.exports = router;