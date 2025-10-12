const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
const {
  createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
  uploadBanner,
  updateCommunity
} = require('../controllers/community');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', protect, createCommunity);
router.post('/:communityId/banner', protect, upload.single('banner'), uploadBanner);
router.get('/', getCommunities);
router.get('/:communityId', getCommunity);
router.post('/:communityId/join', protect, joinCommunity);
router.put('/:communityId', protect, updateCommunity);

module.exports = router;
