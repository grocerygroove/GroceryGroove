module.exports = function getSqlErrorTransformer(errorStates)
{

    return function transform(error) {
        if(!error.sqlState){
            return error;
        }
        console.log(errorStates);
        console.log(error);

        var errorState = errorStates.filter((obj) =>{
            return obj.state === error.sqlState;
        })[0];

        if(errorState && errorState.message)
            return new Error(errorState.message);
        else
            return new Error("Sql Error State :'" + error.sqlState +"' not handled");
    };
};
