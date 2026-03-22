require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

// Initialize DB
require('./app_api/model/db');

const apiRoutes = require('./app_api/routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Static assets (optional, similar to loc8r)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Health
app.get('/healthz', (req, res) => res.json({ ok: true }));

// Root route
app.get('/', (req, res) => res.json({ ok: true, service: 'Anonymous Group Debate API' }));

// 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

module.exports = app;
