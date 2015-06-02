
// make require work in browser
if (typeof require === "function") {
    var moment = require("moment");	
} 

/**
* Model object concerning the concept of a 'Training'
* TODO support imperial units by config.
* TODO distance math rounding on two decimals is too coarse
*/
var Training = function() {
    this.segments = [];

    // TODO disallow direct access to this.segments
    this.addSegment = function(obj) {
        if (!obj.uuid) {
            obj.uuid = this.createUuid();
        }
        this.segments.push(obj);
    };
    
    /**
    * @return mm:ss String
    */
    this.makePace = function(obj) {
        var durationObj = moment.duration(obj.duration),
            seconds = durationObj.asSeconds(),
            paceObj = moment.duration(Math.round(seconds / obj.distance), "seconds");
        return this.lpad(paceObj.minutes()) + ":" + this.lpad(paceObj.seconds());
    };

    /**    
    * @return hh:mm:ss String as: pace * distance. ex: 5:10 * 12.93 km = 1:6:48
    */
    this.makeDuration = function(obj) {
        var paceObj = moment.duration(obj.pace),
            seconds = paceObj.asSeconds() / 60,
            totalSeconds = Math.round(seconds * obj.distance),
            durationObj = moment.duration(totalSeconds, "seconds");
            //console.log("calculated duration: " + durationObj.hours() + ":" + durationObj.minutes() + ":" + durationObj.seconds());
        return this.lpad(durationObj.hours()) + ":" + this.lpad(durationObj.minutes()) + ":" + this.lpad(durationObj.seconds());
    };

    /**
    * @return Object
    */
    this.total = function() {
        var totalObj = {
            distance: 0,
            duration: "00:00:00",
            pace: "00:00"
        };
        if (this.segments.length === 0) {
            return totalObj;
        } else {
            //var obj = this.segments[0];
            console.log("segments: " + this.segments.length);
            for (var i = 0, len = this.segments.length; i < len; i++) {
                // add distance
                var obj = this.segments[i];
                if (obj.duration === undefined || obj.duration === 0) {
                    obj.duration = this.makeDuration(obj);
                }
                if (obj.pace === undefined || obj.pace === "00:00") {
                    obj.pace = this.makePace(obj);
                }                
                totalObj.distance += parseFloat(obj.distance);
                // add duration
                var totalDurationObj = moment.duration(totalObj.duration).add(obj.duration);                
                totalObj.duration = this.lpad(totalDurationObj.hours()) 
                   + ":" + this.lpad(totalDurationObj.minutes()) 
                   + ":" + this.lpad(totalDurationObj.seconds());
            }
            if (totalObj.pace === undefined || totalObj.pace === null || totalObj.pace === "00:00") {
                totalObj.pace = this.makePace(totalObj);
            } else if (totalObj.duration === undefined || totalObj.duration === null || totalObj.duration === "00:00:00") {
                totalObj.duration = this.makeDuration(totalObj);
            }
            totalObj.distance = totalObj.distance.toFixed(2);            
            return totalObj;
        }
    };
    
    /**
    * TODO create UUID object as a separate module and include it as a module
    * @return uuid as String
    */
    this.createUuid = function() {
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        return uuid;
    };
    
    /**
    * @return leftpadded number ex: 2 becomes 02
    */
    this.lpad = function(num) {       
       num = '' + num;
       while(num.length < 2) {
          num = '0' + num; 
       }       
       return num.substr(num.length - 2);       
    };
};
// make export work in browser (perhaps by using Browserify)
if (typeof module === "function" && typeof module.exports === "function") {
    console.log("module is available for export");
    module.exports.Training = Training;
}
