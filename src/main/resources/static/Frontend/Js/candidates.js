
// ==========================================
// JOBTRACKER - CANDIDATES MANAGEMENT
// ==========================================

const API_BASE_URL = "http://localhost:8080";

// DOM Elements
const candidateForm = document.getElementById("candidateForm");
const candidatesTableBody = document.getElementById("candidatesTableBody");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");

let allCandidates = [];

// ==========================================
// LOAD ALL CANDIDATES
// ==========================================

async function loadCandidates() {
    try {
        candidatesTableBody.innerHTML =
            `<tr><td colspan="6">Loading candidates...</td></tr>`;

        const response = await fetch(`${API_BASE_URL}/candidate/all`);

        if (!response.ok) {
            throw new Error("Unable to load candidates");
        }

        const result = await response.json();

        allCandidates = result.data || [];

        // Preserve the current search
        searchCandidates();

    } catch (error) {
        console.error("Load Candidates Error:", error);

        candidatesTableBody.innerHTML =
            `<tr><td colspan="6">Failed to load candidates. Check console.</td></tr>`;
    }
}

// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// ==========================================
// DISPLAY CANDIDATES
// ==========================================

function displayCandidates(candidates) {

    candidatesTableBody.innerHTML = "";

    if (candidates.length === 0) {
        candidatesTableBody.innerHTML =
            `<tr><td colspan="6">No candidates found.</td></tr>`;
        return;
    }

    candidates.forEach(candidate => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(candidate.id)}</td>

            <td>${escapeHTML(candidate.name)}</td>

            <td>${escapeHTML(candidate.email)}</td>

            <td>${escapeHTML(candidate.phone)}</td>

            <td>${escapeHTML(candidate.skills)}</td>

            <td>
                <button
                    type="button"
                    class="edit-btn"
                    onclick="editCandidate(${Number(candidate.id)})">
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteCandidate(${Number(candidate.id)})">
                    Delete
                </button>
            </td>
        `;

        candidatesTableBody.appendChild(row);
    });
}

// ==========================================
// REGISTER OR UPDATE CANDIDATE
// ==========================================

candidateForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const id = document.getElementById("candidateId").value;

    const candidateData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        skills: document.getElementById("skills").value.trim()
    };

    try {

        const response = await fetch(
            id
                ? `${API_BASE_URL}/candidate/update/${id}`
                : `${API_BASE_URL}/candidate/register`,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(candidateData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.messagecode || result.message || "Candidate operation failed"
            );
        }

        const successMessage = id
            ? "Candidate updated successfully!"
            : "Candidate registered successfully!";

        resetForm();
        showMessage(successMessage, "success");

        await loadCandidates();

    } catch (error) {

        console.error("Save Candidate Error:", error);
        showMessage(error.message, "error");
    }
});

// ==========================================
// EDIT CANDIDATE
// ==========================================

async function editCandidate(id) {

    try {

        const response = await fetch(`${API_BASE_URL}/candidate/${id}`);

        if (!response.ok) {
            throw new Error("Candidate not found");
        }

        const result = await response.json();
        const candidate = result.data;

        if (!candidate) {
            throw new Error("Candidate details not found");
        }

        document.getElementById("candidateId").value = candidate.id;
        document.getElementById("name").value = candidate.name ?? "";
        document.getElementById("email").value = candidate.email ?? "";
        document.getElementById("phone").value = candidate.phone ?? "";
        document.getElementById("skills").value = candidate.skills ?? "";

        document.getElementById("formTitle").textContent =
            "Update Candidate";

        submitBtn.textContent = "Update Candidate";
        cancelBtn.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error("Edit Candidate Error:", error);
        alert(error.message);
    }
}

// ==========================================
// DELETE CANDIDATE
// ==========================================

async function deleteCandidate(id) {

    if (!confirm("Are you sure you want to delete this candidate?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/candidate/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Unable to delete candidate");
        }

        alert("Candidate deleted successfully!");

        await loadCandidates();

    } catch (error) {

        console.error("Delete Candidate Error:", error);
        alert(error.message);
    }
}

// ==========================================
// SEARCH CANDIDATES
// ==========================================

function searchCandidates() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredCandidates = allCandidates.filter(candidate => {

        const name = String(candidate.name ?? "").toLowerCase();
        const email = String(candidate.email ?? "").toLowerCase();

        return name.includes(searchValue) ||
               email.includes(searchValue);
    });

    displayCandidates(filteredCandidates);
}

searchInput.addEventListener("input", searchCandidates);

// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    candidateForm.reset();

    document.getElementById("candidateId").value = "";

    document.getElementById("formTitle").textContent =
        "Register New Candidate";

    submitBtn.textContent = "Register Candidate";

    cancelBtn.hidden = true;
}

// ==========================================
// SUCCESS / ERROR MESSAGE
// ==========================================

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.style.color =
        type === "success" ? "#16a36a" : "#dc3545";
}

// ==========================================
// CANCEL EDIT
// ==========================================

cancelBtn.addEventListener("click", function() {

    resetForm();
    formMessage.textContent = "";
});

// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", loadCandidates);
