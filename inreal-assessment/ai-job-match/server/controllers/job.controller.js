const Job = require('../models/Job');

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create a job
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      skills,
      jobType,
      salary,
      experience,
      applicationLink
    } = req.body;

    // Create job object
    const newJob = new Job({
      title,
      company,
      location,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map(req => req.trim()),
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
      jobType,
      salary,
      experience,
      applicationLink
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      skills,
      jobType,
      salary,
      experience,
      applicationLink,
      isActive
    } = req.body;

    // Build job object
    const jobFields = {};
    if (title) jobFields.title = title;
    if (company) jobFields.company = company;
    if (location) jobFields.location = location;
    if (description) jobFields.description = description;
    if (requirements) {
      jobFields.requirements = Array.isArray(requirements) 
        ? requirements 
        : requirements.split(',').map(req => req.trim());
    }
    if (skills) {
      jobFields.skills = Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(skill => skill.trim());
    }
    if (jobType) jobFields.jobType = jobType;
    if (salary) jobFields.salary = salary;
    if (experience) jobFields.experience = experience;
    if (applicationLink) jobFields.applicationLink = applicationLink;
    if (isActive !== undefined) jobFields.isActive = isActive;

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update
    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: jobFields },
      { new: true }
    );

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.remove();
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
};