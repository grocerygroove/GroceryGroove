module.exports = {
    attributes: {
        freeform: true,
    },

    run: (name, client, [ householdName, email, passwordPlaintext ]) => Promise.resolve()
        .then(() => client.query({
            name: `${ name }; 1`,
            text: `
                INSERT INTO households (name)
                VALUES ($1)
                RETURNING id
            `,
            values: [ householdName ],
        }))
        .then(rows => rows[0].id)
        .then(householdId => client.query({
            name: `${ name } 2`,
            text: `
                INSERT INTO users (email, password, household_id)
                VALUES ($1, CRYPT($2, GEN_SALT('bf', 8)), $3)
            `,
            values: [ email, passwordPlaintext, householdId ],
        }))
    ,
};
