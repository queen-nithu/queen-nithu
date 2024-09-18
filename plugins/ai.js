const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const {fetchJson,toPTT} = require('../lib/functions');
const axios = require('axios');
const scraper = require("../lib/scraper");
//-----------------------------------------------AI Chat-----------------------------------------------
cmd({
    pattern: "ai",
    desc: "AI Chat",
    category: "ai",
    react: "🤖",
    use: '.ai <Your Text>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let data = await fetchJson(`https://chatgptforprabath-md.vercel.app/api/gptv1?q=${q}`)
        return reply(`${data.data}`)

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        return reply(`Error: ${e.message}`);
    }
});

// -------- Image Generation --------
cmd({
    pattern: 'genimage',
    desc: 'Generate Images from Text Prompts',
    use: '.genimage <Text Prompt>',
    react: "😎",
    category: 'ai',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('Please provide a text prompt for image generation.');

        const options = {
            prompt: q,
            seed: Math.floor(Math.random() * 2147483647) + 1,
            random_seed: true,
            width: 512,
            height: 512,
            steps: 8
        };

        const sessionHash = [...Array(11)].map(() => (~~(Math.random() * 36)).toString(36)).join('');

        const postData = {
            data: [
                options.prompt,
                options.seed,
                options.random_seed,
                options.width,
                options.height,
                options.steps
            ],
            event_data: null,
            fn_index: 2,
            trigger_id: 5,
            session_hash: sessionHash
        };

        const res = await axios.post("https://black-forest-labs-flux-1-schnell.hf.space/queue/join", postData);

        const response = await axios.get(`https://black-forest-labs-flux-1-schnell.hf.space/queue/data?session_hash=${sessionHash}`, {
            responseType: 'stream'
        });

        let chunks = [];
        response.data.on("data", chunk => chunks.push(chunk));
        response.data.on("end", async () => {
            const rawData = Buffer.concat(chunks).toString('utf8');
            const lines = rawData.split('\n');
            const jsonObjects = [];

            lines.forEach(line => {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonString = line.substring(6).trim();
                        const jsonObject = JSON.parse(jsonString);
                        jsonObjects.push(jsonObject);
                    } catch (error) {
                        return reply("Failed to generate image!");
                    }
                }
            });

            const before = jsonObjects.find(d => d.msg === "process_completed");
            if (!before || !before.success) return reply('Failed to generate image!');

            const images = before.output.data.filter(d => typeof d === "object").map(d => d.url);

            if (images.length > 0) {
                await conn.sendMessage(from, { image: { url: images[0] }, caption: `Image generated from prompt: "${q}"\n *Queen Spriky MD*` }, { quoted: mek });
            } else {
                reply('No images were generated.');
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});

cmd({
    pattern: "ld",
    desc: "Chat With Lalaland AI Model.",
    use: ".ld <query>",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        if (args.length === 0) return reply('Please provide a query.');

        const query = args.join(' ');
        await reply("_Processing Request_");

        const response = await fetch(`https://api.vihangayt.com/ai/lalaland?q=${encodeURIComponent(query)}`);
        const result = await response.json();

        if (result.status && result.data) {
            return await conn.sendMessage(from, { text: result.data }, { quoted: mek });
        } else {
            return reply('No valid response received.');
        }
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        return reply(`Error: ${e.message}`);
    }
});
