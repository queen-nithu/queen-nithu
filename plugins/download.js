const { cmd, commands } = require('../command');
const scraper = require("../lib/scraper");
const { tiktokdl } = require('@bochilteam/scraper');
const getFbVideoInfo = require("fb-downloader-scrapper")
const { getMoviesSearch } = require('sinhalasub.lk');
const fg = require('api-dylux');
const yts = require('yt-search');
const axios = require('axios');
const fetch = require('node-fetch');
const { fetchJson } = require('../lib/functions');
const { lookup } = require('mime-types');
const fs = require('fs');
const { File } = require('megajs');
const path = require('path');
const API = "https://astro-api-crqy.onrender.com/";


// <========FETCH API URL========>
let baseUrl;
(async () => {
    let baseUrlGet = await fetchJson('https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json');
    baseUrl = baseUrlGet.api;
})();


// -------- Song Download --------
cmd({
    pattern: 'song',
    desc: 'Download Songs',
    use: '.song <Song Name>',
    react: "📥",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('Please provide a URL or song name.');

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `*Bot Song Downloader*

*Title:* ${data.title}
*Description:* ${data.description}
*Time:* ${data.timestamp}
*Ago:* ${data.ago}
*Views:* ${data.views}

> Developed By Udavin Wijesundara`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download Audio
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;

        // Send Document File
        await conn.sendMessage(from, { document: { url:downloadUrl }, caption: '*NITHU MD*', mimetype: 'audio/mpeg', fileName:data.title + ".mp3"}, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } })
        // Send Audio File
        //await conn.sendMessage(from, { audio: { url:downloadUrl }, caption: '*Queen Spriky MD*', mimetype: 'audio/mpeg'},{ quoted: mek });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});
