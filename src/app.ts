import { makeWALegacySocket, DisconnectReason, BufferJSON, useSingleFileLegacyAuthState, downloadContentFromMessage} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter'

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

        if(m.message.extendedTextMessage.text === '.comandos' || m.message.extendedTextMessage.text === '.help' || m.message.extendedTextMessage.text === '.menu') {
            await sock.sendMessage(m.key.remoteJid!, {
                text: `Bem vindo ao bot do Mykikarai Scan, a melhor scan br de kakegurui!

.s - Para fazer figurinhas de gif ou imagem (Obs: Só está funcionando por enquanto com essa palavra na legenda!), alguns gifs não poderão funcionar. 
                
Em Breve teremos mais comandos, lembrando que a volta do desenvolvedor do NiinoBot será devagar.`
            })
        }

        if(m.message.imageMessage && m.message.imageMessage.caption === '.s') {
            const stream = await downloadContentFromMessage(m.message.imageMessage, 'image');
            let buffer = Buffer.from([]);

            for await(const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            };

            const sticker = new Sticker(buffer, {
                pack: 'Mykikarai Bot',
                author: 'Joel',
                type: StickerTypes.FULL,
            });

            await sock.sendMessage(m.key.remoteJid!, await sticker.toMessage());
        };

        if(m.message.videoMessage && m.message.videoMessage.caption === '.s') {
            const stream = await downloadContentFromMessage(m.message.videoMessage, 'video');
            let buffer = Buffer.from([]);

            for await(const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            };

            const sticker = new Sticker(buffer, {
                pack: 'Mykikarai Bot',
                author: 'Joel',
                type: StickerTypes.FULL,
                id: '12345',
                quality: 50,
            });

            await sock.sendMessage(m.key.remoteJid!, await sticker.toMessage(), {
                ephemeralExpiration: 10
            });
        };
    });
};

connectToWhatsapp();