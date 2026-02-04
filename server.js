const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json()); 

let votes = { Alice: 0, Bob: 0, Charlie: 0 };
let hasVoted = [];
const registeredVoters = ["101", "102", "103", "104", "105"]; 

app.post('/vote', (req, res) => {
    // .trim() removes accidental spaces, .toLowerCase() ignores caps
    const { candidate, voterId } = req.body;
    const cleanId = voterId.trim().toLowerCase();

    if (!registeredVoters.includes(cleanId)) {
        return res.status(403).json({ message: "Error: ID not found in registration list!" });
    }

    if (hasVoted.includes(cleanId)) {
        return res.status(400).json({ message: "Error: This ID has already voted!" });
    }

    if (votes.hasOwnProperty(candidate)) {
        votes[candidate]++;
        hasVoted.push(cleanId); 
        const logEntry = `Roll: ${cleanId} | Voted For: ${candidate} | Time: ${new Date().toLocaleString()}\n`;
        fs.appendFile('secret_votes.txt', logEntry, (err) => {
            if (err) console.log("Log Error:", err);
        });
        res.json({ message: `Success! Vote for ${candidate} recorded.` });
    } else {
        res.status(400).json({ message: "Candidate error." });
    }
});

app.get('/results', (req, res) => {
    if (req.query.pass === 'admin123') {
        res.json(votes);
    } else {
        res.status(403).json({ message: "Unauthorized" });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));