describe('Job Management Frontend', () => {
  let baseUrl;

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url;
      cy.visit(baseUrl);
    });
  });

  after(() => {
    return cy.task('stopServer');
  });

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('should add a new job', () => {
    cy.get('#openAddJobModal').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');

    cy.get('#addJobName').type('Test Job');
    cy.get('#addLocation').type('Test Location');
    cy.get('#addDescription').type('Test Description');
    cy.get('#addSalary').type('10000');
    cy.get('#addCompanyEmail').type('test@example.com');
    cy.get('#addCompanyName').type('Test Company');

    cy.get('#resourceModal .btn-primary').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Job added successfully!');
    });
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
    cy.get('#openAddJobModal').click();
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
    cy.get('#openAddJobModal').click();
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
    cy.get('#openAddJobModal').click();
    cy.get('#resourceModal').should('be.visible').and('have.class', 'show');
    cy.get('#resourceModal .close').click();


    cy.get('#job-listings').contains('Test Job 4').should('not.exist');
  });

   // Test case: Ensure Required Fields Are Enforced
   it('should enforce required fields for job creation', () => {
    cy.get('#openAddJobModal').click();
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
    cy.get('#openAddJobModal').click();
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

  it('should handle network error by simulating a failed request', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/add-job',
      },
      { forceNetworkError: true }
    ).as('mockedNetworkError');

    cy.get('#openAddJobModal').click();
    cy.get('#resourceModal').should('be.visible');

    cy.get('#addJobName').type('Network Error Job');
    cy.get('#addLocation').type('Location');
    cy.get('#addDescription').type('Description');
    cy.get('#addSalary').type('4000');
    cy.get('#addCompanyEmail').type('test@example.com');
    cy.get('#addCompanyName').type('Company');

    cy.get('#resourceModal .btn-primary').click();

    cy.wait('@mockedNetworkError');

    cy.on('window:alert', (str) => {
      expect(str).to.equal('An error occurred while adding the job.');
    });

    cy.get('#resourceModal').should('be.visible');
  });
});
