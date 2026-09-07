const https = require('https');

const CHANNELS = {
    "1": {
        name: "Rai 1 HD",
        type: "dash",
        mpd: "https://wp8-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09101/stb-dash-fhd-avc/SV09101.mpd",
        keyPath: "/lv/ck/app/rai/tivusat/keys.php?id=rai1",
        fallbackKeys: {"7f9f6e3c78b2486f9fe13e06bdb768d2":"b341c1136a3738f3a6ea197d31fab35c"}
    },
    "2": {
        name: "Rai 2 HD",
        type: "dash",
        mpd: "https://wp4-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09103/stb-dash-fhd-avc/SV09103.mpd",
        keyPath: "/lv/ck/app/rai/tivusat/keys.php?id=rai2",
        fallbackKeys: {"8398533768ae49be862f458edc78f828":"609273c26c31a4090310e3945c0db5df","6f16152947933e2cb7528879052591a9":"ad6291569772bb7d8c89fb2565fe4115"}
    },
    "3": {
        name: "Rai 3 HD",
        type: "dash",
        mpd: "https://wp5-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09104/stb-dash-fhd-avc/SV09104.mpd",
        keyPath: "/lv/ck/app/rai/tivusat/keys.php?id=rai3",
        fallbackKeys: {"f339a37813f742708d143656dd5f5323":"17a9a13e3fbfe1d9cad739c21c89d3fc","77bc9ce3b0cc3ce7b01f6656b25544a7":"26f89b9a32e2658af840743b81654c2d"}
    },
    "4": {
        name: "Rete 4",
        type: "dash",
        mpd: "https://wp7-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09242/stb-dash-fhd-avc/SV09242.mpd",
        keyPath: "/lv/ck/app/mediaset/tivusat/keys.php?id=4",
        fallbackKeys: {"2dc20e5397e54016999b9ca4fc6fbb74":"05c9cbdaeaed4f7ff6f0db978c6aafe9","502829a618a940febb19235cda341401":"f1e1f9084914394c588c387bd58d638f","5caf7e4e45394ef4bb88ff7e00f920bd":"f4b70ee5a405f862189e415462d27b54"}
    },
    "5": {
        name: "Canale 5",
        type: "dash",
        mpd: "https://wp10-s-anp33343334-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09241/stb-dash-fhd-avc/SV09241.mpd",
        keyPath: "/lv/ck/app/mediaset/tivusat/keys.php?id=5",
        fallbackKeys: {"66425e277179392bbcf9292897eb6ffe":"735119fd1907a0e60adeac2c0469cf0b"}
    },
    "6": {
        name: "Italia 1",
        type: "dash",
        mpd: "https://wp8-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09108/stb-dash-hdready-avc/SV09108.mpd",
        keyPath: "/lv/ck/app/mediaset/tivusat/keys.php?id=6",
        fallbackKeys: {"3661c4a98c3640dbbdbbdaa5c429fb85":"e143b3ff4b365b7d9a68494b18e0f473"}
    },
    "7": {
        name: "LA7",
        type: "hls",
        stream: "https://d1chghleocc9sm.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-evfku205gqrtf/Live.m3u8"
    },
    "8": {
        name: "TV8",
        type: "dash",
        mpd: "https://wp5-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09318/stb-dash-fhd-avc/SV09318.mpd",
        keyPath: "/lv/ck/app/sky/keys.php?id=tv8",
        fallbackKeys: {"3bf1cd65e85c4f6ab2f2ee9ac8403b9b":"9142f7e62d011a8793e9b15ed36d7b7f","f867332c642e3d7497970d55f0334c3b":"6111dda68d5eb9e29ef5fab147e31149"}
    },
    "9": {
        name: "Nove",
        type: "dash",
        mpd: "https://wp8-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09472/stb-dash-fhd-avc/SV09472.mpd",
        keyPath: "/lv/ck/app/discovery/tivusat/keys.php?id=nove",
        fallbackKeys: {"e0e63271f18f3a8b84b0a5d5bbf4c685":"40fe6c26be09e5678fb729a9ab69b336"}
    },
    "20": {
        name: "20 Mediaset",
        type: "dash",
        mpd: "https://wp3-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09489/stb-dash-fhd-avc/SV09489.mpd",
        keyPath: "/lv/ck/app/mediaset/tivusat/keys.php?id=10",
        fallbackKeys: {"9abe8ffecdc8485698881a558eb6a588":"8fd60aab1c99e0e37d454ce41a34df54","705caf5081b93fd39bdf40ad50c63477":"6e51250b070f01da45d625318e0e0ebd"}
    },
    "52": {
        name: "DMAX",
        type: "dash",
        mpd: "https://wp8-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09713/stb-dash-fhd-avc/SV09713.mpd",
        keyPath: "/lv/ck/app/discovery/tivusat/keys.php?id=dmax",
        fallbackKeys: {"3b465d3a53b34fac81e251630e9ad884":"adc4f9d5df8902fd02bb5faab013e441","8ba07052b5753f2d89b28cf0fc80b3be":"49cb3531f6e693d759eb28c4e5524ca5"}
    },
    "58": {
        name: "Rai Sport",
        type: "hls",
        stream: "https://viamotionhsi.netplus.ch/live/eds/raisport1/browser-HLS8/raisport1.m3u8"
    },
    "60": {
        name: "Sportitalia",
        type: "hls",
        stream: "https://amg01370-italiansportcom-sportitalia-rakuten-3hmdb.amagi.tv/hls/amagi_hls_data_rakutenAA-sportitalia-rakuten/CDN/master.m3u8"
    },
    "64": {
        name: "SuperTennis",
        type: "hls",
        stream: "https://live-embed.supertennix.hiway.media/restreamer/supertennix_client/gpu-a-c0-16/restreamer/outgest/aa3673f1-e178-44a9-a947-ef41db73211a/manifest.m3u8"
    },
    "100": {
        name: "RSI LA 2",
        type: "dash",
        mpd: "https://wp2-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09043/stb-dash-fhd-avc/SV09043.mpd",
        keyPath: "/lv/ck/app/rsi/keys.php?id=rsila2",
        fallbackKeys: {"117d07fd98cc46ef8e09936d0d37c506":"b9528cb3f23eaad789f0f33bf6b01868","166b2f0d56fb32d9b46d4b1ca1b5bf16":"d78ee5c91eb3b9b6d37414a4f789bc9b"}
    },
    "101": {
        name: "RSI LA 1",
        type: "dash",
        mpd: "https://wp3-s-anp31323132-live-ch-prod.prod.cdn.dmdsdp.com/live/disk1/SV09042/stb-dash-fhd-avc/SV09042.mpd",
        keyPath: "/lv/ck/app/rsi/keys.php?id=rsila1",
        fallbackKeys: {"09af5f6eb89041ca8f5d164165142e86":"1989cc9c9ce5b2b52cb93edaaefe8420","d268d810d8a73bd8b7d54a6a087581d2":"1aaf297543168c625e05aa9e27344471"}
    }
};

