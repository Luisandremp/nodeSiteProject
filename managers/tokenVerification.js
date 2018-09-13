const TOKENSECRET = "q5s1dsq6465qsdq";
const jwt = require('jsonwebtoken');
const UserManager = require('./UserManager.js');
const sanitizeUser = require('./sanitizeUser.js');

module.exports = async  function(headers){

    // use a function to parse the tokken from the header
    const token = getToken(headers);
    // verify a token symmetric - synchronous
    const decoded = jwt.verify(token, TOKENSECRET);
    
  if (token && decoded) {
    try {
        //if token exists and its verified get the user from DB and send it to client
        const result = await  UserManager.getUserByID(decoded.id)
        
        const user = sanitizeUser(result.user);
        
        return {'success': true, 'user': user};
    } catch (error) {
        console.log('token error: ', error);
        return  {success: false, msg: 'Unauthorized.'};
    }
  } else {
    return {success: false, msg: 'Unauthorized.'};
  }
}

/**
 * Parse the token from the headers
 */
getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };