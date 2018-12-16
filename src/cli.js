const meow = require("meow");

const cli = meow(
  `
  Usage
    $ calen               -- default is events starting today
    $ calen today
    $ calen tomorrow
    $ calen today tomorrow
    $ calen -c 10
  
  Options
	  --date, -d          Give starting date (default: Today)
    --count, -c         Number of calender events to show
    --new, -n           Remove auth tokens and re-launch authorization process (Use this to login to a different Google account)

  Example
    $ calen
    2018-11-23T18:35:00-05:00 - Flight to Paris (AF 55)
    2018-11-24T04:20:00-05:00 - Flight to Bengaluru (AF 194)
    2018-12-22T15:25:00-05:00 - Flight to Paris (AF 191)
    2018-12-23T07:40:00-05:00 - Flight to Washington, D.C. (AF 54)
`,
  {
    flags: {
      date: {
        type: "string",
        alias: "d",
        default: "today"
      },
      count: {
        type: "string",
        alias: "c",
        default: "10"
      },
      new: {
        type: "boolean",
        alias: "n",
        default: false
      }
    }
  }
);

module.exports = cli;
