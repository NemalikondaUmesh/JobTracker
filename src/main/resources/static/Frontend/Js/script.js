
const API_BASE_URL = "http://localhost:8080";

// =====================================
// UPDATE HTML ELEMENT
// =====================================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

// =====================================
// LOAD DASHBOARD DATA
// =====================================

async function loadDashboard() {

    try {

        const [
            jobsResponse,
            candidatesResponse,
            applicationsResponse
        ] = await Promise.all([

            fetch(`${API_BASE_URL}/job/all`),

            fetch(`${API_BASE_URL}/candidate/all`),

            fetch(`${API_BASE_URL}/job/applications`)

        ]);

        if (
            !jobsResponse.ok ||
            !candidatesResponse.ok ||
            !applicationsResponse.ok
        ) {
            throw new Error("Failed to fetch dashboard data");
        }

        const [
            jobsResult,
            candidatesResult,
            applicationsResult
        ] = await Promise.all([

            jobsResponse.json(),

            candidatesResponse.json(),

            applicationsResponse.json()

        ]);

        const jobs = jobsResult.data || [];

        const candidates = candidatesResult.data || [];

        const applications = applicationsResult.data || [];

        // Main statistics

        setText("totalJobs", jobs.length);

        setText("totalCandidates", candidates.length);

        setText("totalApplications", applications.length);

        // Application status statistics

        const counts = {
            "applied": 0,
            "under review": 0,
            "shortlisted": 0,
            "selected": 0,
            "rejected": 0
        };

        applications.forEach(application => {

            const status = String(application.status || "")
                .trim()
                .toLowerCase();

            if (Object.prototype.hasOwnProperty.call(counts, status)) {
                counts[status]++;
            }

        });

        setText("appliedCount", counts["applied"]);

        setText("reviewCount", counts["under review"]);

        setText("shortlistedCount", counts["shortlisted"]);

        setText("selectedCount", counts["selected"]);

        setText("rejectedCount", counts["rejected"]);

        // Recent applications

        renderRecentApplications(applications);

    }

    catch (error) {

        console.error("Dashboard error:", error);

        setText("totalJobs", "!");

        setText("totalCandidates", "!");

        setText("totalApplications", "!");

        setText("appliedCount", "!");

        setText("reviewCount", "!");

        setText("shortlistedCount", "!");

        setText("selectedCount", "!");

        setText("rejectedCount", "!");

        const tbody = document.getElementById("recentApplicationsBody");

        if (tbody) {

            tbody.innerHTML =
                '<tr><td colspan="4">Unable to load applications.</td></tr>';

        }

    }

}

// =====================================
// DISPLAY RECENT APPLICATIONS
// =====================================

function renderRecentApplications(applications) {

    const tbody = document.getElementById("recentApplicationsBody");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    if (!applications || applications.length === 0) {

        tbody.innerHTML =
            '<tr><td colspan="4">No applications found.</td></tr>';

        return;
    }

    // Display latest five applications

    applications.slice(0, 5).forEach(application => {

        const row = document.createElement("tr");

        const values = [

            application.id ?? "N/A",

            application.candidateName ?? "N/A",

            application.jobTitle ?? "N/A",

            application.status ?? "N/A"

        ];

        values.forEach((value, index) => {

            const cell = document.createElement("td");

            if (index === 3) {

                const badge = document.createElement("span");

                badge.classList.add("status-badge");

                const statusClass = String(value)
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-");

                badge.classList.add(`status-${statusClass}`);

                badge.textContent = value;

                cell.appendChild(badge);

            } else {

                cell.textContent = value;

            }

            row.appendChild(cell);

        });

        tbody.appendChild(row);

    });

}

// =====================================
// DASHBOARD INITIALIZATION
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // Display current date

    const dateElement = document.getElementById("currentDate");

    if (dateElement) {

        dateElement.textContent = new Date().toLocaleDateString("en-IN", {

            day: "numeric",

            month: "short",

            year: "numeric"

        });

    }

    // Refresh dashboard button

    const refreshButton = document.getElementById("refreshDashboardBtn");

    if (refreshButton) {

        refreshButton.addEventListener("click", async () => {

            refreshButton.disabled = true;

            refreshButton.textContent = "Refreshing...";

            try {

                await loadDashboard();

            } finally {

                refreshButton.disabled = false;

                refreshButton.textContent = "↻ Refresh Dashboard";

            }

        });

    }

    // Initial dashboard loading

    loadDashboard();

});
