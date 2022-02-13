import { makeWALegacySocket, DisconnectReason, BufferJSON, useSingleFileLegacyAuthState, downloadContentFromMessage} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import * as fs from 'fs';

async function connectToWhatsapp() {
    const { state, saveState } = useSingleFileLegacyAuthState('./auth_info_multi.json');
    
    const sock = makeWALegacySocket({
        printQRInTerminal: true,
        auth: state
    });
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);

            if(shouldReconnect) {
                connectToWhatsapp();
            };

        } else if(connection === 'open') {
            console.log('opened connection');
        };
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];

        if(m.message.extendedTextMessage.text === '!oi') {
            sock.sendMessage(m.key.remoteJid!, { text: 'eae!' });
        };
    });
};

connectToWhatsapp();