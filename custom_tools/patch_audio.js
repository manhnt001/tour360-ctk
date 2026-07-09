const fs = require('fs');
const path = require('path');

function patchAudio() {
    const file = path.join(__dirname, '../lib/tdvplayer.js');
    if (!fs.existsSync(file)) {
        console.log("Không tìm thấy tdvplayer.js");
        return;
    }
    let content = fs.readFileSync(file, 'utf8');

    // 1. Kiểm tra xem đã được patch chưa
    if (content.includes('window.__tdvAudioCallback=this.Ss')) {
        console.log("[SKIP] tdvplayer.js đã được patch kích hoạt audio (bản mới nhất).");
        return;
    }

    // 2. Định nghĩa các mẫu tìm kiếm để thay thế
    // Mẫu 1: Bản gốc từ 3DVista
    const originalRegex = /this\.eg\.get\("mediaActivationMode"\)=="button"\?this\.eg\.hO\.Sjb\(this\.Ss\):this\.eg\.NM\.show\(\w+\("enable-audio-prompt"\),this\.Ss\)/;
    
    // Mẫu 2: Bản vá trung gian nếu có
    const intermediateRegex = /this\.eg\.get\("mediaActivationMode"\)=="button"\?this\.eg\.hO\.Sjb\(this\.Ss\):this\.eg\.hO\.Sjb\(this\.Ss\)/;

    let patched = false;

    if (originalRegex.test(content)) {
        content = content.replace(originalRegex, 'window.__tdvAudioCallback=this.Ss');
        patched = true;
    } else if (intermediateRegex.test(content)) {
        content = content.replace(intermediateRegex, 'window.__tdvAudioCallback=this.Ss');
        patched = true;
    }

    if (patched) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("[OK] Đã cấu hình tdvplayer.js thành công để xuất audio callback ra global!");
    } else {
        console.log("[WARNING] Không tìm thấy đoạn mã kích hoạt audio mặc định trong tdvplayer.js. Có thể file đã được chỉnh sửa khác hoặc phiên bản 3DVista khác.");
    }
}

module.exports = patchAudio;

if (require.main === module) {
    patchAudio();
}
