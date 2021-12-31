const express = require('express');

const userRoutes = require('./user.routes.js');
const adminRoutes = require('./admin');

const routes = express.Router();

routes.use('/user', userRoutes);
routes.use('/admin', adminRoutes);

routes.use((req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line no-unused-vars
routes.use((err, req, res, next) => {
  res.sendStatus(500);
  console.error(err);
});

module.exports = routes;
