require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const isoRoutes = require('./routes/isoRoutes');
const clubRoutes = require('./routes/clubRoutes');
const careerRoutes = require('./routes/careerRoutes');
const authRoutes = require('./routes/authRoutes');
const { seedCategories } = require('./controllers/clubController');  // ✅ add this

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// serve uploaded images and reports
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/reports', express.static(path.join(__dirname, 'reports')));

// auth
app.use('/api/auth', authRoutes);

// routes
app.use('/api/iso', isoRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/career', careerRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(async () => {
    console.log('MongoDB connected');
    await seedCategories();   // ✅ ensures 4 static categories exist
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
