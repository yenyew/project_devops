async function updateJob(jobId) {
    try {
        const response = await fetch(`/view-job/${jobId}`);
        const job = await response.json();

        document.getElementById('jobId').value = job._id;
        document.getElementById('jobName').value = job.name;
        document.getElementById('location').value = job.location;
        document.getElementById('description').value = job.description;
        document.getElementById('salary').value = job.salary;
        document.getElementById('companyEmail').value = job.companyEmail;
        document.getElementById('companyName').value = job.companyName;
        document.getElementById('updateJobModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching job:', error);
    }
}

function closeModal() {
    document.getElementById('updateJobModal').style.display = 'none';
}

async function submitJobUpdate() {
    const jobId = document.getElementById('jobId').value;
    const jobName = document.getElementById('jobName').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const salary = document.getElementById('salary').value;
    const companyEmail = document.getElementById('companyEmail').value.trim();
    const companyName = document.getElementById('companyName').value.trim();

    if (!jobName || !location || !description || !salary || !companyEmail || !companyName) {
        alert("Please fill all fields correctly.");
        return;
    }

    if (!companyEmail.includes('@') || !companyEmail.includes('.') ) {
        alert("Please enter a valid email.");
        return;
    }

    const jobData = { name: jobName, location, description, salary, companyEmail, companyName };

    try {
        const response = await fetch(`/edit-job/${jobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });

        if (response.ok) {
            alert('Job updated successfully!');
            closeModal();
            loadJobs();
        } else {
            alert('Error updating job');
        }
    } catch (error) {
        console.error('Error updating job:', error);
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('updateJobModal');
    if (event.target === modal) {
        closeModal();
    }
}
window.onload = loadJobs;