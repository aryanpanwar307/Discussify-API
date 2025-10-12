const User = require('../models/User');
const Community = require('../models/Community');

// Update profile
exports.updateProfile = async (req, res) => {
  const { username, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) throw new Error('User not found');

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    ).select('-password');

    if (!user) throw new Error('User not found');

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw new Error('User not found');

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }



};


//Get all users
exports.getAllProfiles = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) throw new Error('Users not found');

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    throw err
    res.status(400).json({ success: false, error: err?.message });
  }
}

//get communities of this profile
exports.getCommunities = async (req, res) => {
  try {
    const { communityIds } = req.body;

    // Validate request body
    if (!communityIds || !Array.isArray(communityIds) || communityIds.length === 0) {
      return res.status(400).json({ error: 'Invalid request: Provide an array of community IDs.' });
    }

    // Fetch communities and populate references
    const communities = await Community.find({ _id: { $in: communityIds } })
    // Return response
    res.status(200).json({ communities });
  } catch (error) {
    throw error
    console.error('Error fetching community details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
