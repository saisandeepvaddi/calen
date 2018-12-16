#!/usr/bin/env node
"use strict";
const cli = require("./cli");
const utils = require("./utils");
const { google } = require("googleapis");
const ora = require("ora");
const spinners = require("./spinners");
const Table = require("cli-table3");
const dayjs = require("dayjs");
const chalk = require("chalk");
const chrono = require("chrono-node");

const listEvents = async auth => {
  return new Promise((resolve, reject) => {
    try {
      const calendar = google.calendar({ version: "v3", auth });
      const inputs = cli.input;
      const flags = cli.flags;
      const parsedDate = inputs[0]
        ? chrono.parseDate(inputs[0].replace(/[-_]/i, " "))
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
            spinners.eventSpinner.fail(`Fetching calender events failed`);
            reject(err);
          }
          if (res) {
            const events = res.data.items;
            spinners.eventSpinner.succeed("Here's your calender");
            resolve(events);
          }
        }
      );
    } catch (error) {
      spinners.eventSpinner.fail(`Fetching calender events failed.`);
      chalk.red(error);
    }
  });
};

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
      chalk.bold.greenBright(event.summary),
      startTime.toLocaleDateString() + " " + startTime.toLocaleTimeString(),
      endTime.toLocaleDateString() + " " + endTime.toLocaleTimeString(),
      dayjs(endTime).diff(dayjs(startTime), "hour", true) + " hrs",
      chalk.underline.yellow(event.location)
    ]);
  });

  console.log(table.toString());
};

const calen = async () => {
  try {
    // spinners.authSpinner.start();
    const auth = await utils.authorize();

    // console.log("auth: ", auth);
    spinners.eventSpinner.start();
    const events = await listEvents(auth);
    displayEvents(events);
  } catch (error) {
    console.log(error);
  }
};

calen();
