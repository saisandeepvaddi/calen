const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const spinners = require("./spinners");
const chalk = require("chalk");
const opn = require("opn");
// Scopes for GOOGLE APIs
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_PATH = "token.json";

/**
 * Read credentials for Google API application. App developer (only developer)'s JOB.
 */
const readCredentials = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile("credentials.json", (err, content) => {
      return err ? reject(err) : resolve(content);
    });
  });
};

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
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) reject(err);
          // console.log("Token stored to", TOKEN_PATH);
          // spinners.authSpinner.succeed();
          resolve(oAuth2Client);
        });
      });
    });
  });
};

const authorize = async () => {
  try {
    return new Promise(async (resolve, reject) => {
      const credentialString = await readCredentials();
      const credentials = JSON.parse(credentialString);
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, "utf8", async (err, token) => {
        // console.log("token: ", token);
        let newToken = token ? JSON.parse(token) : null;
        if (err || !newToken) {
          const newOAuthClient = await getAccessToken(oAuth2Client);
          resolve(newOAuthClient);
        } else {
          oAuth2Client.setCredentials(newToken);
          resolve(oAuth2Client);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  authorize
};
