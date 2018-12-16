# calen

Simple CLI for checking your google calender. Supports human readable date parsing.

> NOTE: You need to have >= node 8 installed

# Install

```
  > npm i -g calen
```

# Usage

You can check the `--help` argument for available commands

```
  > calen --help

  Usage
    $ calen                             -- (Default) Events starting today
    $ calen [start time of events]      -- See examples below
    $ calen today                       -- Calender from today
    $ calen tomorrow                    -- Calender from tomorrow
    $ calen last week                   -- Calender since last week
    $ calen 2 hrs from now              -- Calender starting from 2 hrs from now
    $ calen -c 100                      -- 100 events starting from now
    $ calen today -n                    -- Events starting today, but let me login to my Google account again.

  Options
    --count, -c         Number of calender events to show (Default 10)
    --new, -n           Remove auth tokens and re-launch authorization process (Useful to login to a different Google account)

  Example
    $ calen
    ┌────────────────────────────────────┬───────────────────────┬────────────────────────┬───────────────────────┬───────────────┐
    │ Event                              │ Start                 │ End                    │ Duration              │ Location      │
    ├────────────────────────────────────┼───────────────────────┼────────────────────────┼───────────────────────┼───────────────┤
    │ Meeting with Client                │ 12/23/2018 1:55:00 AM │ 12/23/2018 2:55 :00 PM │ 2.00 hrs              │ Bengaluru BLR │
    ├────────────────────────────────────┼───────────────────────┼────────────────────────┼───────────────────────┼───────────────┤
    │ Flight to Washington, D.C          │ 12/23/2018 6:10:00 PM │ 12/24/2018 3:00:00 AM  │ 8.833333333333334 hrs │ Washington IAD│
    └────────────────────────────────────┴───────────────────────┴────────────────────────┴───────────────────────┴───────────────┘

```

# Developers

Please get your own credentials for Google Calender API and replace in [credentials.js](/src/credentials.js) file. Google documentation link is given in the same file.

PRs are welcomed.

# Thanks

Thanks to the maintainers and contributors of the following packages.

- chalk
- chrono-node
- cli-table3
- dayjs
- googleapis
- meow
- opn
- ora

# License

[MIT](/LICENSE)
