"use strict";

// make nodejs require work in browser
if (typeof require === "function") {
  var moment = require("moment");
}

/**
 * Model object concerning the concept of a "Training"
 * TODO support imperial units by config.
 */
let Training = function(training) {
  if (training) {    
    this.segments = training.segments;    
    this.segments.forEach((segment) => {
      // TODO remove ugly temp var
      let tempTraining = new Training();
      tempTraining.augmentSegmentData(segment);
    });
    this.name = training.name;
  } else {
    this.segments = [];
    this.name = "new training";
  }

  // TODO disallow direct access to this.segments
  this.addSegment = function(obj, overwriteUuid) {
    if (!obj.uuid || overwriteUuid == true) {      
      obj.uuid = this.createUuid();
    }    
    // TODO remove ugly temp var
    let tempTraining = new Training();
    tempTraining.augmentSegmentData(obj);    
    this.segments.push(obj);
  };

  this.updateSegment = function(obj) {    
    // TODO remove ugly temp var
    let tempTraining = new Training();
    tempTraining.augmentSegmentData(obj); 
    let i = 0;
    this.segments.forEach((segment) => {
      if (segment.uuid === obj.uuid) {        
        this.segments[i] = obj;        
      }
      i++;
    });    
  }

  this.removeSegment = function(obj) {
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
  this.makePace = function(obj) {    
    let durationObj = moment.duration(obj.duration),
      seconds = durationObj.asSeconds(),
      paceObj = moment.duration(Math.round(seconds / obj.distance), "seconds");
    return this.lpad(paceObj.minutes()) + ":" + this.lpad(paceObj.seconds());
  };

  /**    
   * @return hh:mm:ss String as: pace * distance. ex: 5:10 * 12.93 km = 1:6:48
   */
  this.makeDuration = function(obj) {
    let paceObj = moment.duration(obj.pace),
      seconds = paceObj.asSeconds() / 60,
      totalSeconds = Math.round(seconds * obj.distance),
      durationObj = moment.duration(totalSeconds, "seconds");
    return this.formatDuration(durationObj);
  };

  /**
   * @return float calculated distance based on duration / pace
   */
  this.makeDistance = function(obj) {    
    let paceObj = moment.duration(obj.pace),
      durationObj = moment.duration(obj.duration),
      durationSeconds = durationObj.asSeconds(),
      paceSeconds = paceObj.asSeconds() / 60;      
    return new Number(durationSeconds / paceSeconds);
  };

  this.augmentSegmentData = function(obj) {
    if (obj.duration === undefined || obj.duration === "00:00:00") {
      obj.duration = this.makeDuration(obj);
    }
    if (obj.pace === undefined || obj.pace === "00:00") {
      obj.pace = this.makePace(obj);
    }
    if (obj.distance === undefined || obj.distance === 0) {
      obj.distance = this.makeDistance(obj);
    }
  }

  /**    
   * @return hh:mm:ss String
   */
  this.formatDuration = function(obj) {
    return this.lpad(obj.hours()) + ":" + this.lpad(obj.minutes()) + ":" + this.lpad(obj.seconds());
  }

  /**
   * @return Object
   */
  this.total = function() {
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
        totalObj.duration = this.formatDuration(totalDurationObj);
      });
      if (totalObj.pace === undefined || totalObj.pace === null || totalObj.pace === "00:00") {
        totalObj.pace = this.makePace(totalObj);
      } else if (totalObj.duration === undefined || totalObj.duration === null || totalObj.duration === "00:00:00") {
        totalObj.duration = this.makeDuration(totalObj);
      }      
      totalObj.distance = totalObj.distance;
      return totalObj;
    }
  };

  /**
   * TODO create UUID object as a separate module and include it as a module
   * @return uuid as String
   */
  this.createUuid = function() {
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
  this.lpad = function(num) {
    num = "" + num;
    while (num.length < 2) {
      num = "0" + num;
    }
    return num.substr(num.length - 2);
  };
};
// make nodejs export work in browser (perhaps by using Browserify)
var module = module || {
  exports: {}
};
module.exports.Training = Training;