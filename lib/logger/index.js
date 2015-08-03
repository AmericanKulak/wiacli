//==================================================================================================
// Logger serves as the absolute request logger for all things in this application.
// It is not intended to be generic. (Yet)
//==================================================================================================
// Express middleware to add "res.logAndRender(view [, locals] [, callback])", and to setup
// request-length logging.
module.exports.Logger = Logger;
// Begins/ends an action, as identified by the |actionName|.
RequestLog.prototype.startAction/*(actionName)*/;
RequestLog.prototype.endAction/*(actionName)*/;
//============================= Public API Implementation ==========================================
function Logger(req, res, next) {
  res.requestLog = new RequestLog(req);
  res.logAndRender = logAndRender;
  next();
}

function RequestLog(request) {
  this.ticks = {};
  this.requestStart = Date.now();
}

RequestLog.prototype.startAction = function(actionName) {
  var actionStartTime = Date.now() - this.requestStart;
  this.ticks[actionName] = new ActionLog(actionName, actionStartTime);
}

RequestLog.prototype.endAction = function(actionName) {
  var actionEndTime = Date.now() - this.requestStart;
  this.ticks[actionName].endAction(actionEndTime);
}
//============================= Private API ========================================================
function logAndRender( /*passthrough arguments*/ ) {
  this.requestLog.startAction('render');
  this.render.apply(this, arguments);
  this.requestLog.endAction('render');
  console.log(this.requestLog);
}

var ActionLog = function(actionName, startTime) {
  this.action = actionName;
  this.started = startTime;
  this.finished = null;
}

ActionLog.prototype.endAction = function(endTime) {
  this.finished = endTime;
  this.elapsed = this.finished - this.started;
}