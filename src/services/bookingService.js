const {
  createBooking,
  findBookings,
  updateBooking,
  deleteBooking,
  findAllBookings,
} = require('../repositories/bookingRepository');

const addBooking = async (data) => createBooking(data);
const getUserBookings = async (userId) => findBookings(userId);
const editBooking = async (id, data) => updateBooking(id, data);
const removeBooking = async (id) => deleteBooking(id);
const getAllBookings = async () => findAllBookings();

module.exports = {
  addBooking,
  getUserBookings,
  editBooking,
  removeBooking,
  getAllBookings,
};
