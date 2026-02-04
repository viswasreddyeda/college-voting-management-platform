const voteBtn = document.getElementById('voteBtn');
const refreshBtn = document.getElementById('refreshBtn');
const resultDisplay = document.getElementById('result');
const resultsList = document.getElementById('resultsList');

// 1. Voting Page Logic
if (voteBtn) {
    voteBtn.addEventListener('click', async () => {
        const selectedCandidate = document.getElementById('candidateSelect').value;
        const voterId = document.getElementById('voterId').value;
// Check if the voter actually picked someone - don't want empty votes!
if (!selectedCandidate) {
    resultDisplay.innerText = "Hey! You forgot to pick a candidate."; 
    return;
}

// Added a 5-second delay so the next student in line has time to step up
setTimeout(() => {
    location.reload(); 
}, 5000);
        if (!voterId || !selectedCandidate) {
            resultDisplay.innerText = "Please provide both ID and Candidate selection.";
            resultDisplay.style.color = "orange";
            return;
        }

        resultDisplay.innerText = "Verifying...";

        try {
            const response = await fetch('http://localhost:5000/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate: selectedCandidate, voterId: voterId })
            });

            const data = await response.json();
            resultDisplay.innerText = data.message;
            
            if (response.ok) {
                resultDisplay.style.color = "green";
                // Reset for next student after 4 seconds
                setTimeout(() => {
                    location.reload(); 
                }, 4000);
            } else {
                resultDisplay.style.color = "red";
            }
        } catch (error) {
            resultDisplay.innerText = "Server is offline. Please call the administrator.";
        }
    });
}

// 2. Admin Page Logic
if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
        const pass = prompt("Enter Admin Password:");
        if (pass !== "admin123") {
            alert("Wrong password!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/results?pass=${pass}`);
            const data = await response.json();
            
            resultsList.innerHTML = `
                <div style="background:#f4f4f4; padding:10px; border-radius:5px;">
                    <p><strong>Alice:</strong> ${data.Alice} votes</p>
                    <p><strong>Bob:</strong> ${data.Bob} votes</p>
                    <p><strong>Charlie:</strong> ${data.Charlie} votes</p>
                </div>
            `;
        } catch (error) {
            alert("Could not fetch results.");
        }
    });
}