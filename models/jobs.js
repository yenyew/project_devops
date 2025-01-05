class Jobs {
    constructor(name, location, description, salary, companyEmail, companyName) {
        this.name = this.validateString(name, 'Job name');
        this.location = this.validateString(location, 'Location');
        this.description = this.validateString(description, 'Description');
        this.salary = this.validateNumber(salary, 'Salary');
        this.companyEmail = this.validateEmail(companyEmail);
        this.companyName = this.validateString(companyName, 'Company name');
        this.created_at = new Date(); // Automatically set creation date
        this.updated_at = null; // Set to null initially
    }

    // Helper method to validate string fields
    validateString(value, fieldName) {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            throw new Error(`${fieldName} is required and must be a non-empty string.`);
        }
        return value.trim();
    }

    // Helper method to validate numeric fields
    validateNumber(value, fieldName) {
        if (value === undefined || typeof value !== 'number' || value <= 0) {
            throw new Error(`${fieldName} is required and must be a positive number.`);
        }
        return value;
    }

    // Helper method to validate email format
    validateEmail(email) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!email || !emailRegex.test(email)) {
            throw new Error(`${email} is not a valid email.`);
        }
        return email;
    }

    // Method to update job details
    update(fields) {
        const allowedFields = ['name', 'location', 'description', 'salary', 'companyEmail', 'companyName'];
        Object.keys(fields).forEach((key) => {
            if (allowedFields.includes(key)) {
                if (key === 'companyEmail') {
                    this[key] = this.validateEmail(fields[key]);
                } else if (key === 'salary') {
                    this[key] = this.validateNumber(fields[key], key);
                } else {
                    this[key] = this.validateString(fields[key], key);
                }
            }
        });
        this.updated_at = new Date(); // Update timestamp
    }
}

module.exports = { Jobs }