const fs = require('fs');
let lines = fs.readFileSync('./slug/gioithieu/script_general_gioithieu.js', 'utf8').split('\n');
let line241 = lines[240]; // 0-indexed
console.log("Length of line 241:", line241.length);
console.log("End of line 241:", line241.substring(line241.length - 200));
