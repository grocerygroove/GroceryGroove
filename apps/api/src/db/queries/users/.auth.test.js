require('dotenv').load();
global.Promise = require("bluebird");
const defaultUser = require("../../../utils/default-test-user");
const deviceIdUser = require("../../../utils/device-id-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");
const secondaryUser = require("../../../utils/secondary-test-user");

const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/user/check-by-email", tap => {
  tap.test("valid-creds", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const userId = await queries.users.checkByEmail(db, logger, {
      email: defaultUser.email,
      password: defaultUser.password,
    });

    tap.same(userId, defaultUser.user_id, "userId returned is equal to user's userId");

    await db.end();
  }));

  tap.test("invalid-creds", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const userId = await queries.users.checkByEmail(db, logger, {
      email: defaultUser.email,
      password: "blobloblobloblo",
    });

    tap.assert(!userId, "userId is undefined");

    await db.end();
  }));

  tap.test("other-users-pass", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const userId = await queries.users.checkByEmail(db, logger, {
      email: defaultUser.email,
      password: secondaryUser.password,
    });

    tap.assert(!userId, "userId is undefined");

    await db.end();
  }));

  tap.end();
});

tap.test("db/queries/user/check-by-device-identifier", tap => {
  tap.test("valid-device-identifier", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const userId = await queries.users.checkByDeviceIdentifier(db, logger, {
      deviceIdentifier: deviceIdUser.device_identifier,
    });

    tap.same(userId, deviceIdUser.user_id, "userId returned is equal to user's userId");

    await db.end();
  }));

  tap.test("invalid-device-identifier", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const userId = await queries.users.checkByDeviceIdentifier(db, logger, {
      deviceIdentifier: "blobloblobloblo",
    });

    tap.assert(!userId, "userId is undefined");

    await db.end();
  }));

  tap.end();
});
