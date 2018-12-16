const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const chalk = require("chalk");
const opn = require("opn");
const credentials = require("./credentials");
const Conf = require("conf");

const config = new Conf();

// Scopes for GOOGLE APIs
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

const getAccessToken = async oAuth2Client => {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log(
      chalk.yellow(
        `No Previous authorization found. Taking steps to get you authorized.`
      )
    );

    console.log(
      chalk.cyan("Go to the following URL if your browser didn't open already:")
    );

    console.log(`${chalk.bold.underline.green(authUrl)}`);

    console.log("\n");

    opn(authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(chalk.gray("Enter the code from that page here: "), code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        config.set("calen-token", token);
        resolve(oAuth2Client);
      });
    });
  });
};

const authorize = async () => {
  try {
    return new Promise(async (resolve, reject) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Check if we have previously stored a token.
      if (config.has("calen-token")) {
        let token = config.get("calen-token");
        oAuth2Client.setCredentials(token);
        resolve(oAuth2Client);
      } else {
        const newOAuthClient = await getAccessToken(oAuth2Client);
        resolve(newOAuthClient);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  authorize
};
