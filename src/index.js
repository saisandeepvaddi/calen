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
const TOKEN_PATH = "token.json";

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
      fs.unlinkSync(TOKEN_PATH);
    }

    const auth = await utils.authorize();

    // console.log("auth: ", auth);
    eventSpinner.start();
    const events = await listEvents(auth);
    displayEvents(events);
  } catch (error) {
    console.log(error);
  }
};

calen();
