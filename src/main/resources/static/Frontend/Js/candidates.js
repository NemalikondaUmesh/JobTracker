
// ==========================================
// JOBTRACKER - CANDIDATES MANAGEMENT
// ==========================================

// API BASE URL
const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://jobtracker-1-h1y6.onrender.com";

// ==========================================
// DOM ELEMENTS
// ==========================================

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
            '<tr><td colspan="6">Loading candidates...</td></tr>';

        const response = await fetch(`${API_BASE_URL}/candidate/all`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        console.log("Candidates API Response:", result);

        if (!Array.isArray(result.data)) {
            throw new Error("Invalid candidates API response");
        }

        allCandidates = result.data;

        // Debug: Check the actual candidate data
        console.table(allCandidates);

        searchCandidates();

    } catch (error) {
        console.error("Actual Candidates Loading Error:", error);

        candidatesTableBody.innerHTML = `
            <tr>
                <td colspan="6">${escapeHTML(error.message)}</td>
            </tr>
        `;
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

    if (!candidates || candidates.length === 0) {
        candidatesTableBody.innerHTML = `
            <tr>
                <td colspan="6">No candidates found.</td>
            </tr>
        `;
        return;
    }

    candidates.forEach(candidate => {

        // Debug: Verify Phone and Skills values
        console.log("Candidate:", candidate.name);
        console.log("Phone:", candidate.phone);
        console.log("Skills:", candidate.skills);

        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const emailCell = document.createElement("td");
        const phoneCell = document.createElement("td");
        const skillsCell = document.createElement("td");
        const actionsCell = document.createElement("td");

        // Assign values safely
        idCell.textContent = candidate.id ?? "";
        nameCell.textContent = candidate.name ?? "";
        emailCell.textContent = candidate.email ?? "";
        phoneCell.textContent = candidate.phone ?? "";
        skillsCell.textContent = candidate.skills ?? "";

        // Add action buttons
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            editCandidate(candidate.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteCandidate(candidate.id);
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(skillsCell);
        row.appendChild(actionsCell);

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
                result.message ||
                `Candidate operation failed: HTTP ${response.status}`
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
        const response = await fetch(
            `${API_BASE_URL}/candidate/${id}`
        );

        if (!response.ok) {
            throw new Error(
                `Unable to find candidate. HTTP ${response.status}`
            );
        }

        const result = await response.json();
        const candidate = result.data;

        if (!candidate) {
            throw new Error("Candidate details not found");
        }

        document.getElementById("candidateId").value = candidate.id;

        document.getElementById("name").value =
            candidate.name ?? "";

        document.getElementById("email").value =
            candidate.email ?? "";

        document.getElementById("phone").value =
            candidate.phone ?? "";

        document.getElementById("skills").value =
            candidate.skills ?? "";

        document.getElementById("formTitle").textContent =
            "Update Candidate";

        submitBtn.textContent = "Update Candidate";
        cancelBtn.hidden = false;
        formMessage.textContent = "";

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
    const confirmed = confirm(
        "Are you sure you want to delete this candidate?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/candidate/${id}`,
            {
                method: "DELETE"
            }
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
                `Unable to delete candidate. HTTP ${response.status}`
            );
        }

        alert(
            result.messagecode || "Candidate deleted successfully!"
        );

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
    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const filteredCandidates = allCandidates.filter(candidate => {
        const name = String(candidate.name ?? "").toLowerCase();
        const email = String(candidate.email ?? "").toLowerCase();

        return name.includes(searchValue) ||
               email.includes(searchValue);
    });

    displayCandidates(filteredCandidates);
}

// Search listener
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
