import { random_forest } from './randomforest';
import clf from "./classifier.json"

function classification(result) {
    var legitimateCount = 0;
    var suspiciousCount = 0;
    var phishingCount = 0;
    for(var key in result) {
      if(result[key] === "1") phishingCount++;
      else if(result[key] === "0") suspiciousCount++;
      else legitimateCount++;
    }
    const legitimatePercent = legitimateCount / (phishingCount+suspiciousCount+legitimateCount) * 100;
  
    if(result.length !== 0) {
      var X = [];
      X[0] = [];
      for(key in result) {
          X[0].push(parseInt(result[key]));
      }
      console.log(result);
      console.log(X);
        var rf = random_forest(clf);
        var y = rf.predict(X);
        console.log(y[0]);
        if(y[0][0]) {
          return [true, legitimatePercent]
        } else {
          return [false, legitimatePercent];
        }

    }
  
  }

module.exports = classification;