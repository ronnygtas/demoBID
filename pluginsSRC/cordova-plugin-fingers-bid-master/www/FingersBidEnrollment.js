var exec = require('cordova/exec');

exports.initialize = function(userID, success, error) {
  exec(success, error, "FingersBidEnrollment", "initializeKaralundi", [userID]);
};

exports.initializeVerify = function(userID, hand, success, error) {
  exec(success, error, "FingersBidEnrollment", "initializeKaralundiVerify", [userID, hand]);
};

exports.enroll = function(jsonFPrints, success, error) {
  exec(success, error, "FingersBidEnrollment", "enrollKaralundi", [jsonFPrints]);
}

exports.initializeKaralundiVariable = function( configs, success, error){
  exec(success, error, "FingersBidEnrollment", "initializeKaralundiVariable", [configs]);
};