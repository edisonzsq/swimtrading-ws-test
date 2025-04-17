const fs = require('fs');
const path = require('path');

// Configuration
const noOfSymbols = 100; // Number of symbols to grab
const filePath = path.join(__dirname, 'logs', 'option-chain-msft.json'); // Path to the symbols file

function grabUnderlyingSymbols() {
    try {
        // Read and parse the JSON file
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);        
        console.log("data", data);

        // Extract symbols using the specified format
        const symbols = data.data.items.map(item => item['streamer-symbol']);
        console.log("symbols", symbols);

        // Return only the requested number of symbols
        return symbols.slice(0, noOfSymbols);
    } catch (error) {
        console.error('Error reading symbols file:', error.message);
        return [];
    }
}

// Export the function
const results = grabUnderlyingSymbols();
let envVarValue = "";
results.forEach(r => {
    envVarValue += `${r},`;
})

console.log("envVarValue", envVarValue);