const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
const {
  updateProfile,
  uploadProfilePicture,
  getProfile,
  getAllProfiles,
  getCommunities,
} = require('../controllers/profile');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.put('/', protect, updateProfile);
router.post('/picture', protect, upload.single('image'), uploadProfilePicture);
router.get('/', protect, getProfile);
router.get('/allProfiles', protect, getAllProfiles);
router.post('/getCommunities', protect, getCommunities);
module.exports = router;

