const Job = require('../models/jobs');

async function searchJobs(req, res) {
    try {
        const { keyword, location } = req.query;

        // Build query object
        let query = {};

        if (keyword) {
            query.$or = [
                { name: new RegExp(keyword, 'i') }, // Search by job name
                { companyName: new RegExp(keyword, 'i') } // Search by company name
            ];
        }

        if (location && location !== 'Any Location') {
            query.location = new RegExp(location, 'i'); // Search by location
        }

        // Find jobs based on query
        const jobs = await Job.find(query);
        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Error searching jobs:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    searchJobs
}
