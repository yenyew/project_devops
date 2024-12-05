const Job = require('../models/jobs');
 
 
// Get a job by ID
async function getJobById(req, res) {
  try {
      const job = await Job.findById(req.params.id);
      if (job) {
          res.status(200).json(job);
      } else {
          res.status(404).json({ message: 'Job not found' });
      }
  } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: error.message });
  }
}
 
// Edit a job
async function editJob(req, res) {
  try {
      const id = req.params.id;
      const updatedData = req.body;
 
      const updatedJob = await Job.findByIdAndUpdate(id, updatedData, { new: true });
      if (updatedJob) {
          return res.status(200).json(updatedJob);
    
      } else {
          return res.status(404).json({ message: 'Job not found' });
      }
  } catch (error) {
      console.error("Error editing job:", error);
      return res.status(500).json({ message: error.message });
  }
}
 
module.exports = {
  editJob,
  getJobById
};