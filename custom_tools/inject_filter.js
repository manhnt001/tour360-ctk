const fs = require('fs');
const path = require('path');

const filterCode = `
// --- 3DVISTA DYNAMIC FILTER ---
(function() {
    try {
        var match = window.location.pathname.match(/\\/slug\\/([^\\/]+)\\//);
        var slug = match ? match[1] : null;
        if (slug && window.SLUGS_CONFIG && window.SLUGS_CONFIG[slug]) {
            var allowed = window.SLUGS_CONFIG[slug];
            if (typeof script !== 'undefined' && script.definitions) {
                var defs = script.definitions;
                var removedItemIds = {};
                var newDefs = [];
                for (var i = 0; i < defs.length; i++) {
                    var d = defs[i];
                    var keep = true;
                    if (d && d.class === "PanoramaPlayListItem") {
                        var mediaId = d.media ? d.media.replace("this.", "") : "";
                        if (mediaId.indexOf("panorama_") === 0 && allowed.indexOf(mediaId) === -1) {
                            removedItemIds[d.id] = true;
                            keep = false;
                        }
                    }
                    if (keep) newDefs.push(d);
                }
                script.definitions = newDefs;
                for (var i = 0; i < newDefs.length; i++) {
                    var d = newDefs[i];
                    if (d && d.items && d.items.length) {
                        var newItems = [];
                        for (var j = 0; j < d.items.length; j++) {
                            var itemRef = d.items[j];
                            if (typeof itemRef === 'string') {
                                var id = itemRef.replace("this.", "");
                                if (!removedItemIds[id]) newItems.push(itemRef);
                            } else if (itemRef && typeof itemRef === 'object' && itemRef.media) {
                                var mediaId = itemRef.media.replace("this.", "");
                                if (mediaId.indexOf("panorama_") === 0 && allowed.indexOf(mediaId) === -1) {
                                } else newItems.push(itemRef);
                            } else newItems.push(itemRef);
                        }
                        d.items = newItems;
                    }
                    if (d && d.adjacentPanoramas && d.adjacentPanoramas.length) {
                        var newAdj = [];
                        for (var j = 0; j < d.adjacentPanoramas.length; j++) {
                            var adj = d.adjacentPanoramas[j];
                            if (adj && adj.panorama) {
                                var panoId = adj.panorama.replace("this.", "");
                                if (panoId.indexOf("panorama_") === 0 && allowed.indexOf(panoId) === -1) {
                                } else newAdj.push(adj);
                            } else {
                                newAdj.push(adj);
                            }
                        }
                        d.adjacentPanoramas = newAdj;
                    }
                }
            }
        }
    } catch(e) { console.log("Lỗi lọc động:", e); }
})();
// --- END 3DVISTA DYNAMIC FILTER ---
TDV['PlayerAPI']['defineScript'](script);
`;

['script_general.js', 'script_mobile.js'].forEach(file => {
    let p = path.join(__dirname, '..', file);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        
        // Luôn luôn cập nhật: xóa bản cũ nếu có
        if (content.includes('// --- 3DVISTA DYNAMIC FILTER ---')) {
            const regex = /\/\/ --- 3DVISTA DYNAMIC FILTER ---[\s\S]*?\/\/ --- END 3DVISTA DYNAMIC FILTER ---/g;
            content = content.replace(regex, "TDV['PlayerAPI']['defineScript'](script);");
            // Sửa lỗi: Nếu thay thế tạo ra 2 lệnh defineScript thì xóa bớt 1
            content = content.replace("TDV['PlayerAPI']['defineScript'](script);\nTDV['PlayerAPI']['defineScript'](script);", "TDV['PlayerAPI']['defineScript'](script);");
            content = content.replace("TDV['PlayerAPI']['defineScript'](script);\r\nTDV['PlayerAPI']['defineScript'](script);", "TDV['PlayerAPI']['defineScript'](script);");
        }
        
        // Tiêm bản mới
        if (content.includes("TDV['PlayerAPI']['defineScript'](script);")) {
            content = content.replace("TDV['PlayerAPI']['defineScript'](script);", filterCode);
            fs.writeFileSync(p, content);
            console.log(`[OK] Đã tiêm filter MỚI NHẤT vào ${file}`);
        }
    }
});
