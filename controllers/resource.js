const fs = require('fs');
const path = require('path');
const Resource = require('../models/Resource');
const Community = require('../models/Community');

// Share a resource
exports.shareResource = async (req, res) => {
  const { title, type, link, communityId, tags } = req.body;
  try {
    const community = await Community.findById(communityId);
    if (!community) throw new Error('Community not found');

    if(!link && !req.file){
      throw new Error('Either link or a file must be provided')
    }
    const resource = await Resource.create({
      title,
      type,
      link,
      file: req.file ? req.file.path:'',
      sharedBy: req.user.id,
      community: communityId,
      tags,
    });

    community.resources.push(resource._id);
    await community.save();

    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

//get all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json({ success: true, data: resources });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all resources in a community
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ community: req.params.communityId })
      .populate('sharedBy', 'username');
    res.status(200).json({ success: true, data: resources });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get a specific resource
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId)
      // .populate('sharedBy', 'title');
    if (!resource) throw new Error('Resource not found');
    res.status(200).json({ success: true, data: resource });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) throw new Error('Resource not found');

    // Check if the user is the owner of the resource
    if (resource.sharedBy.toString() !== req.user.id) {
      throw new Error('Not authorized to delete this resource');
    }

    await resource.remove();
    res.status(200).json({ success: true, message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// Download a resource file
exports.downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) throw new Error('Resource not found');

    // Check if the resource has a file
    if (!resource.file) throw new Error('No file available for this resource');

    // Check if the user is a member of the community
    const community = await Community.findById(resource.community);
    if (!community.members.includes(req.user.id)) {
      throw new Error('Not authorized to download this resource');
    }

    // Construct the file path
    const filePath = path.join(__dirname, '..', resource.file);

    // Check if the file exists
    if (!fs.existsSync(filePath)) throw new Error('File not found');

    // Serve the file for download
    res.download(filePath, (err) => {
      if (err) throw new Error('Failed to download file');
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
