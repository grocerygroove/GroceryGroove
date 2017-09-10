module.exports = async function pgTransaction (pool, callback) {
  const client = await pool.connect();

  await client.query("BEGIN");

  try {
    //const transactionClient = Object.create(client);
    //transactionClient.release = function release () {
    //client.release = function release () {
    //  throw new Error("Cannot release client while inside transaction.");
    //};

    const retval = await callback(client);

    await client.query("COMMIT");

    return retval;
  } catch (e) {
    client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

};

module.exports.addToPool = function addPgTransactionToPool (pool) {
  pool.transaction = function (callback) {
    return module.exports(this, callback);
  };
};
