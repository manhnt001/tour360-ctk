/**
 * update_pano_list.js
 * Tự động trích xuất danh sách tất cả Panorama từ script_general.js
 * và ghi ra danh_sach_pano.txt theo định dạng dễ đọc.
 * 
 * Cách dùng: node custom_tools/update_pano_list.js
 */

const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '../script_general.js');
const outputPath = path.join(__dirname, 'danh_sach_pano.txt');

if (!fs.existsSync(scriptPath)) {
    console.error('Không tìm thấy script_general.js!');
    process.exit(1);
}

const content = fs.readFileSync(scriptPath, 'utf8');

const items = [];
const addedIds = new Set();

// 1. Tìm tất cả các ID panorama trong script_general.js
const panoramaDefRegex = /"id"\s*:\s*"(panorama_[A-F0-9_]+)"/gi;
let match;
while ((match = panoramaDefRegex.exec(content)) !== null) {
    addedIds.add(match[1]);
}

// 2. Tìm tên của các panorama trong thư mục locale (ví dụ: en.txt)
const localeDir = path.join(__dirname, '../locale');
const labelsMap = {};

if (fs.existsSync(localeDir)) {
    const files = fs.readdirSync(localeDir);
    for (const file of files) {
        if (file.endsWith('.txt')) {
            const localeContent = fs.readFileSync(path.join(localeDir, file), 'utf8');
            // Tìm dạng: panorama_XXX.label = YYY
            const labelRegex = /(panorama_[A-F0-9_]+)\.label\s*=\s*(.+)/g;
            let m;
            while ((m = labelRegex.exec(localeContent)) !== null) {
                labelsMap[m[1]] = m[2].trim();
            }
        }
    }
}

// 3. Xây dựng danh sách items
for (const id of addedIds) {
    let name = labelsMap[id] || '(Không có tên)';
    
    // Tạo nhóm dựa vào tên
    let group = 'Khác';
    if (name.startsWith('p1-')) group = 'Nhóm P1';
    else if (name.startsWith('p2-')) group = 'Nhóm P2';
    else if (name.toLowerCase().includes('phòng') || name.toLowerCase().includes('cổng') || name.toLowerCase().includes('nền')) group = 'Khu vực chung';
    else if (name.toLowerCase().includes('giai đoạn')) group = 'Giai đoạn lịch sử';
    
    items.push({ name, panoramaId: id, group });
}

if (items.length === 0) {
    console.error('Không tìm thấy panorama nào trong script_general.js!');
    process.exit(1);
}

// Sắp xếp theo tên nhóm rồi tên
items.sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group);
    
    // Thử sort theo số nếu tên có dạng p1-10, p1-2
    const numA = parseInt(a.name.match(/\d+$/)) || 0;
    const numB = parseInt(b.name.match(/\d+$/)) || 0;
    if (numA && numB) return numA - numB;
    
    return a.name.localeCompare(b.name);
});

// Gom nhóm
const groups = {};
for (const item of items) {
    const g = item.group || '(Không có nhóm)';
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
}

// Xuất ra file
const lines = [];
lines.push('=== DANH SÁCH PANORAMA (CẬP NHẬT TỰ ĐỘNG) ===');
lines.push(`Tổng số: ${items.length} panorama`);
lines.push(`Cập nhật lúc: ${new Date().toLocaleString('vi-VN')}`);
lines.push('');

for (const [groupName, groupItems] of Object.entries(groups)) {
    lines.push(`--- Nhóm: ${groupName} ---`);
    for (const item of groupItems) {
        const namePad = item.name.padEnd(30);
        lines.push(`Tên: ${namePad} | ID: "${item.panoramaId}"`);
    }
    lines.push('');
}

fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`[OK] Đã cập nhật danh_sach_pano.txt với ${items.length} panorama!`);
console.log(`     Vị trí: ${outputPath}`);
