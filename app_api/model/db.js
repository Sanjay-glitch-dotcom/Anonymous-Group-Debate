const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anonymous_group_debate';

mongoose.set('strictQuery', true);
mongoose
  .connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

require('./user');
require('./debate');
require('./reply');
require('./vote');
