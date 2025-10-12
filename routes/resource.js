const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
const {
  shareResource,
  getResources,
  getAllResources,
  getResource,
  deleteResource,
  downloadResource
} = require('../controllers/resource');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', protect,upload.single('file'), shareResource);
router.get('/:communityId', getResources);
router.get('/', getAllResources);
router.get('/:resourceId', getResource);
router.delete('/:resourceId', protect, deleteResource);
router.get('/:resourceId/download',protect, downloadResource);


module.exports = router;
