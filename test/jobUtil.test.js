const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;

describe('Job API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

        let resourceId; // Variable to store the ID of the resource

        // Test Suite for adding resources
        describe('POST /add-job', () => {
            it('should return 400 when required fields are missing', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Test Job',
                        location: 'Test Location',
                        salary: '10000',
                        companyEmail: 'test@gmail.com',
                        // Missing 'description' and 'companyName'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'All fields are required');
                        done();
                    });
            });

            it('should return 400 when job name is longer than 100 characters', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
                        location: 'Test Location',
                        description: 'Test Description',
                        salary: '10000',
                        companyEmail: 'test@gmail.com',
                        companyName: 'Test Name'
                        //Job name longer than 100 characters
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'Job name cannot be more than 100 characters');
                        done();
                    });
            });

            it('should return 400 when job name is less than 5 characters', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Name',
                        location: 'Test Location',
                        description: 'A valid description',
                        salary: '10000',
                        companyEmail: 'test@example.com',
                        companyName: 'Test Company',
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'Job name cannot be less than 5 characters');
                        done();
                    });
            });

            it('should return 400 for invalid email format', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Test Job',
                        location: 'Test Location',
                        salary: '10000',
                        description: 'Valid description',
                        companyEmail: 'invalid-email',
                        companyName: 'Test Company',
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'Invalid email format');
                        done();
                    });
            });

            it('should return 400 for description shorter than 6 characters', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Test Job',
                        location: 'Test Location',
                        salary: '10000',
                        description: 'Short',
                        companyEmail: 'test@gmail.com',
                        companyName: 'Test Company',
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'Description must be at least 6 characters long');
                        done();
                    });
            });

            it('should return 400 for description longer than 1000 characters', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Test Job',
                        location: 'Test Location',
                        salary: '10000',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis gravida sem. Nulla pretium ante sit amet enim ornare tincidunt. Mauris non ultrices mi. Suspendisse ornare dolor eu enim vehicula, viverra euismod nulla imperdiet. Quisque erat est, vulputate vitae nisl sed, condimentum efficitur nisi. Praesent pellentesque ligula sed tellus accumsan, a hendrerit tellus fringilla. Mauris laoreet pellentesque diam quis porttitor. Mauris tincidunt nisl eget orci viverra, sit amet molestie eros varius. Praesent a blandit enim. Morbi et tincidunt velit. Morbi tempor augue in metus rutrum sagittis. Integer egestas blandit leo volutpat dignissim. Suspendisse pulvinar elit tortor, et scelerisque lectus mollis quis.Suspendisse sed tincidunt dolor. Etiam consequat egestas vulputate. Nulla tempus tortor eget risus convallis, sit amet congue neque consequat.Integer euismod sem id magna vulputate, maximus laoreet justo viverra. Vestibulum convallis ante quam, ut auctor ipsum consequat quis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam et leo semper ex elementum elementum. Nam in augue et orci lobortis maximus.',
                        companyEmail: 'test@gmail.com',
                        companyName: 'Test Company',
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'Description must be less than 1000 characters long');
                        done();
                    });
            });

            it('should return 400 for invalid salary', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Test Job',
                        location: 'Test Location',
                        salary: '-1000', // Negative salary
                        description: 'A valid description',
                        companyEmail: 'test@gmail.com',
                        companyName: 'Test Company',
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'Salary must be a positive number');
                        done();
                    });
            });

            it('should return 400 for unbelievable salary', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Test Job',
                        location: 'Test Location',
                        salary: '200000',
                        description: 'A valid description',
                        companyEmail: 'test@gmail.com',
                        companyName: 'Test Company',
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'Salary must be less than 100,000');
                        done();
                    });
            });

            it('should add a new job successfully', (done) => {
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Valid Job',
                        location: 'Valid Location',
                        salary: '10000',
                        description: 'This is a valid description',
                        companyEmail: 'test@example.com',
                        companyName: 'Valid Company',
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('_id'); // Assuming MongoDB generates an `_id`
                        done();
                    });
            });

            it('should handle server errors gracefully', (done) => {
                // Simulate a server error by sending invalid data that could cause a failure
                chai.request(baseUrl)
                    .post('/add-job')
                    .send({
                        name: 'Valid Job',
                        location: 'Valid Location',
                        salary: '10000',
                        description: 'This is a valid description',
                        companyEmail: 'test@example.com',
                        companyName: 'Valid Company',
                        simulateServerError: true
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(500);
                        expect(res.body).to.have.property('message', 'Internal Server Error');
                        done();
                    });
            });
        });
        
    });