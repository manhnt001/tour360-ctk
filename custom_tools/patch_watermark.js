const fs = require('fs');
const path = require('path');

function patchWatermark() {
    const file = path.join(__dirname, '../lib/tdvplayer.js');
    if (!fs.existsSync(file)) {
        console.log("Không tìm thấy tdvplayer.js");
        return;
    }
    let content = fs.readFileSync(file, 'utf8');

    const startStr = 'define("tdv/player/view/AcademicWatermark"';
    const endStr = 'define("tdv/view/effects/OffsetEffect"';

    const startIdx = content.indexOf(startStr);
    const endIdx = content.indexOf(endStr);

    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
        console.log("[SKIP] Không tìm thấy AcademicWatermark hoặc đã xử lý xong.");
        return;
    }

    // Kiểm tra xem đã là Dummy mới nhất chưa (snippet giữa hai define rất ngắn và có var N=)
    const snippetBetween = content.substring(startIdx, endIdx);
    if (snippetBetween.includes('var N=function(a){}') && snippetBetween.length < 200) {
        console.log("[SKIP] AcademicWatermark đã vô hiệu hóa (bản mới nhất).");
        return;
    }

    console.log(`Đang patch tdvplayer.js tại vị trí: ${startIdx} → ${endIdx}`);

    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);

    // Dummy hoàn toàn vô hại: trả về class rỗng, không tạo DOM, không setInterval
    const replacement = `define("tdv/player/view/AcademicWatermark",["require"],function(){
var N=function(a){};
N.prototype.update=function(){};
return N;
});\n`;

    content = before + replacement + after;
    fs.writeFileSync(file, content);
    console.log("[OK] Đã vô hiệu hóa AcademicWatermark trong tdvplayer.js thành công!");
}

module.exports = patchWatermark;

if (require.main === module) {
    patchWatermark();
}
