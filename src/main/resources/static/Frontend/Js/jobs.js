
// API Base URL
const API_BASE_URL = "https://jobtracker-1-h1y6.onrender.com";

// HTML Elements
const jobForm = document.getElementById("jobForm");
const jobsTableBody = document.getElementById("jobsTableBody");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");

// Application elements
const applyModal = document.getElementById("applyModal");
const applyForm = document.getElementById("applyForm");
const applyJobId = document.getElementById("applyJobId");
const applyJobDetails = document.getElementById("applyJobDetails");
const candidateSelect = document.getElementById("candidateSelect");
const applyMessage = document.getElementById("applyMessage");
const applySubmitBtn = document.getElementById("applySubmitBtn");
const closeApplyModal = document.getElementById("closeApplyModal");
const cancelApplyBtn = document.getElementById("cancelApplyBtn");

// Store all jobs
let allJobs = [];

// Load all jobs
async function loadJobs() {
    try {
        jobsTableBody.innerHTML = `
            <tr><td colspan="8">Loading jobs...</td></tr>
        `;

        const response = await fetch(`${API_BASE_URL}/job/all`);

        if (!response.ok) {
            throw new Error("Unable to load jobs");
        }

        const result = await response.json();
        allJobs = result.data || [];

        searchJobs();

    } catch (error) {
        console.error("Load Jobs Error:", error);
        jobsTableBody.innerHTML = `
            <tr><td colspan="8">Failed to load jobs.</td></tr>
        `;
    }
}

// Display jobs
function displayJobs(jobs) {
    jobsTableBody.innerHTML = "";

    if (!jobs || jobs.length === 0) {
        jobsTableBody.innerHTML = `
            <tr><td colspan="8">No jobs found.</td></tr>
        `;
        return;
    }

    jobs.forEach(job => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${job.id}</td>
            <td>${escapeHTML(job.title)}</td>
            <td>${escapeHTML(job.company)}</td>
            <td>${escapeHTML(job.location)}</td>
            <td>${escapeHTML(job.jobType)}</td>
            <td>${escapeHTML(job.salary)}</td>
            <td>${escapeHTML(job.skills)}</td>
            <td>
                <button class="apply-btn"
                    onclick="openApplyModal(${job.id})">
                    Apply
                </button>

                <button class="edit-btn"
                    onclick="editJob(${job.id})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteJob(${job.id})">
                    Delete
                </button>
            </td>
        `;

        jobsTableBody.appendChild(row);
    });
}

// Prevent HTML injection
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Search jobs
function searchJobs() {
    if (!searchInput) return;

    const searchValue = searchInput.value.trim().toLowerCase();

    const filteredJobs = allJobs.filter(job =>
        String(job.title || "").toLowerCase().includes(searchValue) ||
        String(job.company || "").toLowerCase().includes(searchValue) ||
        String(job.location || "").toLowerCase().includes(searchValue)
    );

    displayJobs(filteredJobs);
}

// Add or Update Job
jobForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("jobId").value;

    const jobData = {
        title: document.getElementById("title").value.trim(),
        company: document.getElementById("company").value.trim(),
        location: document.getElementById("location").value.trim(),
        jobType: document.getElementById("jobType").value,
        salary: document.getElementById("salary").value.trim(),
        skills: document.getElementById("skills").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    try {
        const response = await fetch(
            id
                ? `${API_BASE_URL}/job/update/${id}`
                : `${API_BASE_URL}/job/add`,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jobData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.messagecode || "Job operation failed");
        }

        const successMessage = id
            ? "Job updated successfully!"
            : "Job added successfully!";

        resetForm();
        showMessage(successMessage, "success");
        await loadJobs();

    } catch (error) {
        console.error("Save Job Error:", error);
        showMessage(error.message, "error");
    }
});

// Edit Job
async function editJob(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/job/${id}`);

        if (!response.ok) {
            throw new Error("Job not found");
        }

        const result = await response.json();
        const job = result.data;

        document.getElementById("jobId").value = job.id;
        document.getElementById("title").value = job.title;
        document.getElementById("company").value = job.company;
        document.getElementById("location").value = job.location;
        document.getElementById("jobType").value = job.jobType;
        document.getElementById("salary").value = job.salary;
        document.getElementById("skills").value = job.skills;
        document.getElementById("description").value = job.description;

        document.getElementById("formTitle").textContent = "Update Job";
        submitBtn.textContent = "Update Job";
        cancelBtn.hidden = false;
        formMessage.textContent = "";

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        console.error("Edit Job Error:", error);
        alert(error.message);
    }
}

