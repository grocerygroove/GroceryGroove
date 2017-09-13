require('dotenv').load();
global.Promise = require("bluebird");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

tap.test("db/queries/users/create-by-email", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };
  const testEmail = "kittykat@katmail.com";
  const nickname = "Testerman";
  const pass = "123123123";

  tap.test("create-user-by-email", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });


    const startCount = parseInt((await db.query({
      text:` select count(*) as count
             from users
             where email = '${ testEmail }'`,
    })).rows[0].count);

    const userId = await queries.users.createByEmail(db, logger, {
      email: testEmail,
      nickname,
      password: pass,
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from users
             where email = '${ testEmail }'`,
    })).rows[0].count);

    tap.assert(userId);
    tap.assert(endCount > startCount);

    await db.end();
  }));

  tap.test("create-user-by-device-identifier", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const deviceIdentifier = "4PizHn/;8Ysd.[GK2#";

    const startCount = parseInt((await db.query({
      text:` select count(*) as count
             from users
             where device_identifier = '${ deviceIdentifier }'`,
    })).rows[0].count);

    const userId = await queries.users.createByDeviceIdentifier(db, logger, {
      deviceIdentifier,
      nickname: "Nick",
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from users
             where device_identifier = '${ deviceIdentifier }'`,
    })).rows[0].count);

    tap.assert(userId);
    tap.assert(endCount > startCount);

    await db.end();
  }));

  tap.test("create-household-user", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const householdId = await queries.households.create(db, logger, {
      name: "Tester name",
    });

    const userId = await queries.users.createByEmail(db, logger, {
      email: testEmail,
      nickname,
      password: pass,
    });

    const startCount = parseInt((await db.query({
      text:` select count(*) as count
             from households_users 
             where household_id = '${ householdId }'
              and user_id = '${ userId }'`,
    })).rows[0].count);

    await queries.users.createHouseholdUser(db, logger, {
      householdId,
      userId,
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from households_users 
             where household_id = '${ householdId }'
              and user_id = '${ userId }'`,
    })).rows[0].count);

    tap.assert(endCount > startCount);

    await db.end();
  }));

  tap.end();
});
