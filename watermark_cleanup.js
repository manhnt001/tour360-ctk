(function() {
    function isLikelyWatermarkElement(el) {
        if (!el || el.nodeType !== 1) return false;
        var className = (el.className || '').toLowerCase();
        var id = (el.id || '').toLowerCase();
        var style = (el.getAttribute('style') || '').toLowerCase();
        var src = (el.getAttribute('src') || '').toLowerCase();
        var alt = (el.getAttribute('alt') || '').toLowerCase();
        var text = (el.textContent || '').toLowerCase();
        var isOverlayLike = /position\s*:\s*(absolute|fixed)|z-index|pointer-events/.test(style);
        var hasWatermarkKeywords = /3dvista|academic|watermark|branding|brand|logo/.test(text) ||
            /3dvista|academic|watermark|branding|brand|logo/.test(className) ||
            /3dvista|academic|watermark|branding|brand|logo/.test(id) ||
            /3dvista|academic|watermark|branding|brand|logo/.test(src) ||
            /3dvista|academic|watermark|branding|brand|logo/.test(alt);
        var tagName = (el.tagName || '').toLowerCase();
        return hasWatermarkKeywords && (isOverlayLike || tagName === 'img' || tagName === 'svg' || tagName === 'canvas');
    }

    function removeWatermarkOverlay() {
        if (!document || !document.body) return;
        var elements = Array.from(document.querySelectorAll('div,span,svg,img,canvas'));
        for (var i = 0; i < elements.length; ++i) {
            var el = elements[i];
            if (isLikelyWatermarkElement(el)) {
                try {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                } catch (e) {}
            }
        }
    }

    function scheduleCleanup() {
        removeWatermarkOverlay();
        setTimeout(removeWatermarkOverlay, 250);
        setTimeout(removeWatermarkOverlay, 1000);
        setTimeout(removeWatermarkOverlay, 3000);
        setTimeout(removeWatermarkOverlay, 8000);
    }

    window.removeWatermarkOverlay = removeWatermarkOverlay;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleCleanup, { once: true });
    } else {
        scheduleCleanup();
    }

    if (window.MutationObserver) {
        try {
            var observer = new MutationObserver(function() {
                scheduleCleanup();
            });
            observer.observe(document.documentElement || document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class', 'src', 'id', 'alt']
            });
        } catch (e) {}
    }

    window.addEventListener('load', scheduleCleanup);
})();