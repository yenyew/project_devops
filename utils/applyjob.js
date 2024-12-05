const Application = require('../models/application');
 
async function applyjob(req, res) {
    try {
        const { jobId } = req.params;
        const { name, age, education, phone, email } = req.body;
 
        if (!phone || phone.length < 6) {
            return res.status(400).json({ message: 'Validation error: phone number must be at least 6 digits' });
        }

        if (age < 18) {
            return res.status(400).json({ message: 'Minimum age is 18 to apply.' });
        }
 
        const newApplication = new Application({
            jobId,
            name,
            age,
            education,
            phone,
            email
        });
 
        const savedApplication = await newApplication.save();
        return res.status(201).json(savedApplication);
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
}
 
module.exports = {
    applyjob
};
 