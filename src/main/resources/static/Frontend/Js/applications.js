

//const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL =
window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://jobtracker-1-h1y6.onrender.com";

   

const applicationsTableBody =
    document.getElementById("applicationsTableBody");

const refreshBtn =
    document.getElementById("refreshBtn");

const searchInput =
    document.getElementById("searchInput");

const applicationCount =
    document.getElementById("applicationCount");

const applicationMessage =
    document.getElementById("applicationMessage");

let allApplications = [];

const APPLICATION_STATUSES = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Selected",
    "Rejected"
];

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getCandidateName(application) {
    return String(
        application.candidate?.name ??
        application.candidateName ??
        "N/A"
    );
}

function getJobTitle(application) {
    return String(
        application.job?.title ??
        application.jobTitle ??
        "N/A"
    );
}

function getCompanyName(application) {
    return String(
        application.job?.company ??
        application.company ??
        "N/A"
    );
}

function showMessage(message, type = "success") {
    applicationMessage.textContent = message;
    applicationMessage.className =
        `application-message ${type}`;
    applicationMessage.hidden = false;
}

function clearMessage() {
    applicationMessage.textContent = "";
    applicationMessage.hidden = true;
}

async function readResponse(response) {
    const text = await response.text();

    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

function getErrorMessage(result, fallback) {
    return result.messagecode ||
           result.message ||
           result.error ||
           fallback;
}

async function apiRequest(path, options = {}) {
    const response = await fetch(
        `${API_BASE_URL}${path}`,
        options
    );

    const result = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(
                result,
                `Request failed: HTTP ${response.status}`
            )
        );
    }

    return result;
}

function renderEmpty(message) {
    applicationsTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">
                ${escapeHTML(message)}
            </td>
        </tr>
    `;
}

function getStatusClass(status) {
    switch (String(status).toLowerCase()) {
        case "applied":
            return "status-applied";
        case "under review":
        case "review":
            return "status-review";
        case "shortlisted":
            return "status-shortlisted";
        case "selected":
            return "status-selected";
        case "rejected":
            return "status-rejected";
        default:
            return "";
    }
}

function updateStatusStyle(select) {
    select.classList.remove(
        "status-applied",
        "status-review",
        "status-shortlisted",
        "status-selected",
        "status-rejected"
    );

    const statusClass = getStatusClass(select.value);

    if (statusClass) {
        select.classList.add(statusClass);
    }
}

function displayApplications(applications) {
    applicationsTableBody.innerHTML = "";

    applicationCount.textContent =
        `${applications.length} application${applications.length === 1 ? "" : "s"}`;

    if (applications.length === 0) {
        renderEmpty("No applications found.");
        return;
    }

    applications.forEach(application => {
        const id = Number(application.id);

        if (!Number.isSafeInteger(id)) return;

        const candidateName = getCandidateName(application);
        const jobTitle = getJobTitle(application);
        const companyName = getCompanyName(application);

        const currentStatus =
            String(application.status ?? "Applied");

        const statuses = APPLICATION_STATUSES.includes(currentStatus)
            ? APPLICATION_STATUSES
            : [currentStatus, ...APPLICATION_STATUSES];

        const options = statuses.map(status => `
            <option value="${escapeHTML(status)}"
                ${currentStatus === status ? "selected" : ""}>
                ${escapeHTML(status)}
            </option>
        `).join("");

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${id}</td>

            <td class="candidate-name">
                ${escapeHTML(candidateName)}
            </td>

            <td class="job-title">
                ${escapeHTML(jobTitle)}
            </td>

            <td>${escapeHTML(companyName)}</td>

            <td>
                <select class="status-select">
                    ${options}
                </select>
            </td>

            <td>
                <div class="application-actions">
                    <button type="button" class="update-btn">
                        Update
                    </button>

                    <button type="button" class="delete-btn">
                        Delete
                    </button>
                </div>
            </td>
        `;

        const statusSelect =
            row.querySelector(".status-select");

        const updateBtn =
            row.querySelector(".update-btn");

        const deleteBtn =
            row.querySelector(".delete-btn");

        updateStatusStyle(statusSelect);

        statusSelect.addEventListener("change", () => {
            updateStatusStyle(statusSelect);
        });

        updateBtn.addEventListener("click", () => {
            updateApplicationStatus(
                id,
                statusSelect.value,
                updateBtn
            );
        });

        deleteBtn.addEventListener("click", () => {
            deleteApplication(id, deleteBtn);
        });

        applicationsTableBody.appendChild(row);
    });
}

function searchApplications() {
    const query = searchInput.value
        .toLowerCase()
        .trim();

    const filtered = allApplications.filter(application => {
        const searchableText = [
            application.id,
            getCandidateName(application),
            getJobTitle(application),
            getCompanyName(application),
            application.status ?? "Applied"
        ].join(" ").toLowerCase();

        return searchableText.includes(query);
    });

    displayApplications(filtered);
}

async function loadApplications() {
    refreshBtn.disabled = true;
    refreshBtn.textContent = "Loading...";

    clearMessage();
    renderEmpty("Loading applications...");

    try {
        const result = await apiRequest(
            "/job/applications"
        );

        if (!Array.isArray(result.data)) {
            throw new Error(
                "Invalid API response: expected data array."
            );
        }

        allApplications = result.data;

        searchApplications();

    } catch (error) {
        console.error("Load Applications Error:", error);

        allApplications = [];
        applicationCount.textContent = "0 applications";

        renderEmpty(
            "Failed to load applications."
        );

        showMessage(
            `Unable to load applications: ${error.message}`,
            "error"
        );

    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = "↻ Refresh";
    }
}

async function updateApplicationStatus(id, status, button) {
    button.disabled = true;
    button.textContent = "Saving...";

    clearMessage();

    try {
        const result = await apiRequest(
            `/job/application/status/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        );

        showMessage(
            getErrorMessage(
                result,
                "Application status updated successfully."
            ),
            "success"
        );

        const application = allApplications.find(
            item => Number(item.id) === id
        );

        if (application) {
            application.status = status;
        }

        searchApplications();

    } catch (error) {
        console.error("Update Status Error:", error);

        showMessage(
            `Status update failed: ${error.message}`,
            "error"
        );

        button.disabled = false;
        button.textContent = "Update";
    }
}

async function deleteApplication(id, button) {
    const confirmed = confirm(
        `Are you sure you want to delete application #${id}?`
    );

    if (!confirmed) return;

    button.disabled = true;
    button.textContent = "Deleting...";

    clearMessage();

    try {
        const result = await apiRequest(
            `/job/application/${id}`,
            {
                method: "DELETE"
            }
        );

        allApplications = allApplications.filter(
            application => Number(application.id) !== id
        );

        searchApplications();

        showMessage(
            getErrorMessage(
                result,
                "Application deleted successfully."
            ),
            "success"
        );

    } catch (error) {
        console.error("Delete Application Error:", error);

        showMessage(
            `Delete failed: ${error.message}`,
            "error"
        );

        button.disabled = false;
        button.textContent = "Delete";
    }
}

searchInput.addEventListener(
    "input",
    searchApplications
);

refreshBtn.addEventListener(
    "click",
    loadApplications
);

loadApplications();
