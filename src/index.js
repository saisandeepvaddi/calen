#!/usr/bin/env node
"use strict";
const fs = require("fs");
const cli = require("./cli");
const utils = require("./utils");
const { google } = require("googleapis");
const ora = require("ora");
const Table = require("cli-table3");
const dayjs = require("dayjs");
const chalk = require("chalk");
const chrono = require("chrono-node");
const Conf = require("conf");
const inquirer = require('inquirer');
const config = new Conf();

const eventSpinner = ora(chalk.green(`Fetching Calender..`));

const listEvents = async auth => {
  return new Promise((resolve, reject) => {
    try {
      const calendar = google.calendar({ version: "v3", auth });
      const inputs = cli.input;
      const flags = cli.flags;
      const inputString = inputs.length ? inputs.join(" ") : "";
      const parsedDate = inputString
        ? chrono.parseDate(inputString.replace(/[-_]/i, " "))
        : null;

      const timeMin =
        parsedDate !== null
          ? dayjs(parsedDate)
            .startOf("day")
            .toISOString()
          : dayjs().toISOString();

      calendar.events.list(
        {
          calendarId: "primary",
          timeMin: timeMin,
          maxResults: flags.count,
          singleEvents: true,
          orderBy: "startTime"
        },
        (err, res) => {
          if (err) {
            eventSpinner.fail(`Fetching calender events failed`);
            reject(err);
          }
          if (res) {
            const events = res.data.items;
            eventSpinner.succeed("Here's your calender");
            resolve(events);
          }
        }
      );
    } catch (error) {
      eventSpinner.fail(`Fetching calender events failed.`);
      chalk.red(error);
    }
  });
};

const addEvent = async (auth, event) => {
  try {
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.insert(
      {
        auth: auth,
        calendarId: 'primary',
        resource: event
      },
      (err, resultEvent) => {
        if (err) {
          eventSpinner.fail('There was an error contacting the Calendar service: ' + err);
        } else {
          eventSpinner.succeed('Event created: %s', resultEvent.htmlLink);
        }
      });
  } catch (error) {
    eventSpinner.fail(`Adding calender event failed.`);
    chalk.red(error);
  }
}

const displayEvents = events => {
  const makeBrightYellow = str => chalk.bold.yellowBright(str);
  const table = new Table({
    head: [
      makeBrightYellow("Event"),
      makeBrightYellow("Start"),
      makeBrightYellow("End"),
      makeBrightYellow("Duration"),
      makeBrightYellow("Location")
    ]
  });
  events.forEach(event => {
    const startTime = new Date(event.start.dateTime);
    const endTime = new Date(event.end.dateTime);
    table.push([
      chalk.bold.greenBright(event.summary) || "N/A",
      startTime.toLocaleDateString() + " " + startTime.toLocaleTimeString() ||
      "N/A",
      endTime.toLocaleDateString() + " " + endTime.toLocaleTimeString() ||
      "N/A",
      dayjs(endTime)
        .diff(dayjs(startTime), "hour", true)
        .toFixed(2) + " hrs" || "N/A",
      chalk.underline.yellow(event.location || "N/A")
    ]);
  });

  console.log(table.toString());
};

const calen = async () => {
  try {
    // authSpinner.start();
    if (cli.flags.new) {
      config.delete("calen-token");
    }
    const auth = await utils.authorize();
    // console.log("auth: ", auth);

    if (cli.flags.add) {
      const questions = [
        {
          type: 'input',
          name: 'summary',
          message: 'Event Summary: '
        },
        {
          type: 'input',
          name: 'location',
          message: 'Location: '
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description: '
        },
        {
          type: 'input',
          name: 'start',
          message: 'Start Date (seperate days month and year with - Then T before specifying time and finally + or - timezone) \n Example: 2015-05-28T09:00:00-07:00 \n'
        },
        {
          type: 'input',
          name: 'end',
          message: 'End Date (seperate days month and year with - Then T before specifying time and finally + or - timezone) \n Example: 2015-05-28T09:00:00-07:00 \n'
        }
      ];
      inquirer.prompt(questions).then(answers => {
        const e = {
          'summary': answers.summary,
          'location': answers.location,
          'description': answers.description,
          'start': {
            'dateTime': answers.start
          },
          'end': {
            'dateTime': answers.end
          }
        }
        addEvent(auth, e);
      });
    } else {
      eventSpinner.start();
      const events = await listEvents(auth);
      displayEvents(events);
    }

  } catch (error) {
    console.log(error);
  }
};

calen();
