const fs = require('fs');

global.window = {};
global.document = { addEventListener: () => {} };
global.TDV = {
    PlayerAPI: {
        defineScript: function(script) {
            console.log("Script definitions count:", script.definitions.length);
            console.log("Script buttonToggleMute:", script.buttonToggleMute);
            
            // Try to find what might cause an error when TDVPlayer parses this
            // Check if any referenced button in buttonToggleMute is missing
            let defsMap = {};
            script.definitions.forEach(d => {
                if (d && d.id) defsMap[d.id] = d;
            });
            
            if (script.buttonToggleMute) {
                script.buttonToggleMute.forEach(b => {
                    let id = b.replace("this.", "");
                    if (!defsMap[id]) console.error("MISSING:", id);
                });
            }
            
            // Check mainPlayList
            let mainPlayList = script.definitions.find(d => d.id === "mainPlayList" || (d.data && d.data.name === "mainPlayList") || d.class === "PlayList");
            if (mainPlayList) {
                console.log("PlayList items:", mainPlayList.items);
                mainPlayList.items.forEach(item => {
                    let id = typeof item === 'string' ? item.replace("this.", "") : "";
                    if (id && !defsMap[id]) console.error("PlayList item missing:", id);
                });
            }
        }
    },
    Script: {},
    Quiz: {}
};

try {
    require('./slug/gioithieu/script_general_gioithieu.js');
} catch(e) {
    console.error("ERROR parsing script:", e);
}
