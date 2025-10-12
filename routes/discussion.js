const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createDiscussion,
  getAllDiscussions,
  getDiscussions,
  getDiscussion,
  addComment,
  upvoteDiscussion,
  downvoteDiscussion,
} = require('../controllers/discussion');

router.post('/', protect, createDiscussion);
router.get('/', getAllDiscussions);
router.get('/:discussionId/details', getDiscussion);
router.get('/:communityId', getDiscussions);
// router.get('/:discussionId', getDiscussion);
router.post('/:discussionId/comment', protect, addComment);
router.post('/:discussionId/upvote', protect, upvoteDiscussion);
router.post('/:discussionId/downvote', protect, downvoteDiscussion);

module.exports = router;