// Delete Job
async function deleteJob(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/job/${id}`,
            { method: "DELETE" }
        );

        const responseText = await response.text();
        let result = {};

        if (responseText) {
            try {
                result = JSON.parse(responseText);
            } catch {
                result = {};
            }
        }

        if (!response.ok) {
            throw new Error(
                result.messagecode ||
                `Unable to delete job. HTTP ${response.status}`
            );
        }

        alert(result.messagecode || "Job deleted successfully!");
        await loadJobs();

    } catch (error) {
        console.error("Delete Job Error:", error);
        alert(error.message);
    }
}

// Open Apply Popup
async function openApplyModal(jobId) {
    const job = allJobs.find(item => Number(item.id) === Number(jobId));

    if (!job) {
        alert("Job details not found.");
        return;
    }

    applyForm.reset();
    applyJobId.value = job.id;
    applyJobDetails.textContent =
        `${job.title} at ${job.company}`;

    applyMessage.textContent = "";
    applyMessage.className = "apply-message";
    applySubmitBtn.disabled = false;
    applySubmitBtn.textContent = "Submit Application";

    applyModal.hidden = false;

    await loadCandidates();
}

// Load candidates into dropdown
async function loadCandidates() {
    candidateSelect.innerHTML =
        '<option value="">Loading candidates...</option>';

    try {
        const response = await fetch(`${API_BASE_URL}/candidate/all`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.messagecode || "Unable to load candidates"
            );
        }

        const candidates = result.data || [];

        candidateSelect.innerHTML =
            '<option value="">Select Candidate</option>';

        if (candidates.length === 0) {
            candidateSelect.innerHTML =
                '<option value="">No candidates available</option>';
            return;
        }

        candidates.forEach(candidate => {
            const option = document.createElement("option");
            option.value = candidate.id;
            option.textContent =
                `${candidate.name} (ID: ${candidate.id})`;

            candidateSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Load Candidates Error:", error);

        candidateSelect.innerHTML =
            '<option value="">Failed to load candidates</option>';

        applyMessage.textContent = error.message;
        applyMessage.className = "apply-message error";
    }
}

// Submit Job Application
applyForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const candidateId = candidateSelect.value;
    const jobId = applyJobId.value;

    if (!candidateId) {
        applyMessage.textContent = "Please select a candidate.";
        applyMessage.className = "apply-message error";
        return;
    }

    const applicationData = {
        candidateId: Number(candidateId),
        jobId: Number(jobId)
    };

    try {
        applySubmitBtn.disabled = true;
        applySubmitBtn.textContent = "Submitting...";

        const response = await fetch(`${API_BASE_URL}/job/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(applicationData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.messagecode || "Application submission failed"
            );
        }

        applyMessage.textContent =
            result.messagecode || "Job application submitted successfully!";

        applyMessage.className = "apply-message success";

        applyForm.reset();
        candidateSelect.disabled = true;
        applySubmitBtn.textContent = "Application Submitted";

    } catch (error) {
        console.error("Apply Job Error:", error);

        applyMessage.textContent = error.message;
        applyMessage.className = "apply-message error";

        applySubmitBtn.disabled = false;
        applySubmitBtn.textContent = "Submit Application";
    }
});

// Close Apply Popup
function closeApplicationPopup() {
    applyModal.hidden = true;
    applyForm.reset();
    candidateSelect.disabled = false;
    applySubmitBtn.disabled = false;
    applySubmitBtn.textContent = "Submit Application";
    applyMessage.textContent = "";
}

closeApplyModal.addEventListener("click", closeApplicationPopup);
cancelApplyBtn.addEventListener("click", closeApplicationPopup);

// Reset Job Form
function resetForm() {
    jobForm.reset();

    document.getElementById("jobId").value = "";
    document.getElementById("formTitle").textContent = "Add New Job";

    submitBtn.textContent = "Add Job";
    cancelBtn.hidden = true;
    formMessage.textContent = "";
}

// Show Success or Error Message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.style.color =
        type === "success" ? "#16a36a" : "#dc3545";
}

// Cancel Edit
cancelBtn.addEventListener("click", resetForm);

// Search Input Listener
if (searchInput) {
    searchInput.addEventListener("input", searchJobs);
}

// Load jobs when page opens
document.addEventListener("DOMContentLoaded", loadJobs);
