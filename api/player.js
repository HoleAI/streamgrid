module.exports = async (req, res) => {
    // 1. Handle token refresh proxy (POST)
    if (req.query.action === 'refresh' || req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const response = await fetch('https://wideiptv.top/api/refresh_token.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                body: JSON.stringify(body || {})
            });
            const data = await response.json();
            return res.status(200).json(data);
        } catch (e) {
            console.error('Token refresh proxy error:', e);
            return res.status(500).json({ success: false, error: e.message });
        }
    }

    // 2. Handle HTML player proxy (GET)
    const channel = req.query.channel || 'SkySportCalcioIT';
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

        // Remove live indicator element from DOM
        html = html.replace(/<div\s+class=["']live-indicator["']>([\s\S]*?)<\/div>/gi, '');

        // Inject CSS rule as permanent guarantee to hide any live indicator / live dot
        const hideCss = '<style>.live-indicator, .live-dot { display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; pointer-events: none !important; }</style>';
        html = html.replace('</head>', `${hideCss}</head>`);

        // Process script tags safely
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (scriptTag) => {
            // Remove framebuster self==top redirect
            if (scriptTag.includes('self==top')) {
                return '';
            }
            // Remove ad blocker detection & ad scripts
            if (scriptTag.includes('adbpage.com') || scriptTag.includes('id="aclib"')) {
                return '';
            }
            // Neutralize aclib.runAutoTag
            if (scriptTag.includes('aclib.runAutoTag')) {
                return '<script>window.aclib = { runAutoTag: function() {} };</script>';
            }
            // Remove tracking scripts (Histats)
            if (scriptTag.includes('Histats') || scriptTag.includes('histats.com')) {
                return '';
            }
            return scriptTag;
        });

        // Remove noscript tracking
        html = html.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, (noscriptTag) => {
            if (noscriptTag.includes('histats')) return '';
            return noscriptTag;
        });

        // Proxy token refresh requests through our serverless endpoint
        html = html.replace(/https:\/\/wideiptv\.top\/api\/refresh_token\.php/g, '/api/player?action=refresh');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');

        return res.status(200).send(html);
    } catch (err) {
        console.error('Clean player proxy error:', err);
        return res.redirect(`https://wideiptv.top/player/${encodeURIComponent(channel)}`);
    }
};
