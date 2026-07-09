const fs = require('fs');
const path = require('path');

// 1. Tiêm bộ lọc động vào các file JS gốc
console.log(`[1/5] Kiểm tra và khôi phục bộ lọc động...`);
require('./inject_filter.js');

// 2. Vô hiệu hóa AcademicWatermark và cấu hình xuất Audio Callback trong tdvplayer.js
console.log(`[2/5] Cấu hình tdvplayer.js (AcademicWatermark & Audio Patch)...`);
require('./patch_watermark.js')();
require('./patch_audio.js')();

// 3. Cập nhật danh sách panorama
console.log(`[3/5] Cập nhật danh sách Panorama...`);
require('./update_pano_list.js');

// 3.5. Tự động tiêm HTML/CSS/JS của Custom Popup vào file index.htm gốc
console.log(`[3.5/5] Tự động tiêm Custom Popup vào index.htm...`);
require('./inject_popup_html.js')();

// 4. Tự động nhóm các tour con
console.log(`[4/5] Tự động tạo cấu hình tour con (slugs_config.json)...`);
require('./auto_config.js');

// Đọc cấu hình vừa được tạo
const configPath = path.join(__dirname, 'slugs_config.json');
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

// 5. Tạo file slugs_config.js ở thư mục gốc cho trình duyệt đọc
const jsConfigContent = `window.SLUGS_CONFIG = ${JSON.stringify(slugsConfig, null, 4)};`;
fs.writeFileSync(path.join(__dirname, '../slugs_config.js'), jsConfigContent);
console.log(`[5/5] Đã xuất file slugs_config.js ra thư mục gốc.`);

// Xử lý index.htm gốc và tạo index.html cho từng slug
let indexPath = path.join(__dirname, '../index.htm');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Thêm thẻ base và nhúng script config cho các tour con
let baseHtml = indexHtml.replace(/<head>/i, '<head>\n    <base href="../../">');
baseHtml = baseHtml.replace(/<script src="script\.js/i, '<script src="slugs_config.js?v=' + Date.now() + '"></script>\n    <script src="script.js');

console.log(`\nĐang tạo các thư mục slug...`);
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

console.log("\n[THÀNH CÔNG] Hệ thống đã được tạo tự động 100%!");