// Aliases
CHANNELS["rai1"] = CHANNELS["1"];
CHANNELS["rai2"] = CHANNELS["2"];
CHANNELS["rai3"] = CHANNELS["3"];
CHANNELS["rete4"] = CHANNELS["4"];
CHANNELS["canale5"] = CHANNELS["5"];
CHANNELS["italia1"] = CHANNELS["6"];
CHANNELS["la7"] = CHANNELS["7"];
CHANNELS["tv8"] = CHANNELS["8"];
CHANNELS["nove"] = CHANNELS["9"];
CHANNELS["20mediaset"] = CHANNELS["20"];
CHANNELS["dmax"] = CHANNELS["52"];
CHANNELS["raisport"] = CHANNELS["58"];
CHANNELS["sportitalia"] = CHANNELS["60"];
CHANNELS["supertennis"] = CHANNELS["64"];
CHANNELS["rsila2"] = CHANNELS["100"];
CHANNELS["rsila1"] = CHANNELS["101"];

function fetchKeys(keyPath) {
    return new Promise((resolve) => {
        const req = https.get(`https://juventusonair.com${keyPath}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'Referer': 'https://juventusonair.com/'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
        req.setTimeout(2500, () => {
            req.destroy();
            resolve(null);
        });
    });
}

function renderPlayerHtml(ch, streamUrl, keys) {
    const drmSnippet = keys ? `
            player.configure({
                drm: {
                    clearKeys: ${JSON.stringify(keys)}
                }
            });` : '';

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ch.name} - StreamGrid</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.11/controls.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .shaka-video-container { width: 100% !important; height: 100% !important; }
        video { width: 100%; height: 100%; object-fit: contain; background: #000; }
        .shaka-controls-button-panel { background: linear-gradient(to top, rgba(0,0,0,0.85), transparent) !important; }
        .shaka-overflow-menu, .shaka-settings-menu { background: rgba(18, 18, 18, 0.95) !important; border: 1px solid #333 !important; border-radius: 8px !important; }
        
        /* Unmute Banner if autoplay was muted */
        #unmute-banner {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(30, 41, 59, 0.9);
            color: #fff;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid rgba(255,255,255,0.2);
            cursor: pointer;
            z-index: 100;
            display: none;
            backdrop-filter: blur(8px);
            transition: opacity 0.2s ease;
        }
        #unmute-banner:hover { background: rgba(59, 130, 246, 0.9); }
    </style>
</head>
<body>
    <div id="unmute-banner" onclick="unmuteAudio()">🔊 Clicca per attivare l'audio</div>
    <div data-shaka-player-container class="shaka-video-container">
        <video data-shaka-player autoplay playsinline></video>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.11/shaka-player.ui.min.js"></script>
    <script>
        let playerInstance = null;
        let videoEl = null;

        function unmuteAudio() {
            if (videoEl) {
                videoEl.muted = false;
                videoEl.volume = 1;
                document.getElementById('unmute-banner').style.display = 'none';
            }
        }

        document.addEventListener('shaka-ui-loaded', async () => {
            videoEl = document.querySelector('video');
            const ui = videoEl['ui'];
            const controls = ui.getControls();
            playerInstance = controls.getPlayer();

            ui.configure({
                addSeekBar: true,
                controlPanelElements: [
                    'play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'fullscreen', 'overflow_menu'
                ],
                overflowMenuButtons: ['quality', 'language', 'captions']
            });

            ${drmSnippet}

            playerInstance.configure({
                streaming: {
                    lowLatencyMode: true,
                    bufferingGoal: 12,
                    rebufferingGoal: 2,
                    stallThreshold: 1
                }
            });

            playerInstance.addEventListener('error', (e) => {
                console.error('Errore riproduzione Shaka:', e.detail);
            });

            try {
                await playerInstance.load("${streamUrl}");
                console.log("${ch.name} avviato con successo!");
                
                // Check if browser muted audio
                if (videoEl.muted) {
                    document.getElementById('unmute-banner').style.display = 'block';
                }
            } catch (err) {
                console.error("Errore caricamento flusso:", err);
            }
        });
    </script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
    const rawId = req.query.id || req.query.ch || req.query.channel;
    if (!rawId) {
        res.status(400).send("Parametro canale mancante (?id= o ?ch=)");
        return;
    }

    const channelKey = String(rawId).toLowerCase();
    const ch = CHANNELS[channelKey];

    if (!ch) {
        res.status(404).send("Canale '" + rawId + "' non trovato nel catalogo.");
        return;
    }

    let streamUrl = ch.type === 'hls' ? ch.stream : ch.mpd;
    let keys = null;

    if (ch.type === 'dash') {
        if (ch.keyPath) {
            keys = await fetchKeys(ch.keyPath);
        }
        if (!keys && ch.fallbackKeys) {
            keys = ch.fallbackKeys;
        }
    }

    const html = renderPlayerHtml(ch, streamUrl, keys);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    res.status(200).send(html);
};
