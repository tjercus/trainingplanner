"use strict";

// make nodejs require work in browser
if (typeof require === "function") {
  var moment = require("moment");
}

/**
 * Model object concerning the concept of a "Training"
 * TODO support imperial units by config.
 */
let Training = (function() {
  let Training = function(training) {
    if (training) {
      this.segments = training.segments;
      this.segments.forEach((segment) => {    
        augmentSegmentData(segment);
      });
      this.name = training.name;
    } else {
      this.segments = [];
      this.name = "new training";
    }
  }
  
  Training.prototype.addSegment = function(obj, overwriteUuid) {
    if (!obj.uuid || overwriteUuid == true) {      
      obj.uuid = createUuid();
    }
    augmentSegmentData(obj);    
    this.segments.push(obj);
  };

  Training.prototype.updateSegment = function(obj) {        
    augmentSegmentData(obj);
    let i = 0;
    this.segments.forEach((segment) => {
      if (segment.uuid === obj.uuid) {        
        this.segments[i] = obj;        
      }
      i++;
    });    
  }

  Training.prototype.removeSegment = function(obj) {
    let i = 0;
    this.segments.forEach((segment) => {
      if (segment.uuid === obj.uuid) {
        this.segments.splice(i, 1);
      }
      i++;
    });
  }

  /**
   * @return mm:ss String
   */
  let makePace = function(obj) {
    let durationObj = moment.duration(obj.duration),
      seconds = durationObj.asSeconds(),
      paceObj = moment.duration(Math.round(seconds / obj.distance), "seconds");
    return lpad(paceObj.minutes()) + ":" + lpad(paceObj.seconds());
  };

  /**    
   * @return hh:mm:ss String as: pace * distance. ex: 5:10 * 12.93 km = 1:6:48
   */
  let makeDuration = function(obj) {
    let paceObj = moment.duration(obj.pace),
      seconds = paceObj.asSeconds() / 60,
      totalSeconds = Math.round(seconds * obj.distance),
      durationObj = moment.duration(totalSeconds, "seconds");
    return formatDuration(durationObj);
  };

  /**
   * @return float calculated distance based on duration / pace
   */
  let makeDistance = function(obj) {    
    let paceObj = moment.duration(obj.pace),
      durationObj = moment.duration(obj.duration),
      durationSeconds = durationObj.asSeconds(),
      paceSeconds = paceObj.asSeconds() / 60;      
    return new Number(durationSeconds / paceSeconds);
  };

  let augmentSegmentData = function(obj) {
    if (obj.duration === undefined || obj.duration === "00:00:00") {
      obj.duration = makeDuration(obj);
    }
    if (obj.pace === undefined || obj.pace === "00:00") {
      obj.pace = makePace(obj);
    }
    if (obj.distance === undefined || obj.distance === 0) {
      obj.distance = makeDistance(obj);
    }
  }

  /**    
   * @return hh:mm:ss String
   */
  let formatDuration = function(obj) {
    return lpad(obj.hours()) + ":" + lpad(obj.minutes()) + ":" + lpad(obj.seconds());
  }

  /**
   * @return Object
   */
  Training.prototype.total = function() {
    let totalObj = {
      distance: new Number(0),
      duration: "00:00:00",
      pace: "00:00"
    };
    if (this.segments.length === 0) {
      return totalObj;
    } else {      
      this.segments.forEach((segment) => {      
        totalObj.distance += parseFloat(segment.distance);        
        let totalDurationObj = moment.duration(totalObj.duration).add(segment.duration);
        totalObj.duration = formatDuration(totalDurationObj);
      });
      if (totalObj.pace === undefined || totalObj.pace === null || totalObj.pace === "00:00") {
        totalObj.pace = makePace(totalObj);
      } else if (totalObj.duration === undefined || totalObj.duration === null || totalObj.duration === "00:00:00") {
        totalObj.duration = makeDuration(totalObj);
      }      
      totalObj.distance = totalObj.distance;
      return totalObj;
    }
  };

  /**
   * TODO create UUID object as a separate module and include it as a module
   * @return uuid as String
   */
  let createUuid = function() {
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0,
        v = c == "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return uuid;
  };

  /**
   * @return leftpadded number ex: 2 becomes 02
   */
  let lpad = function(num) {
    num = "" + num;
    while (num.length < 2) {
      num = "0" + num;
    }
    return num.substr(num.length - 2);
  };

  return Training;
})();

// make nodejs export work in browser (perhaps by using Browserify)
var module = module || {
  exports: {}
};
module.exports.Training = Training;