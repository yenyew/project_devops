const Job = require('../models/jobs');

// Add a new job
async function addJob(req, res) {
    try {
        const { name, location, description, salary, companyEmail, companyName } = req.body;

        // Validate required fields
        if (!name || !location || !description || !salary || !companyEmail || !companyName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (name.length > 100) {
            return res.status(400).json({ message: 'Job name cannot be more than 100 characters' })
        }

        if (name.length < 5) {
            return res.status(400).json({ message: 'Job name cannot be less than 5 characters' })
        }

        // Validate email format
        if (!companyEmail.includes('@') || !companyEmail.includes('.')) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate description length
        if (description.length < 6) {
            return res.status(400).json({ message: 'Description must be at least 6 characters long' });
        }

        if (description.length > 1000) {
            return res.status(400).json({ message: 'Description must be less than 1000 characters long' });
        }

        // Validate salary is a positive number
        if (isNaN(salary) || Number(salary) <= 0) {
            return res.status(400).json({ message: 'Salary must be a positive number' });
        }

        // Limit salary
        if (isNaN(salary) || Number(salary) >= 100000) {
            return res.status(400).json({ message: 'Salary must be less than 100,000' });
        }
        

          //Simulate unexpected server errors for testing
          if (req.body.simulateServerError) {
            throw new Error('Simulated server error');
        }


        // Create and save the new job
        const newJob = new Job({
            name,
            location,
            description,
            salary,
            companyEmail,
            companyName,
        });

        const savedJob = await newJob.save();
        return res.status(201).json(savedJob);
    } catch (error) {
        console.error("Error adding job:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    addJob,
};
