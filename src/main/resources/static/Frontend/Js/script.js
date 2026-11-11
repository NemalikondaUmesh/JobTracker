
//const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL =
window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://jobtracker-1-h1y6.onrender.com";

async function fetchData(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`API failed: ${endpoint} (${response.status})`);
    }

    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
}

async function loadDashboard() {
    const refreshBtn = document.getElementById("refreshDashboardBtn");

    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.textContent = "Refreshing...";
    }

    try {
        const [jobs, candidates, applications] = await Promise.all([
            fetchData("/job/all"),
            fetchData("/candidate/all"),
            fetchData("/job/applications")
        ]);

        document.getElementById("totalJobs").textContent = jobs.length;
        document.getElementById("totalCandidates").textContent = candidates.length;
        document.getElementById("totalApplications").textContent = applications.length;

        const counts = {
            applied: 0,
            review: 0,
            shortlisted: 0,
            selected: 0,
            rejected: 0
        };

        applications.forEach(application => {
            const status = String(application.status || "")
                .trim()
                .toLowerCase()
                .replace(/[\s_-]+/g, "");

            if (status === "applied") counts.applied++;
            else if (status === "underreview" || status === "review") counts.review++;
            else if (status === "shortlisted") counts.shortlisted++;
            else if (status === "selected") counts.selected++;
            else if (status === "rejected") counts.rejected++;
        });

        document.getElementById("appliedCount").textContent = counts.applied;
        document.getElementById("reviewCount").textContent = counts.review;
        document.getElementById("shortlistedCount").textContent = counts.shortlisted;
        document.getElementById("selectedCount").textContent = counts.selected;
        document.getElementById("rejectedCount").textContent = counts.rejected;

    } catch (error) {
        console.error("Dashboard API Error:", error);
        alert("Failed to refresh dashboard: " + error.message);

    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = "↻ Refresh Dashboard";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    const refreshBtn = document.getElementById("refreshDashboardBtn");

    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadDashboard);
    }

    loadDashboard();
});
