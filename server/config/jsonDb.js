const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// Ensure data folder exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read database from file
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    return { users: [], tasks: [], activities: [] };
  }
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data || '{"users":[],"tasks":[],"activities":[]}');
    if (!parsed.users) parsed.users = [];
    if (!parsed.tasks) parsed.tasks = [];
    if (!parsed.activities) parsed.activities = [];
    return parsed;
  } catch (e) {
    console.error('Error reading local database file:', e);
    return { users: [], tasks: [], activities: [] };
  }
};

// Write database to file
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing local database file:', e);
  }
};

module.exports = { readDB, writeDB };
