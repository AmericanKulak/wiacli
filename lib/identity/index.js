//==================================================================================================
// Identity serves as the access point for getting a hold of a user. It is expected that every
// request have the associated user retrieved, and then the user object can be used for various
// purposes. See ./user.js for more info.
//==================================================================================================
// Retrieves a user with a given lookup Id.
module.exports.getUserById = getUserById;
//============================= Public API Implementation ==========================================
function getUserById(lookupId) {
  for (var i = 0; i < userDatabase.length; i++) {
    if (userDatabase[i].lookupId == lookupId)
      return userDatabase[i];
  }
  throw new Error('User not found.');
}
//============================= Private API ========================================================
var User = require('./user.js').User;

var userDatabase = [];

function seed() {
  var playerOne = new User('PlayerOne', 'Player One', 'player1@olympus.com', 'player');
  var playerTwo = new User('PlayerTwo', 'Player Two', 'player2@olympus.com', 'player');
  playerTwo.infoKeys.push('1-1-0');
  var fate = new User('Fate', 'Fate', 'fate@olympus.com', 'fate');

  userDatabase.push(playerOne);
  userDatabase.push(playerTwo);
  userDatabase.push(fate);
}

seed();