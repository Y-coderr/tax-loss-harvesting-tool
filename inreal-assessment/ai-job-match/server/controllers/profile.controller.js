const Profile = require('../models/Profile');
const User = require('../models/User');

// Get current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create or update profile
exports.createProfile = async (req, res) => {
  const {
    location,
    yearsOfExperience,
    skills,
    preferredJobType,
    bio,
    title,
    education,
    experience
  } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    location,
    yearsOfExperience,
    preferredJobType,
    skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
    bio,
    title
  };

  if (education) profileFields.education = education;
  if (experience) profileFields.experience = experience;

  try {
    // Check if profile exists
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'email']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get profile by user ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['name', 'email']);

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete profile & user
exports.deleteProfile = async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ message: 'User and profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};