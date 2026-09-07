const https = require('https');

const CHANNEL_MAP = {
    // Standard ID mapping
    "1": "/lv/ck/app/rai/tivusat/rai1.php",
    "2": "/lv/ck/app/rai/tivusat/rai2.php",
    "3": "/lv/ck/app/rai/tivusat/rai3.php",
    "4": "/lv/ck/app/mediaset/tivusat/4.php",
    "5": "/lv/ck/app/mediaset/tivusat/5.php",
    "6": "/lv/ck/app/mediaset/tivusat/6.php",
    "8": "/lv/ck/app/sky/tv8.php",
    "9": "/lv/ck/app/discovery/tivusat/nove.php",
    "20": "/lv/ck/app/mediaset/tivusat/20.php",
    "52": "/lv/ck/app/discovery/tivusat/dmax.php",
    "58": "/lv/ck/app/rai/tivusat/raisport.php",
    "60": "/lv/it/sihd.php",
    "64": "/lv/ck/app/tennis.php",
    "100": "/lv/ck/app/rsi/rsila2.php",
    "101": "/lv/ck/app/rsi/rsila1.php",

    // Slug aliases
    "rai1": "/lv/ck/app/rai/tivusat/rai1.php",
    "rai2": "/lv/ck/app/rai/tivusat/rai2.php",
    "rai3": "/lv/ck/app/rai/tivusat/rai3.php",
    "rete4": "/lv/ck/app/mediaset/tivusat/4.php",
    "canale5": "/lv/ck/app/mediaset/tivusat/5.php",
    "italia1": "/lv/ck/app/mediaset/tivusat/6.php",
    "tv8": "/lv/ck/app/sky/tv8.php",
    "nove": "/lv/ck/app/discovery/tivusat/nove.php",
    "dmax": "/lv/ck/app/discovery/tivusat/dmax.php",
    "raisport": "/lv/ck/app/rai/tivusat/raisport.php",
    "sportitalia": "/lv/it/sihd.php",
    "supertennis": "/lv/ck/app/tennis.php",
    "rsila2": "/lv/ck/app/rsi/rsila2.php",
    "rsila1": "/lv/ck/app/rsi/rsila1.php"
};

module.exports = async function handler(req, res) {
    const rawId = req.query.id || req.query.ch || req.query.channel;
    if (!rawId) {
        res.status(400).send("Parametro canale mancante (?id= o ?ch=)");
        return;
    }

    const channelKey = String(rawId).toLowerCase();
    const targetPath = CHANNEL_MAP[channelKey];

    if (!targetPath) {
        res.status(404).send(`Canale '${rawId}' non trovato nel catalogo.`);
        return;
    }

    const targetUrl = `https://juventusonair.com${targetPath}`;

    try {
        const html = await new Promise((resolve, reject) => {
            const clientReq = https.get(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                    'Referer': 'https://juventusonair.com/',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            }, (clientRes) => {
                let chunks = [];
                clientRes.on('data', chunk => chunks.push(chunk));
                clientRes.on('end', () => {
                    const body = Buffer.concat(chunks).toString('utf-8');
                    resolve(body);
                });
            });

            clientReq.on('error', reject);
            clientReq.setTimeout(8000, () => {
                clientReq.destroy(new Error('Timeout richiesta alla sorgente'));
            });
        });

        // Inietta base href per garantire il caricamento di stili e script correlati
        let cleanHtml = html;
        if (!cleanHtml.includes('<base ')) {
            cleanHtml = cleanHtml.replace('<head>', '<head>\n<base href="https://juventusonair.com/">');
        }

        // Rimuove disable-devtool per non bloccare o interferire con la pagina
        cleanHtml = cleanHtml.replace(/<script[^>]*disable-devtool[^>]*>[\s\S]*?<\/script>/gi, '');

        // Rimuove eventuali avvisi adblock intrusivi
        cleanHtml = cleanHtml.replace(/<div id="adblockNotice">[\s\S]*?<\/div>\s*<\/div>/gi, '');

        // Header per consentire il perfetto caricamento nell'iframe
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
        // Rimuove esplicitamente intestazioni di blocco
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');

        res.status(200).send(cleanHtml);
    } catch (err) {
        res.status(502).send(`Errore durante il recupero del canale: ${err.message}`);
    }
};
