async function loadJobs() {
    try {
        const response = await fetch('/view-jobs');
        const jobs = await response.json();
        displayJobs(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

async function searchJobs() {
    const keyword = document.getElementById("keyword").value;
    const classification = document.getElementById("classification").value;
    const query = new URLSearchParams({ keyword, classification }).toString();

    try {
        const response = await fetch(`/search-jobs?${query}`, { method: "GET" });
        if (response.ok) {
            const jobs = await response.json();
            displayJobs(jobs);
        } else {
            alert("Error searching jobs");
        }
    } catch (error) {
        console.error("Error searching jobs:", error);
    }
}

function displayJobs(jobs) {
    const jobListings = document.getElementById('job-listings');
    jobListings.innerHTML = '';
    if (jobs.length === 0) {
        jobListings.innerHTML = '<p>No job listings found.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-listing');
        jobCard.innerHTML = `
            <div class="job-header">
                <h2>${job.name}</h2>
                <div class="job-actions">
                    <button onclick="applyJob('${job._id}')">Apply Job</button>
                    <button onclick="updateJob('${job._id}')">Update Job Listing</button>
                </div>
            </div>
            <p class="location">Location: ${job.location}</p>
            <p class="company">Company: ${job.companyName}</p>
            <p class="salary">Salary: $${job.salary}</p>
            <p class="email">Contact: <a href="mailto:${job.companyEmail}">${job.companyEmail}</a></p>
            <p>${job.description}</p>
        `;
        jobListings.appendChild(jobCard);
    });
}
window.onload = loadJobs;