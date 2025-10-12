const express = require('express');
const router = express.Router();
const { protect} = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const {
  deleteResource,
  banUser,
  createCommunity,
  deleteDiscussion
} = require('../controllers/admin');

// Delete inappropriate resource
router.delete('/resources', protect, isAdmin, deleteResource);

// Delete inappropriate discussion
router.delete('/discussions', protect, isAdmin, deleteDiscussion);

// Ban a user
router.post('/ban', protect, isAdmin, banUser);

// Create a new community (admin-only)
router.post('/communities', protect, isAdmin, createCommunity);

module.exports = router;
