const Job = require('../models/jobs');


// View all jobs
async function viewJobs(req, res) {
    try {
        const allJobs = await Job.find(); // Fetch all jobs from MongoDB
        return res.status(200).json(allJobs);
    } catch (error) {
        console.error("Error viewing jobs:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    viewJobs,
  }