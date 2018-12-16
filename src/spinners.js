const ora = require("ora");
const chalk = require("chalk");

const authSpinner = ora("Checking Authorization");
const authWaitSpinner = ora("Waiting for user to authorize");
const eventSpinner = ora(chalk.green(`Fetching Calender..`));

module.exports = {
  authSpinner,
  eventSpinner
};
