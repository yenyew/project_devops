const fs = require('fs').promises;
const DB_PATH = './jobs.json';

// View all jobs
async function viewJobs(req, res) {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        const jobs = JSON.parse(data).jobs;
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error viewing jobs:", error);
        res.status(500).json({ message: "Failed to retrieve jobs" });
    }
}

module.exports = {
    viewJobs,
};
