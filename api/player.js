module.exports = async (req, res) => {
    const channel = (req.query && req.query.channel) || 'SkySportCalcioIT';
    try {
        const response = await fetch(`https://wideiptv.top/player/${encodeURIComponent(channel)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        let html = await response.text();
        
        // Remove the live indicator element completely
        html = html.replace(/<div\s+class=["']live-indicator["']>([\s\S]*?)<\/div>/gi, '');
        
        // Inject CSS rule as extra guarantee to hide any live indicator
        const hideCss = '<style>.live-indicator, .live-dot { display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; pointer-events: none !important; }</style>';
        html = html.replace('</head>', `${hideCss}</head>`);
        
        // Add base href for wideiptv so any relative resource resolves properly
        html = html.replace('<head>', '<head><base href="https://wideiptv.top/">');
        
        // Disable intrusive ad tag scripts
        html = html.replace(/aclib\.runAutoTag\([^)]*\);/gi, '// autoTag disabled');
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        return res.status(200).send(html);
    } catch (err) {
        console.error('Proxy player error:', err);
        return res.redirect(`https://wideiptv.top/player/${encodeURIComponent(channel)}`);
    }
};