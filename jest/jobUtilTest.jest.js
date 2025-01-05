const request = require('supertest');
const { app, server } = require('../index');

let baseUrl;

describe('Job API', () => {
    beforeAll(async () => {
        const { address, port } = server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    afterAll(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    describe('POST /add-job', () => {
        it('should return 400 when required fields are missing', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Test Job',
                    location: 'Test Location',
                    salary: '10000',
                    companyEmail: 'test@gmail.com',
                    // Missing 'description' and 'companyName'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 400 when job name is longer than 100 characters', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
                    location: 'Test Location',
                    description: 'Test Description',
                    salary: '10000',
                    companyEmail: 'test@gmail.com',
                    companyName: 'Test Name',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Job name cannot be more than 100 characters');
        });

        it('should return 400 when job name is less than 5 characters', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Name',
                    location: 'Test Location',
                    description: 'A valid description',
                    salary: '10000',
                    companyEmail: 'test@example.com',
                    companyName: 'Test Company',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Job name cannot be less than 5 characters');
        });

        it('should return 400 for invalid email format', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Test Job',
                    location: 'Test Location',
                    salary: '10000',
                    description: 'Valid description',
                    companyEmail: 'invalid-email',
                    companyName: 'Test Company',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid email format');
        });

        it('should return 400 for description shorter than 6 characters', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Test Job',
                    location: 'Test Location',
                    salary: '10000',
                    description: 'Short',
                    companyEmail: 'test@gmail.com',
                    companyName: 'Test Company',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Description must be at least 6 characters long');
        });

        it('should return 400 for description longer than 1000 characters', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Test Job',
                    location: 'Test Location',
                    salary: '10000',
                    description: 'A'.repeat(1001), // Generates a string with 1001 characters
                    companyEmail: 'test@gmail.com',
                    companyName: 'Test Company',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Description must be less than 1000 characters long');
        });

        it('should return 400 for invalid salary', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Test Job',
                    location: 'Test Location',
                    salary: '-1000', // Negative salary
                    description: 'A valid description',
                    companyEmail: 'test@gmail.com',
                    companyName: 'Test Company',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Salary must be a positive number');
        });

        it('should return 400 for unbelievable salary', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Test Job',
                    location: 'Test Location',
                    salary: '200000',
                    description: 'A valid description',
                    companyEmail: 'test@gmail.com',
                    companyName: 'Test Company',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Salary must be less than 100,000');
        });

        it('should add a new job successfully', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Valid Job',
                    location: 'Valid Location',
                    salary: '10000',
                    description: 'This is a valid description',
                    companyEmail: 'test@example.com',
                    companyName: 'Valid Company',
                });

            expect(response.status).toBe(201);
            expect(response.body).toBeInstanceOf(Object);
        });

        it('should handle server errors gracefully', async () => {
            const response = await request(baseUrl)
                .post('/add-job')
                .send({
                    name: 'Valid Job',
                    location: 'Valid Location',
                    salary: '10000',
                    description: 'This is a valid description',
                    companyEmail: 'test@example.com',
                    companyName: 'Valid Company',
                    simulateServerError: true,
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal Server Error');
        });
    });
});
