async function addJob() {
    const name = document.getElementById('addJobName').value;
    const location = document.getElementById('addLocation').value;
    const description = document.getElementById('addDescription').value;
    const salary = document.getElementById('addSalary').value;
    const companyEmail = document.getElementById('addCompanyEmail').value;
    const companyName = document.getElementById('addCompanyName').value;

    const jobData = { name, location, description, salary, companyEmail, companyName };

    try {
        const response = await fetch('/add-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Job added successfully!');
            loadJobs();
            clearAndCloseModal();
        } else {
            alert('Failed to add job: ' + result.message);
        }
    } catch (error) {
        alert('An error occurred while adding the job.');
    }
}

function clearAndCloseModal() {
    document.getElementById('addJobName').value = '';
    document.getElementById('addLocation').value = '';
    document.getElementById('addDescription').value = '';
    document.getElementById('addSalary').value = '';
    document.getElementById('addCompanyEmail').value = '';
    document.getElementById('addCompanyName').value = '';
    $('#resourceModal').modal('hide');
}
window.onload = loadJobs;