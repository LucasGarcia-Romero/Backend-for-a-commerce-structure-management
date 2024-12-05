const express = require('express');
const fs = require('fs');
const path = require('path');

// Create the global router
const router = express.Router();

// Function to remove file extension from a filename
function removeExtension(name) {
    return name.split('.').shift();
}

// Read all files in the current directory
fs.readdirSync(__dirname).filter((file) => {
    const name = removeExtension(file);
    // Skip the index file and non-JavaScript files
    if (name !== 'index' && path.extname(file) === '.js') {
        try {
            // Dynamically require each route file and use it
            router.use(`/${name}`, require(`./${file}`));
        } catch (err) {
            console.error(`Error loading route file ${file}:`, err);
        }
    }
});

// Export the global router
module.exports = router;
