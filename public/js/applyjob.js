function applyJob(jobId) {
    $('#applyJobModal').modal('show');
    document.getElementById('applyJobModal').setAttribute('data-job-id', jobId);
}

async function submitApplication() {
    const jobId = document.getElementById('applyJobModal').getAttribute('data-job-id');
    const name = document.getElementById('applicantName').value.trim();
    const age = document.getElementById('applicantAge').value;
    const education = document.getElementById('applicantEducation').value.trim();
    const phone = document.getElementById('applicantPhone').value.trim();
    const email = document.getElementById('applicantEmail').value.trim();

    if (!name || !age || !education || !phone || !email) {
        alert('Please fill in all fields.');
        return;
    }

    const applicationData = { name, age, education, phone, email };

    try {
        const response = await fetch(`/apply-job/${jobId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Application submitted successfully!');
            $('#applyJobModal').modal('hide');
        } else {
            alert('Failed to submit application: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        alert('An error occurred while submitting the application.');
    }
}
window.onload = loadJobs;