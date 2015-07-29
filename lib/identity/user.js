//==================================================================================================
// User is the data class representing a user object.
//==================================================================================================
// Callers should call new User(...).
module.exports.User = User;

//============================= Public API Implementation ==========================================
function User(lookupId, displayName, email, role) {
  this.id = uniqueKey();
  this.lookupId = lookupId || 'default lookup Id';
  this.displayName = displayName || 'displayName';
  this.email = email || 'email';
  this.infoKeys = [];
  this.role = role || 'player';
}
User.prototype.canView = function(infoKey) {
  if (this.role == 'fate') {
    return true;
  }
  if (this.infoKeys.indexOf(infoKey) >= 0) {
    return true;
  }
  return false;
}
//============================= Private API ========================================================
var uniqueCounter = 0;
function uniqueKey() {
  return uniqueCounter++;
}