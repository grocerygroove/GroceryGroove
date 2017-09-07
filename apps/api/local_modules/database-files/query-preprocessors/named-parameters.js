const createRegex = () => /:(\w+)\b/g;

const extractParameterNames = (sql => {
  const regex = createRegex();

  const namesLookup = {}
  const retval = [];

  let res;
  while (res = regex.exec(sql)) {
    const [ , parameterName ] = res;

    if (!namesLookup[parameterName]) {
      namesLookup[parameterName] = true;
      retval.push(parameterName);
    }
  }

  return retval;
});

const convertSql = ((names, sql) => names.reduce(
  (sql, name, index) => sql.replace(new RegExp(`:${ name }\\b`, 'g'), `$${ index + 1 }`),
  sql
));

const createValuesList = ((names, values) => names.map(name => {
  if (values[name] === undefined) {
    throw new ParameterMissingError(name);
  }

  return values[name];
}));

module.exports = ((opts) => {
  if (opts == null) {
    opts = {};
  }

  const cache = {};

  return function namedParameters (queryArgs) {
    if (!cache[queryArgs.pathname]) {
      if (queryArgs.attributes
        && queryArgs.attributes.namedParameters 
        && queryArgs.attributes.namedParameters.enabled) {
        const names = extractParameterNames(queryArgs.sql);
        const sql = convertSql(names, queryArgs.sql);

        cache[queryArgs.pathname] = (liveQueryArgs => Object.assign({}, liveQueryArgs, {
          namedParameters: {
            originalSql:    queryArgs.sql,
            originalValues: queryArgs.values,
          },

          sql,
          values: createValuesList(names, liveQueryArgs.values),
        }));

      } else {
        cache[queryArgs.pathname] = (liveQueryArgs => liveQueryArgs);
      }
    }

    return cache[queryArgs.pathname](queryArgs);
  };
});
