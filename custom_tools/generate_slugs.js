const fs = require('fs');
const path = require('path');

// Đường dẫn file cấu hình
const configPath = path.join(__dirname, 'slugs_config.json');

// Đọc cấu hình
let slugsConfig = {};
try {
    if (fs.existsSync(configPath)) {
        slugsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
        console.error(`Không tìm thấy file cấu hình: ${configPath}`);
        process.exit(1);
    }
} catch (e) {
    console.error("Lỗi đọc file cấu hình slugs_config.json:", e);
    process.exit(1);
}

// 1. Tiêm bộ lọc động vào các file JS gốc (đề phòng trường hợp 3DVista vừa ghi đè)
console.log(`[0/2] Kiểm tra và khôi phục bộ lọc động...`);
require('./inject_filter.js');

// 2. Tạo file slugs_config.js ở thư mục gốc cho trình duyệt đọc
const jsConfigContent = `window.SLUGS_CONFIG = ${JSON.stringify(slugsConfig, null, 4)};`;
fs.writeFileSync(path.join(__dirname, '../slugs_config.js'), jsConfigContent);
console.log(`[1/2] Đã tạo file cấu hình slugs_config.js ở thư mục gốc.`);

// 3. Tạo thư mục và index.html cho từng slug
let indexHtml = fs.readFileSync(path.join(__dirname, '../index.htm'), 'utf8');

// Thêm thẻ base và nhúng script config
let baseHtml = indexHtml.replace(/<head>/i, '<head>\n    <base href="../../">');
baseHtml = baseHtml.replace(/<script src="script\.js/i, '<script src="slugs_config.js?v=' + Date.now() + '"></script>\n    <script src="script.js');

for (const slug of Object.keys(slugsConfig)) {
    console.log(`Đang xử lý slug: ${slug}`);

    // Tạo/đảm bảo thư mục slug/tên_slug/ tồn tại trước
    let slugDir = path.join(__dirname, '../slug', slug);
    if (!fs.existsSync(slugDir)) {
        fs.mkdirSync(slugDir, { recursive: true });
    }

    // Lưu vào thư mục slug/tên_slug/index.html
    fs.writeFileSync(path.join(slugDir, 'index.html'), baseHtml);
    console.log(`  - Đã tạo: slug/${slug}/index.html`);
}

console.log("\n[THÀNH CÔNG] Hệ thống đã được tạo gọn gàng bằng Dynamic Filtering!");
