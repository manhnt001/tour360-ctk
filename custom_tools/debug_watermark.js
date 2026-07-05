const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../lib/tdvplayer.js');
const content = fs.readFileSync(file, 'utf8');

// 1. Kiểm tra trạng thái Dummy patch
const patchIdx = content.indexOf('define("tdv/player/view/AcademicWatermark"');
console.log('=== Trạng thái patch AcademicWatermark ===');
console.log('Found at:', patchIdx);
console.log('Content (300 chars):', content.substr(patchIdx, 300));

// 2. Kiểm tra AppInfo - nơi quyết định academic hay không
console.log('\n=== AppInfo flags ===');
const appInfoIdx = content.indexOf('define("tdv/player/AppInfo"');
if (appInfoIdx !== -1) {
    const appInfoStr = content.substr(appInfoIdx, 600);
    console.log(appInfoStr);
    
    // Tìm giá trị cờ heb (academic flag)
    const hebMatch = appInfoStr.match(/h\.heb=([^;]+)/);
    const ymbMatch = appInfoStr.match(/h\.ymb=([^;]+)/);
    console.log('\nheb (academic flag):', hebMatch && hebMatch[1]);
    console.log('ymb flag:', ymbMatch && ymbMatch[1]);
}

// 3. Kiểm tra nơi instantiate AcademicWatermark (new d(this))
console.log('\n=== Player instantiation ===');
const instIdx = content.indexOf('new d(this);this.Dbb');
if (instIdx !== -1) {
    console.log('Found instantiation at:', instIdx);
    console.log(content.substr(instIdx - 50, 150));
}
