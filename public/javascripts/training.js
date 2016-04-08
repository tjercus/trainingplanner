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
      this.name = training.name;
    } else {
      this.segments = [];
      this.name = "new training";
    }

    // TODO disallow direct access to this.segments
    this.addSegment = function(obj, overwriteUuid) {
        if (!obj.uuid || overwriteUuid == true) {
            console.log("addSegment with new UUID");
            obj.uuid = this.createUuid();
        }
        this.segments.push(obj);
    };

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
        console.log("training: make pace for duration ["+obj.duration+"]");
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

    this.calculateSegmentData = function(obj) {
      if (obj.duration === undefined || obj.duration === 0) {
        obj.duration = this.makeDuration(obj);
      }
      if (obj.pace === undefined || obj.pace === "00:00") {
        obj.pace = this.makePace(obj);
      }
      // TODO calculate distance based on duration * pace
    }

    /**    
    * @return hh:mm:ss String
    */
    this.formatDuration = function(obj) {
      return this.lpad(obj.hours())
        + ":" + this.lpad(obj.minutes())
        + ":" + this.lpad(obj.seconds());
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
            console.log("segments: " + this.segments.length);
            // TODO forEach/this
            //segments.forEach((obj) => {
            for (let i = 0, len = this.segments.length; i < len; i++) {
                // add distance, NOTE: side-effect: obj is a reference so it changes
                let segmentObj = this.segments[i];
                this.calculateSegmentData(segmentObj);
                totalObj.distance += parseFloat(segmentObj.distance);
                // add duration
                let totalDurationObj = moment.duration(totalObj.duration).add(segmentObj.duration);
                totalObj.duration = this.formatDuration(totalDurationObj);
              //}).bind(this);
            }

            if (totalObj.pace === undefined 
              || totalObj.pace === null 
              || totalObj.pace === "00:00") {
                totalObj.pace = this.makePace(totalObj);
            } else if (totalObj.duration === undefined 
              || totalObj.duration === null 
              || totalObj.duration === "00:00:00") {
                totalObj.duration = this.makeDuration(totalObj);
            }
            //totalObj.distance = totalObj.distance.toFixed(3);
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
            let r = Math.random() * 16 | 0, v = c == "x" ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        return uuid;
    };
    
    /**
    * @return leftpadded number ex: 2 becomes 02
    */
    this.lpad = function(num) {       
       num = "" + num;
       while(num.length < 2) {
          num = "0" + num; 
       }       
       return num.substr(num.length - 2);       
    };
};
// make nodejs export work in browser (perhaps by using Browserify)
var module = module || {exports : {}};
module.exports.Training = Training;
