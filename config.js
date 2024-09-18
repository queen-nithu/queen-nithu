const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ZUY0HAzb#zsIoifSfClx3lQhDFx3P6lsk45dwvgNJmT2fJTsotH4",
ALIVE_IMG : process.env.ALIVE_IMG || "https://telegra.ph/file/e1fd8689e69a7baa4920d.jpg",
ALIVE_MSG : process.env.ALIVE_MSG || "Hello i am Test-MD i am alive now ❤️‍🩹@&",
AUTO_READ_STATUS :process.env.AUTO_READ_STATUS || "true",
};

 
