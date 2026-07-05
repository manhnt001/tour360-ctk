const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'slugs_config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const slugDir = path.join(__dirname, '../slug');
if (!fs.existsSync(slugDir)) process.exit(0);

const folders = fs.readdirSync(slugDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

let configKeys = Object.keys(config);

let missingKeys = configKeys.filter(k => !folders.includes(k));
let newFolders = folders.filter(f => !configKeys.includes(f));

let updated = false;

if (missingKeys.length === 1 && newFolders.length === 1) {
    let oldSlug = missingKeys[0];
    let newSlug = newFolders[0];
    console.log(`\n🔄 Phát hiện bạn vừa đổi tên thư mục từ '${oldSlug}' thành '${newSlug}'`);
    config[newSlug] = config[oldSlug];
    delete config[oldSlug];
    updated = true;
    console.log(`✅ Đã đồng bộ cấu hình!`);
} else if (newFolders.length > 0) {
    newFolders.forEach(newSlug => {
        console.log(`\n✨ Phát hiện thư mục mới '${newSlug}', đang thêm vào cấu hình...`);
        config[newSlug] = [];
        updated = true;
    });
}

if (updated) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    console.log(`[THÀNH CÔNG] Đã cập nhật xong slugs_config.json! Đang gọi generate_slugs.js...`);
    require('./generate_slugs.js');
} else {
    console.log("Mọi thứ đã đồng bộ.");
}
