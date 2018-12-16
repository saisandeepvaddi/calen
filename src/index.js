#!/usr/bin/env node
"use strict";
const cli = require("./cli");
const utils = require("./utils");
const { google } = require("googleapis");
const ora = require("ora");
const spinners = require("./spinners");

const listEvents = async auth => {
  return new Promise((resolve, reject) => {
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: new Date("2018-11-01T00:00:00").toISOString(),
        maxResults: 10,
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
          spinners.eventSpinner.succeed();
          resolve(events);
        }
      }
    );
  });
};

const displayEvents = events => {
  events.map(event => {
    console.log(event.summary);
  });
};

const calen = async () => {
  try {
    // spinners.authSpinner.start();
    const auth = await utils.authorize();

    // console.log("auth: ", auth);
    const events = await listEvents(auth);
    displayEvents(events);
  } catch (error) {
    console.log(error);
  }
};

calen();
