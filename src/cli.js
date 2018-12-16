const meow = require("meow");

const cli = meow(
  `
  Usage
    $ calen               -- default is events starting today
    $ calen today
    $ calen tomorrow
    $ calen today tomorrow
    $ calen -n 10
  
  Options
	  --date, -d          Give starting date (default: Today)
	  --number, -n        Number of calender events to show

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
      number: {
        type: "number",
        alias: "n",
        default: 10
      }
    }
  }
);

module.exports = cli;
