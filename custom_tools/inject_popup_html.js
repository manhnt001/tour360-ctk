const fs = require('fs');
const path = require('path');

function injectPopupHtml() {
    const file = path.join(__dirname, '../index.htm');
    if (!fs.existsSync(file)) {
        console.log("Không tìm thấy index.htm");
        return;
    }
    let content = fs.readFileSync(file, 'utf8');

    const popupCss = `
    /* --- BẮT ĐẦU CUSTOM POPUP CSS --- */
    <style type="text/css">
        /* --- CSS cho Custom Popup --- */
        #custom-audio-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(3px);
            transition: opacity 0.4s ease;
        }

        #custom-audio-popup .popup-content {
            background: #ffffff;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        .popup-logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 20px;
        }

        #custom-audio-popup h2 {
            margin-top: 0;
            color: #8a6d3b; /* Đổi sang màu vàng đồng sang trọng */
            word-break: normal !important;
            overflow-wrap: break-word !important;
            word-wrap: break-word !important;
            white-space: normal !important;
        }

        #custom-audio-popup p {
            color: #666;
            margin-bottom: 25px;
            line-height: 1.5;
            word-break: normal !important;
            overflow-wrap: break-word !important;
            word-wrap: break-word !important;
            white-space: normal !important;
        }

        #btn-enter-tour {
            padding: 14px 28px;
            font-size: 16px;
            font-weight: bold;
            background: #8a6d3b; /* Đổi sang màu vàng đồng sang trọng */
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s, transform 0.1s;
        }

        #btn-enter-tour:hover {
            background: #70582f; /* Màu hover sẫm màu đồng */
        }

        #btn-enter-tour:active {
            transform: scale(0.97);
        }

        /* Ẩn hoàn toàn thẻ div bọc ngoài chứa icon Play mặc định của 3DVista */
        #viewer>div:has(> svg) {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* --- CSS Responsive cho Điện Thoại & Máy Tính Bảng --- */
        @media (max-width: 480px) {
            #custom-audio-popup .popup-content {
                padding: 35px 20px;
            }
            #custom-audio-popup h2 {
                font-size: 20px;
                margin-bottom: 12px;
            }
            #custom-audio-popup p {
                font-size: 14px;
                margin-bottom: 20px;
            }
            #btn-enter-tour {
                padding: 12px 24px;
                font-size: 15px;
                width: 100%;
            }
            .popup-logo {
                max-width: 100px;
                margin-bottom: 15px;
            }
        }

        /* Hỗ trợ chế độ xoay ngang (Landscape) trên điện thoại có chiều cao màn hình nhỏ */
        @media (max-height: 480px) {
            #custom-audio-popup .popup-content {
                padding: 20px;
            }
            .popup-logo {
                max-width: 80px;
                margin-bottom: 10px;
            }
            #custom-audio-popup h2 {
                font-size: 18px;
                margin-bottom: 5px;
            }
            #custom-audio-popup p {
                font-size: 13px;
                margin-bottom: 15px;
            }
            #btn-enter-tour {
                padding: 10px 20px;
                font-size: 14px;
                width: auto;
            }
        }
    </style>
    /* --- KẾT THÚC CUSTOM POPUP CSS --- */`;

    const popupHtml = `
    <!-- Bắt đầu: Custom Audio Popup -->
    <div id="custom-audio-popup">
        <div class="popup-content">
            <img src="logo-popup.png" alt="Logo" class="popup-logo" />
            <h2>Chào mừng đến với Tour tham quan ảo Cục Thống Kê</h2>
            <p>Nhấn nút bên dưới để bắt đầu tham quan và mở âm thanh</p>
            <button id="btn-enter-tour">Vào tham quan</button>
        </div>
    </div>
    <!-- Kết thúc: Custom Audio Popup -->`;

    const popupScript = '\n    <script src="custom_tools/custom_audio_popup.js"></script>\n';

    // 1. Tiêm hoặc cập nhật CSS
    if (content.includes('/* --- BẮT ĐẦU CUSTOM POPUP CSS --- */')) {
        const cssRegex = /\/\* --- BẮT ĐẦU CUSTOM POPUP CSS --- \*\/[\s\S]*?\/\* --- KẾT THÚC CUSTOM POPUP CSS --- \*\//;
        content = content.replace(cssRegex, popupCss.trim());
    } else {
        // Tiêm vào trước thẻ </head>
        content = content.replace('</head>', popupCss + '</head>');
    }

    // 2. Tiêm hoặc cập nhật HTML
    if (content.includes('<!-- Bắt đầu: Custom Audio Popup -->')) {
        const htmlRegex = /<!-- Bắt đầu: Custom Audio Popup -->[\s\S]*?<!-- Kết thúc: Custom Audio Popup -->/;
        content = content.replace(htmlRegex, popupHtml.trim());
    } else {
        // Tiêm vào trước thẻ </body>
        content = content.replace('</body>', popupHtml + '</body>');
    }

    // 3. Tiêm hoặc cập nhật Script Link
    if (!content.includes('src="custom_tools/custom_audio_popup.js"')) {
        content = content.replace('</body>', popupScript + '</body>');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log("[OK] Đã tiêm CSS, HTML và Script Link của Custom Popup vào index.htm gốc!");
}

module.exports = injectPopupHtml;

if (require.main === module) {
    injectPopupHtml();
}
