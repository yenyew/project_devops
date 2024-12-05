describe('Job Management Frontend', () => {
  let baseUrl;

  before(() => {
    // Start the server and visit the base URL
    cy.task('startServer').then((url) => {
      baseUrl = url;
      cy.visit(baseUrl);
    });
  });

  after(() => {
    // Stop the server after all tests
    return cy.task('stopServer');
  });

  beforeEach(() => {
    // Ensure fresh state before each test
    cy.visit(baseUrl);
  });

  it('should add a new job', () => {
    cy.get('button[data-target="#resourceModal"]').should('be.visible').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');

    // Fill in the form fields
    cy.get('#addJobName').type('Test Job');
    cy.get('#addLocation').type('Test Location');
    cy.get('#addDescription').type('Test Description');
    cy.get('#addSalary').type('10000');
    cy.get('#addCompanyEmail').type('test@example.com');
    cy.get('#addCompanyName').type('Test Company');

    // Submit the form
    cy.get('#resourceModal .btn-primary').click();

    // Ensure the modal closes after submission
    cy.get('#job-listings').contains('Test Job', { timeout: 10000 }).should('exist');
  });

  // Ensure the new job is added
  it('should display the newly added job on reload', () => {
    cy.visit(baseUrl);
    cy.get('#job-listings', { timeout: 10000 }).contains('Test Job').should('exist');
  });
  // Ensure empty form will not add new job
  it('should not allow empty form submission', () => {
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');

    cy.get('#resourceModal .btn-primary').click();
    cy.get('#resourceModal').should('be.visible');
    cy.get('#job-listings').contains('Test Job 1').should('not.exist');
  });

  // Ensure email format has to be correct to add new job
  it('should not allow invalid email format', () => {
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');

    cy.get('#addCompanyEmail').type('invalid-email');
    cy.get('#addJobName').type('Test Job 2');
    cy.get('#addLocation').type('Test Location');
    cy.get('#addDescription').type('Test Description');
    cy.get('#addSalary').type('10000');
    cy.get('#addCompanyName').type('Test Company');

    cy.get('#resourceModal .btn-primary').click();
    cy.get('#resourceModal').should('be.visible');
    cy.get('#job-listings').contains('Test Job 2').should('not.exist');
  });

  // Ensure that negative salary will not add new job
  it('should not allow negative salary', () => {
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');

    cy.get('#addSalary').type('-5000');
    cy.get('#addJobName').type('Test Job 3');
    cy.get('#addLocation').type('Test Location');
    cy.get('#addDescription').type('Test Description');
    cy.get('#addCompanyEmail').type('test@example.com');
    cy.get('#addCompanyName').type('Test Company');

    cy.get('#resourceModal .btn-primary').click();
    cy.get('#resourceModal').should('be.visible');
    cy.get('#job-listings').contains('Test Job 3').should('not.exist');
  });

  // Ensure modal can close without adding job 
  it('should close the modal without adding a job', () => {
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');
    cy.get('#resourceModal .close').click();

    cy.get('#job-listings').contains('Test Job 4').should('not.exist');
  });

  // Ensures duplicate job entries are handled gracefully
  it('should handle duplicate job entries gracefully', () => {
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');

    cy.get('#addJobName').type('Test Job 5');
    cy.get('#addLocation').type('Test Location');
    cy.get('#addDescription').type('Test Description');
    cy.get('#addSalary').type('10000');
    cy.get('#addCompanyEmail').type('test@example.com');
    cy.get('#addCompanyName').type('Test Company');
    cy.get('#resourceModal .btn-primary').click();

    cy.get('#job-listings').contains('Test Job 5', { timeout: 10000 }).should('exist');

    // Try adding the same job again
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#addJobName').type('Test Job 5');
    cy.get('#addLocation').type('Test Location');
    cy.get('#addDescription').type('Test Description');
    cy.get('#addSalary').type('10000');
    cy.get('#addCompanyEmail').type('test@example.com');
    cy.get('#addCompanyName').type('Test Company');
    cy.get('#resourceModal .btn-primary').click();

    cy.get('#job-listings').contains('Test Job 5').should('have.length', 1);
  });

  // Test case: Ensure Required Fields Are Enforced
  it('should enforce required fields for job creation', () => {
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#resourceModal').should('be.visible');

    // Click the submit button without filling the form
    cy.get('#resourceModal .btn-primary').click();

    cy.get('#addJobName').type('New Job');
    cy.get('#addLocation').type(' ');
    cy.get('#addDescription').type(' ');
    cy.get('#addSalary').type(' ');
    cy.get('#addCompanyEmail').type(' ');
    cy.get('#addCompanyName').type(' ');

    // Ensure the modal remains open (form not submitted)
    cy.get('#resourceModal').should('be.visible');
    cy.get('#job-listings').contains('New Job').should('not.exist');
  });

  // Validate Salary Field for Non-Numeric Input
  it('should not allow non-numeric input for the salary field', () => {
    cy.get('button[data-target="#resourceModal"]').click();
    cy.get('#resourceModal').should('be.visible');

    cy.get('#addSalary').type('NotANumber');
    cy.get('#addJobName').type('Invalid Salary Job');
    cy.get('#addLocation').type('Location');
    cy.get('#addDescription').type('Description');
    cy.get('#addCompanyEmail').type('email@example.com');
    cy.get('#addCompanyName').type('Company');

    cy.get('#resourceModal .btn-primary').click();

    cy.get('#resourceModal').should('be.visible');
    cy.get('#job-listings').contains('Invalid Salary Job').should('not.exist');
  });

    // Test case: Simulate a network error
    it('should handle network error by simulating a failed request', () => {
      // Mocking the server response to simulate a network error
      cy.intercept(
        {
          method: 'POST',
          url: '/add-job',
        },
        { forceNetworkError: true }
      ).as('mockedNetworkError');
  
      // Open the modal to add a new job
      cy.get('button[data-target="#resourceModal"]').click();
      cy.get('#resourceModal').should('be.visible');
  
      // Fill in the form fields
      cy.get('#addJobName').type('error error Test Job');
      cy.get('#addLocation').type('Network Error Location');
      cy.get('#addDescription').type('Testing network error handling');
      cy.get('#addSalary').type('4000');
      cy.get('#addCompanyEmail').type('test@example.com');
      cy.get('#addCompanyName').type('Test Company');
  
      // Submit the form
      cy.get('#resourceModal .btn-primary').click();
  
      // Wait for the intercepted request
      cy.wait('@mockedNetworkError');
  
      // Verify error message appears
      cy.on('window:alert', (str) => {
        expect(str).to.equal('An error occurred while adding the job.');
      });
  
      // Ensure the modal remains open
      cy.get('#resourceModal').should('be.visible');
  
      // Ensure the job is not added to the listings
      cy.get('#job-listings').contains('Network Error Test Job').should('not.exist');
    });  
});