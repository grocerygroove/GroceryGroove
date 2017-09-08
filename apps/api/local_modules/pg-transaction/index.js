module.exports = async function pgTransaction (pool, callback) {
  const client = await pool.connect();

  await client.query("BEGIN");

  try {
    const transactionClient = Object.create(client);
    transactionClient.release = function release () {
      throw new Error("Cannot release client while inside transaction.");
    };

    const args = [].concat(
      [ transactionClient ],
      Array.from(arguments).slice(2)
    );
    console.log(JSON.stringify(args, null, 2));
    const retval = await callback.apply(args);

    await client.query("COMMIT");

    client.release();

    console.log("got here");
    return retval;
  } catch (e) {
    console.log("rollback");
    client.query("ROLLBACK");
    client.release();

    throw e;
  };
};

module.exports.addToPool = function addPgTransactionToPool (pool) {
  pool.transaction = function (callback) {
    return module.exports(this, callback);
  };
};
