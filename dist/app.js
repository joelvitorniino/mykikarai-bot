"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = require("@adiwajshing/baileys");
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
        const m = messages[0];
        if (m.message.extendedTextMessage.text === '!oi') {
            sock.sendMessage(m.key.remoteJid, { text: 'eae!' });
        }
        ;
    });
}
;
connectToWhatsapp();
