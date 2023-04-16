/*global chrome*/
import React, {useEffect, useState} from 'react';
import getFeatures from './services/features';
import random_forest from './services/randomforest';
import clf from "./services/classifier.json"
import Loading from './components/loading';
import Card from './components/card';
import './app.css';

function App() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [phishing, setPhishing] = useState(null);
  const [percent, setPercent] = useState(100);
  const [features, setFeatures] = useState([]);
  const [loaded, setLoaded] = useState(false);

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
        var rf = random_forest(clf);
        var y = rf.predict(X);
        if(y[0][0]) {
          return {
            phishing: true,
            percent: legitimatePercent
          }
        } else {
          return {
            phishing: false,
            percent: legitimatePercent
          }
        }

    }
  
  }

  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      setTitle(tabs[0].title);
      setUrl(tabs[0].url);
      
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.scripting
    .executeScript({
      target : {tabId : tab.id},
      func : getFeatures,
    })

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if(request.type === "url") {
        console.log(request.data)
      } else if(request.type === "features") {
        setFeatures(request.data);
        console.log("Classification "+classification(request.data))
        const result = classification(request.data);
        setPercent(result.percent);
        setPhishing(result.phishing);
        setLoaded(true);
      }
      
    })
    
    });

    

  }, []);
  if(loaded) {
  return (
    <>
    <h1>Site Score</h1>
    <Loading percent={phishing ? parseInt(percent)-20: parseInt(percent)}/>
    <div>
      <div className="top"></div>
      {/* <h1 className="text-blue-400 font-extrabold">Phishing Detection</h1>
      <h3>URL: {url}</h3>
      <h3>Title {title}</h3>
      
      <h3>Phishing: {phishing ? "Yes" : "No"}</h3>
      <h3>Site Score: {phishing ? parseInt(percent) - 20 : parseInt(percent)}%</h3>
      <h3>Features: {features.length}</h3> */}
      {
        phishing ? <h3 style={{color: "#FA9884"}}>Warning! This website is unsafe.</h3> : <h3 style={{color: "green"}}>This website is safe to use :)</h3>
      }

      <div>
        {
          Object.keys(features).map((key) => {
            if(features[key] === "1") {
              return <Card text={key} color="#FA9884"/>
            } else if(features[key] === "0") {
              return <Card text={key} color="#FFD93D"/>
            } else if (features[key] === "-1"){
              return <Card text={key} color="#DDFFBB"/>
            }
          }
          )
        }
      </div>

    </div>
    </>
  );
  }
  
  return <div></div>
}

export default App;
