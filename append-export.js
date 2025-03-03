const fs = require('fs');
const path = require('path');

const filePathJs = path.join(__dirname, 'api/lib/ergometer.js');
const filePathTypes = path.join(__dirname, 'api/lib/ergometer.d.ts');
fs.appendFileSync(filePathJs, '\nexport { ergometer };\n');
fs.appendFileSync(filePathTypes, '\nexport { ergometer };\n');
console.log('Added export to ergometer.js and ergometer.d.ts');