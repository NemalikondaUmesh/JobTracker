
const API_BASE_URL = "http://localhost:8080";

const applicationsTableBody =
    document.getElementById("applicationsTableBody");

const refreshBtn =
    document.getElementById("refreshBtn");

const searchInput =
    document.getElementById("searchInput");

let allApplications = [];

const APPLICATION_STATUSES = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Rejected",
    "Selected"
];

// Get Candidate Name

function getCandidateName(application) {
    return application.candidate?.name
        ?? application.candidateName
        ?? "N/A";
}

// Get Job Title

function getJobTitle(application) {
    return application.job?.title
        ?? application.jobTitle
        ?? "N/A";
}

// Get Company Name

function getCompanyName(application) {
    return application.job?.company
        ?? application.company
        ?? "N/A";
}

// Escape HTML

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Read API Response Safely

async function readResponse(response) {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return { messagecode: text };
    }
}

// Load Applications

async function loadApplications() {

    try {
        applicationsTableBody.innerHTML =
            `<tr><td colspan="6">Loading applications...</td></tr>`;

        const response = await fetch(
            `${API_BASE_URL}/job/applications`
        );

        const result = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                result.messagecode || result.message || "Unable to load applications"
            );
        }

        allApplications = Array.isArray(result.data)
            ? result.data
            : [];

        searchApplications();

    } catch (error) {

        console.error("Load Applications Error:", error);

        applicationsTableBody.innerHTML =
            `<tr><td colspan="6">Failed to load applications. Check console.</td></tr>`;
    }
}

// Display Applications

function displayApplications(applications) {

    applicationsTableBody.innerHTML = "";

    if (applications.length === 0) {

        applicationsTableBody.innerHTML =
            `<tr><td colspan="6">No applications found.</td></tr>`;

        return;
    }

    applications.forEach(application => {

        const candidateName = getCandidateName(application);
        const jobTitle = getJobTitle(application);
        const companyName = getCompanyName(application);

        const currentStatus = application.status ?? "Applied";

        const statusOptions = APPLICATION_STATUSES.map(status => `
            <option value="${escapeHTML(status)}"
                ${currentStatus === status ? "selected" : ""}>
                ${escapeHTML(status)}
            </option>
        `).join("");

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(application.id)}</td>

            <td>${escapeHTML(candidateName)}</td>

            <td>${escapeHTML(jobTitle)}</td>

            <td>${escapeHTML(companyName)}</td>

            <td>
                <select
                    id="status-${Number(application.id)}"
                    class="status-select">
                    ${statusOptions}
                </select>
            </td>

            <td>
                <button
                    type="button"
                    class="update-btn"
                    onclick="updateApplicationStatus(${Number(application.id)})">
                    Update
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteApplication(${Number(application.id)})">
                    Delete
                </button>
            </td>
        `;

        applicationsTableBody.appendChild(row);
    });
}

// Update Application Status

async function updateApplicationStatus(id) {

    const statusElement = document.getElementById(`status-${id}`);

    if (!statusElement) {
        alert("Status field not found.");
        return;
    }

    const status = statusElement.value;

    try {

        const response = await fetch(
            `${API_BASE_URL}/job/application/status/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        const result = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                result.messagecode || result.message || "Unable to update status"
            );
        }

        alert(
            result.messagecode || "Application status updated successfully!"
        );

        await loadApplications();

    } catch (error) {

        console.error("Update Status Error:", error);
        alert(error.message);
    }
}

// Search Applications

function searchApplications() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredApplications = allApplications.filter(application => {

        return (
            getCandidateName(application).toLowerCase().includes(searchValue) ||
            getJobTitle(application).toLowerCase().includes(searchValue) ||
            getCompanyName(application).toLowerCase().includes(searchValue) ||
            String(application.status ?? "").toLowerCase().includes(searchValue) ||
            String(application.id ?? "").includes(searchValue)
        );
    });

    displayApplications(filteredApplications);
}

searchInput.addEventListener("input", searchApplications);

// Delete Application

async function deleteApplication(id) {

    if (!confirm("Are you sure you want to delete this application?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/job/application/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await readResponse(response);

        if (!response.ok) {
            throw new Error(
                result.messagecode || result.message || "Unable to delete application"
            );
        }

        alert(
            result.messagecode || "Application deleted successfully!"
        );

        await loadApplications();

    } catch (error) {

        console.error("Delete Application Error:", error);
        alert(error.message);
    }
}

// Refresh Applications

refreshBtn.addEventListener("click", loadApplications);

// Initial Load

document.addEventListener("DOMContentLoaded", loadApplications);
