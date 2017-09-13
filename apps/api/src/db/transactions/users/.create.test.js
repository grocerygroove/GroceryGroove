require('dotenv').load();
global.Promise = require("bluebird");
const resetTestingDb = require("../../../utils/reset-testing-database");
const Pool = require('pg').Pool;
const tap = require("tap");
const transactions = require("../../transactions");

const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/transactions/users/create-user-and-household-by-email", tap => {

  tap.test("clean insert", async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const newUser = {
      email: "testytester@test.com",
      nickename: "KittyKat",
      password: "123123123",
    };
    //Things to test
    //* User was created
    //* Household was created
    //* Created by id and household_admin were set
    //* Primary household was set on user table
    //* Password doesn't match passed in password (hashing successful)
    const initialCount = parseInt((await db.query({
      text: `
        SELECT count(*)
        FROM users u
          INNER JOIN households h
            ON u.primary_household_id = h.household_id
          INNER JOIN households_users hu
            ON hu.user_id = u.user_id
              AND hu.household_id = h.household_id
        WHERE u.email = '${newUser.email}'
          AND u.nickname = '${newUser.nickename}'
          AND h.created_by_id = u.user_id  
          AND h.household_admin = u.user_id
          AND u.password <> '${newUser.password}'`,
    })).rows[0]["count"]);

    await transactions.users.createUserAndHouseholdByEmail(db, logger, {
      email: newUser.email,
      nickname: newUser.nickename,
      password: newUser.password,
    });

    const secondaryCount = parseInt((await db.query({
      text: `
        SELECT count(*)
        FROM users u
          INNER JOIN households h
            ON u.primary_household_id = h.household_id
          INNER JOIN households_users hu
            ON hu.user_id = u.user_id
              AND hu.household_id = h.household_id
        WHERE u.email = '${newUser.email}'
          AND u.nickname = '${newUser.nickename}'
          AND h.created_by_id = u.user_id  
          AND h.household_admin = u.user_id
          AND u.password <> '${newUser.password}'`,
    })).rows[0]["count"]);

    tap.ok((secondaryCount > initialCount));

    await db.end();
  });

  tap.end();
});

tap.test("db/transactions/users/create-user-and-household-by-device-identifier", tap => {
  tap.test("clean insert", async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const newUser = {
      deviceIdentifier: "Dsz{8!J.Hj%$b5N3nZ",
      nickename: "AndroidMan",
    };
    //Things to test
    //* User was created
    //* Household was created
    //* Created by id and household_admin were set
    //* Primary household was set on user table
    //* Password doesn't match passed in password (hashing successful)
    const initialCount = parseInt((await db.query({
      text: `
        SELECT count(*)
        FROM users u
          INNER JOIN households h
            ON u.primary_household_id = h.household_id
          INNER JOIN households_users hu
            ON hu.user_id = u.user_id
              AND hu.household_id = h.household_id
        WHERE u.device_identifier = '${newUser.deviceIdentifier}'
          AND u.nickname = '${newUser.nickename}'
          AND h.created_by_id = u.user_id  
          AND h.household_admin = u.user_id`,
    })).rows[0]["count"]);

    await transactions.users.createUserAndHouseholdByDeviceIdentifier(db, logger, {
      deviceIdentifier: newUser.deviceIdentifier,
      nickname: newUser.nickename,
    });

    const secondaryCount = parseInt((await db.query({
      text: `
        SELECT count(*)
        FROM users u
          INNER JOIN households h
            ON u.primary_household_id = h.household_id
          INNER JOIN households_users hu
            ON hu.user_id = u.user_id
              AND hu.household_id = h.household_id
        WHERE u.device_identifier = '${newUser.deviceIdentifier}'
          AND u.nickname = '${newUser.nickename}'
          AND h.created_by_id = u.user_id  
          AND h.household_admin = u.user_id`,
    })).rows[0]["count"]);

    tap.ok((secondaryCount > initialCount));

    await db.end();
  });

  tap.end();
});
