var uniqueCounter = 0;
function uniqueKey() {
  return uniqueCounter++;
}

var User = function(lookupId, displayName, email, role){
  this.id = uniqueKey();
  this.lookupId = lookupId || "default lookup Id";
  this.displayName = displayName || "displayName";
  this.email = email || "email";
  this.infoKeys = [];
  this.role = role || "player";
}

User.prototype.canView = function(infoKey) {
  if (this.infoKeys.indexOf(infoKey) >= 0) {
    return true;
  }
}


module.exports.User = User;