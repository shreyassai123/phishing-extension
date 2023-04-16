const clfdata = require("../model/classifier.json");
const testdata = require("../model/testdata.json");
const random_forest = require("./randomforest.js")

function test_model() {

      var rf = random_forest(clfdata);

        var X = testdata['X_test'];
        var y = testdata['y_test'];
        for(var x in X) {
          for(var i in x) {
            x[i] = parseInt(x[i]);
          }
        }
        var pred = rf.predict(X);
        var TP = 0, TN = 0, FP = 0, FN = 0;
        for(var i in pred) {
          if(pred[i][0] == true && y[i] == "1") {
            TP++;
          } else if(pred[i][0] == false && y[i] == "1") {
            FN++;
          } else if(pred[i][0] == false && y[i] == "-1") {
            TN++;
          } else if(pred[i][0] == true && y[i] == "-1") {
            FP++;
          }
        }
        var precision = TP/(TP+FP);
        var recall = TP/(TP+FN);
        var f1 = 2 * precision * recall / (precision + recall);

        console.log("Precision: " + precision);
        console.log("Recall: " + recall);
        console.log("F1: " + f1);
  }
  
  test_model();