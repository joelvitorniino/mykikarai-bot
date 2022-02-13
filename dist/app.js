"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = require("@adiwajshing/baileys");
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
async function connectToWhatsapp() {
    const { state, saveState } = (0, baileys_1.useSingleFileLegacyAuthState)('./auth_info_multi.json');
    const sock = (0, baileys_1.makeWALegacySocket)({
        printQRInTerminal: true,
        auth: state
    });
    sock.ev.on('connection.update', (update) => {
        var _a, _b;
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsapp();
            }
            ;
        }
        else if (connection === 'open') {
            console.log('opened connection');
        }
        ;
    });
    sock.ev.on('creds.update', saveState);
    sock.ev.on('messages.upsert', async ({ messages }) => {
        var e_1, _a, e_2, _b;
        const m = messages[0];
        try {
            if (String(m.message.extendedTextMessage.text).toLowerCase() === '.comandos' || String(m.message.extendedTextMessage.text).toLowerCase() === '.help' || String(m.message.extendedTextMessage.text).toLowerCase() === '.menu') {
                await sock.sendMessage(m.key.remoteJid, {
                    text: `Bem vindo ao bot do Mykikarai Scan, a melhor scan br de kakegurui!
    
    .s - Para fazer figurinhas de gif ou imagem (Obs: Só está funcionando por enquanto com essa palavra na legenda!), alguns gifs não poderão funcionar. 
                    
    Em Breve teremos mais comandos, lembrando que a volta do desenvolvedor do NiinoBot será devagar.`
                });
            }    
        } catch(e) {
            console.log("");
        }
        if (m.message.imageMessage && m.message.imageMessage.caption === '.s') {
            const stream = await (0, baileys_1.downloadContentFromMessage)(m.message.imageMessage, 'image');
            let buffer = Buffer.from([]);
            try {
                for (var stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = await stream_1.next(), !stream_1_1.done;) {
                    const chunk = stream_1_1.value;
                    buffer = Buffer.concat([buffer, chunk]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) await _a.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            ;
            const sticker = new wa_sticker_formatter_1.Sticker(buffer, {
                pack: 'Mykikarai Bot',
                author: 'Joel',
                type: wa_sticker_formatter_1.StickerTypes.FULL,
            });
            await sock.sendMessage(m.key.remoteJid, await sticker.toMessage());
        }
        ;
        if (m.message.videoMessage && m.message.videoMessage.caption === '.s') {
            const stream = await (0, baileys_1.downloadContentFromMessage)(m.message.videoMessage, 'video');
            let buffer = Buffer.from([]);
            try {
                for (var stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = await stream_2.next(), !stream_2_1.done;) {
                    const chunk = stream_2_1.value;
                    buffer = Buffer.concat([buffer, chunk]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (stream_2_1 && !stream_2_1.done && (_b = stream_2.return)) await _b.call(stream_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            ;
            const sticker = new wa_sticker_formatter_1.Sticker(buffer, {
                pack: 'Mykikarai Bot',
                author: 'Joel',
                type: wa_sticker_formatter_1.StickerTypes.FULL,
                id: '12345',
                quality: 50,
            });
            await sock.sendMessage(m.key.remoteJid, await sticker.toMessage(), {
                ephemeralExpiration: 10
            });
        }
        ;
    });
}
;
connectToWhatsapp();
