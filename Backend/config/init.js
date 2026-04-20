const fs = require('fs');
const path = require('path');

const initStorage = () => {
  const uploadDir = path.join(__dirname, '../uploads/books');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ 'uploads/books' directory initialized");
  }
};

module.exports = initStorage;