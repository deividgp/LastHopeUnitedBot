const fs = require('fs');
const Discord = require('discord.js');
const readline = require('readline');
const { google } = require('googleapis');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');
require('dotenv').config()
const { sheetId } = require(`../config/${process.env.MODE}.json`);

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = './config/token.json';

class Sheet {
    constructor() {

    }

    runSheet(name, msg) {
        // Load client secrets from a local file.
        fs.readFile('./config/credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            this.authorize(JSON.parse(content), this.listMajors, name, msg);
        });
    }

    authorize(credentials, callback, name, msg) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return this.getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client, name, msg);
        });
    }

    getNewToken(oAuth2Client, callback) {
        var name = this._name;
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client, name, msg);
            });
        });
    }

    listMajors(auth, name, msg) {
        const sheets = google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${name}!A2:H`,
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {
                // Print columns A and E, which correspond to indices 0 and 4.
                var msgBlock = "```\n";
                rows.map((row) => {
                    msgBlock = msgBlock + `${row[0]},${row[1]},${row[2]},${row[3]},${row[4]},${row[5]},${row[6]},${row[7]}\n`;
                });
                msgBlock = msgBlock + "```";
                msg.channel.send(msgBlock);
            } else {
                console.log('No data found.');
            }
        });
    }

}
module.exports = Sheet;