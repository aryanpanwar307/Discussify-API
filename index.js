const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const communityRoutes = require('./routes/community');
const discussionRoutes = require('./routes/discussion');
const resourceRoutes = require('./routes/resource');
const notificationRoutes = require('./routes/notification');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./utilities/errorHandler');
const path = require('path')
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes)

app.use(errorHandler);
// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
