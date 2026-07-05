const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error("Sử dụng: node rename_slug.js <old_slug> <new_slug>");
    process.exit(1);
}

const [oldSlug, newSlug] = args;
const configPath = path.join(__dirname, 'slugs_config.json');

let config = {};
if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

if (!config[oldSlug]) {
    console.error(`Lỗi: Không tìm thấy '${oldSlug}' trong cấu hình!`);
    process.exit(1);
}

// 1. Cập nhật file cấu hình
config[newSlug] = config[oldSlug];
delete config[oldSlug];
fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
console.log(`[1/3] Đã cập nhật cấu hình: đổi '${oldSlug}' thành '${newSlug}'`);

// 2. Đổi tên thư mục slug (sẽ chứa index.html)
let oldDir = path.join(__dirname, '../slug', oldSlug);
let newDir = path.join(__dirname, '../slug', newSlug);

if (fs.existsSync(oldDir)) {
    try {
        fs.renameSync(oldDir, newDir);
        console.log(`[2/3] Đã đổi tên thư mục: slug/${oldSlug} -> slug/${newSlug}`);
    } catch (e) {
        console.error(`  ! Lỗi đổi tên thư mục:`, e.message); 
    }
} else {
    console.log(`[2/3] Bỏ qua: Thư mục slug/${oldSlug} không tồn tại.`);
}

// 3. Chạy lại generate_slugs.js để cập nhật file slugs_config.js cho trình duyệt
console.log(`[3/3] Đang tạo lại các file...`);
require('./generate_slugs.js');

console.log(`\n[THÀNH CÔNG] Đổi tên hoàn tất!`);
