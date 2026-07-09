document.addEventListener('DOMContentLoaded', function () {
    var customPopup = document.getElementById('custom-audio-popup');
    var btnEnter = document.getElementById('btn-enter-tour');

    if (!customPopup || !btnEnter) return;

    // Đảm bảo popup luôn hiển thị ở trạng thái ban đầu
    customPopup.style.setProperty('display', 'flex', 'important');

    // --- CẤU HÌNH NỘI DUNG POPUP CHO TỪNG TOUR CON (SLUG) ---
    // Sử dụng ký tự   (non-breaking space) để tránh ngắt dòng làm bẻ đôi cụm từ ghép tiếng Việt
    var SLUG_INFO = {
        "cocautochuc": {
            title: "Cơ cấu Tổ chức",
            desc: "Nhấn nút để tìm hiểu về sơ đồ Cơ cấu Tổ chức của Cục Thống kê."
        },
        "khanhtiet": {
            title: "Phòng Khánh Tiết",
            desc: "Nhấn nút để bắt đầu tham quan Phòng Khánh Tiết ."
        },
        "phongtruyenthong": {
            title: "Phòng Truyền Thống",
            desc: "Nhấn nút để tham quan Phòng Truyền Thống."
        },
        "phongkhanhtiet": {
            title: "Phòng Khánh Tiết",
            desc: "Nhấn nút để tham quan Phòng Khánh Tiết."
        },
        "phanthuongcaoquy": {
            title: "Phần thưởng Cao quý",
            desc: "Nhấn nút để tham quan khu trưng bày các Phần thưởng Cao quý ."
        },
        "suquantamlanhdao": {
            title: "Sự Quan tâm Của Lãnh đạo",
            desc: "Nhấn nút để xem các tư liệu về Sự Quan Tâm của Lãnh Đạo."
        },
        "hoinhapquocte": {
            title: "Hội nhập Quốc tế",
            desc: "Nhấn nút để tham quan không gian Hội nhập Quốc tế "
        },
        "tongcucphocuc": {
            title: "Lãnh đạo Tổng cục qua các giai đoạn",
            desc: "Nhấn nút để tham quan phòng truyền thống Lãnh đạo Tổng cục qua các giai đoạn."
        },
        "2021-nay": {
            title: " Giai đoạn 2021 - Nay",
            desc: "Nhấn nút để tìm hiểu về các thành tựu của Cục Thống Kê giai đoạn 2021 đến nay."
        },
        "2007-2020": {
            title: " Giai đoạn 2007 - 2020",
            desc: "Nhấn nút để xem tư liệu lịch sử giai đoạn 2007 - 2020."
        },
        "1994-2006": {
            title: " Giai đoạn 1994 - 2006",
            desc: "Nhấn nút để xem tư liệu lịch sử giai đoạn 1994 - 2006."
        },
        "1987-1993": {
            title: " Giai đoạn 1987 - 1993",
            desc: "Nhấn nút để xem tư liệu lịch sử giai đoạn 1987 - 1993."
        },
        "1975-1986": {
            title: " Giai đoạn 1975 - 1986",
            desc: "Nhấn nút để xem tư liệu lịch sử giai đoạn 1975 - 1986."
        },
        "1955-1975": {
            title: " Giai đoạn 1955 - 1975",
            desc: "Nhấn nút để xem tư liệu lịch sử giai đoạn 1955 - 1975."
        },
        "1946-1954": {
            title: " Giai đoạn 1946 - 1954",
            desc: "Nhấn nút để xem tư liệu lịch sử giai đoạn 1946 - 1954."
        }
    };

    // Tự động phân tích tên slug từ URL
    var match = window.location.pathname.match(/\/slug\/([^\/]+)\//);
    var slugName = match ? match[1] : null;

    // Nếu slugName có trong cấu hình, tiến hành thay thế tiêu đề và mô tả của popup
    if (slugName && SLUG_INFO[slugName]) {
        var titleEl = customPopup.querySelector('h2');
        var descEl = customPopup.querySelector('p');
        if (titleEl) titleEl.textContent = SLUG_INFO[slugName].title;
        if (descEl) descEl.textContent = SLUG_INFO[slugName].desc;
    }

    // 1. Quản lý trạng thái click của custom popup và callback kích hoạt audio của 3DVista
    window.__customPopupClicked = false;
    window.___tdvAudioCallbackVal = null;

    Object.defineProperty(window, '__tdvAudioCallback', {
        set: function (callback) {
            window.___tdvAudioCallbackVal = callback;
            console.log('[Audio API] 3DVista registered audio callback.');

            // Nếu user đã click "Vào tham quan" từ trước, kích hoạt âm thanh ngay lập tức
            if (window.__customPopupClicked && typeof callback === 'function') {
                console.log('[Audio API] Custom popup was already clicked. Triggering audio callback now.');
                callback();
            }
        },
        get: function () {
            return window.___tdvAudioCallbackVal;
        },
        configurable: true
    });

    // 2. Xử lý khi user click vào nút của chúng ta
    btnEnter.addEventListener('click', function () {
        console.log('[Audio API] Custom popup clicked.');
        window.__customPopupClicked = true;

        // Ẩn custom popup
        customPopup.style.opacity = '0';
        setTimeout(function () {
            customPopup.style.display = 'none';
        }, 400);

        // Nếu 3DVista đã tải xong và đã đăng ký callback -> kích hoạt luôn
        if (typeof window.__tdvAudioCallback === 'function') {
            console.log('[Audio API] Triggering audio callback immediately on click.');
            window.__tdvAudioCallback();
        } else {
            console.log('[Audio API] 3DVista audio callback not registered yet. Waiting for it...');
        }
    });
});
