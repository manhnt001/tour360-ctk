/**
 * auto_config.js
 * Tự động tạo slugs_config.json dựa trên danh_sach_pano.txt
 * Bỏ qua các panorama không có tên chính xác (p1-2, p2-6...)
 * Bỏ qua các khu vực chung (Cổng, Phòng truyền thống, Phòng khánh tiết)
 */

const fs = require('fs');
const path = require('path');

const listPath = path.join(__dirname, 'danh_sach_pano.txt');
const configPath = path.join(__dirname, 'slugs_config.json');

if (!fs.existsSync(listPath)) {
    console.error('Không tìm thấy danh_sach_pano.txt!');
    process.exit(1);
}

const text = fs.readFileSync(listPath, 'utf8');
const lines = text.split('\n');
const slugs = {};

for (const line of lines) {
    const match = line.match(/Tên:\s*(.*?)\s*\|\s*ID:\s*"(.*?)"/);
    if (!match) continue;

    let name = match[1];
    let id = match[2];

    // Bỏ qua "(Không có tên)"
    if (name.includes('(Không có tên)')) continue;

    // Bỏ qua các phòng chung độc lập (nhưng giữ lại p1-khanhtiet, p2-khanhtiet)
    const lowerName = name.toLowerCase().trim();
    if (lowerName === 'cổng' || lowerName === 'phòng truyền thống' || lowerName === 'phòng khánh tiết' || lowerName === 'nền') continue;

    // Bỏ qua các panorama chỉ có dạng p1-12, p2-6
    if (/^p[12]-\d+$/.test(name)) continue;

    // Trích xuất tên gốc (bỏ "p1-", "p2-")
    let slugName = name.replace(/^p[12]-/, '');

    // Bỏ các số thứ tự ở cuối (VD: -1, --3) nhưng giữ lại năm (VD: 1946-1954)
    // Các số index cuối thường là 1 chữ số.
    slugName = slugName.replace(/-{1,2}[1-9]$/, '');

    // Chuẩn hóa tên slug
    let slug = slugName.toLowerCase().trim();

    if (!slugs[slug]) slugs[slug] = [];
    slugs[slug].push(id);
}

fs.writeFileSync(configPath, JSON.stringify(slugs, null, 4), 'utf8');
console.log(`[OK] Đã tự động tạo slugs_config.json với ${Object.keys(slugs).length} tour con!`);
