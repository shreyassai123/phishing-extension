const clf = require('../model/classifier.json');
const random_forest = require('./randomforest.js');

const json = {
    "(-) Prefix/Suffix in domain": "-1",
    "@ Symbol": "-1",
    "Anchor": "1",
    "Favicon": "-1",
    "HTTPS": "1",
    "HTTPS in URL's domain part": "-1",
    "IP Address": "-1",
    "No. of Sub Domains": "1",
    "Port": "-1",
    "Redirecting using //": "1",
    "Request URL": "1",
    "SFH": "-1",
    "Script & Link": "-1",
    "Tiny URL": "-1",
    "URL Length": "0",
    "iFrames": "-1",
    "mailto": "-1"
}

function classify(result) {
    var legitimateCount = 0;
    var suspiciousCount = 0;
    var phishingCount = 0;
    for(var key in result) {
      if(result[key] == "1") phishingCount++;
      else if(result[key] == "0") suspiciousCount++;
      else legitimateCount++;
    }
    const legitimatePercent = legitimateCount / (phishingCount+suspiciousCount+legitimateCount) * 100;
  
    if(result.length != 0) {
      var X = [];
      X[0] = [];
      for(var key in result) {
          X[0].push(parseInt(result[key]));
      }
      console.log(result);
      console.log(X);
        var rf = random_forest(clf);
        var y = rf.predict(X);
        console.log(y[0]);
        if(y[0][0]) {
          return true, legitimatePercent
        } else {
          return false, legitimatePercent;
        }

    }
  
  }

  console.log(classify(json))