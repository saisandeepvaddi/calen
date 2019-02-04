const meow = require("meow");

const cli = meow(
  `
  Usage
    $ calen                             -- (Default) Events starting today
    $ calen [start time of events]      -- See examples below
    $ calen today                       -- Calender from today
    $ calen tomorrow                    -- Calender from tomorrow
    $ calen last week                   -- calender since last week
    $ calen 2 hrs from now              -- calender starting from 2 hrs from now
    $ calen -c 10
  
  Options
    --add, -a           Add new event to calender
    --count, -c         Number of calender events to show (Default 10)
    --new, -n           Remove auth tokens and re-launch authorization process (Use this to login to a different Google account)

  Example
    $ calen
    ┌────────────────────────────────────┬───────────────────────┬────────────────────────┬───────────────────────┬───────────────┐
    │ Event                              │ Start                 │ End                    │ Duration              │ Location      │
    ├────────────────────────────────────┼───────────────────────┼────────────────────────┼───────────────────────┼───────────────┤
    │ Meeting with Client                │ 12/23/2018 1:55:00 AM │ 12/23/2018 2:55 :00 PM │ 2.00 hrs              │ Bengaluru BLR │
    ├────────────────────────────────────┼───────────────────────┼────────────────────────┼───────────────────────┼───────────────┤
    │ Flight to Washington, D.C          │ 12/23/2018 6:10:00 PM │ 12/24/2018 3:00:00 AM  │ 8.833333333333334 hrs │ Washington IAD│
    └────────────────────────────────────┴───────────────────────┴────────────────────────┴───────────────────────┴───────────────┘
`,
  {
    flags: {
      add: {
        type: "boolean",
        alias: "a",
        default: false
      },
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
