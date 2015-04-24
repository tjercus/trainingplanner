// make require work in browser
if (typeof require === "function") {
    var moment = require("moment");
}

/**
* Model object concerning the concept of a 'Training'
* TODO support imperial units by config.
*/
var Training = function() {
    this.segments = [];

    // TODO disallow direct access to this.segments
    this.addSegment = function(obj) {
        if (!obj.uuid) {
            obj.uuid = this.createUuid();
        }
        this.segments.push(obj);
    }

    // TODO leftpad minutes
    this.makePace = function(obj) {
        var durationObj = moment.duration(obj.duration),
            seconds = durationObj.asSeconds(),
            paceObj = moment.duration(Math.round(seconds / obj.distance), "seconds");
        return paceObj.minutes() + ":" + paceObj.seconds();
    }

    /**
    * return pace * distance. ex: 5:10 * 12.93 km = 1:6:48
    */
    this.makeDuration = function(obj) {
        var paceObj = moment.duration(obj.pace),
            seconds = paceObj.asSeconds() / 60,
            totalSeconds = Math.round(seconds * obj.distance),
            durationObj = moment.duration(totalSeconds, "seconds");
            //console.log("calculated duration: " + durationObj.hours() + ":" + durationObj.minutes() + ":" + durationObj.seconds());
        return durationObj.hours() + ":" + durationObj.minutes() + ":" + durationObj.seconds();
    }

    this.total = function() {
        var totalObj = {
            distance: 0,
            duration: "00:00:00",
            pace: "00:00"
        }
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
                // writeback, is this necessary or should the view be re-rendered with force?
                console.log("segment: " + this.segments[i].pace);
                //this.segments[i] = obj;

                totalObj.distance += parseInt(obj.distance);
                // add duration
                var totalDurationObj = moment.duration(totalObj.duration).add(obj.duration);
                // TODO leftpad with zeros
                totalObj.duration = totalDurationObj.hours() + ":" + totalDurationObj.minutes() + ":" + totalDurationObj.seconds();
                //console.log("obj: " + obj.pace + ", " + obj.duration + ", " + obj.distance);
            }
            if (totalObj.pace === undefined || totalObj.pace === null || totalObj.pace === "00:00") {
                totalObj.pace = this.makePace(totalObj);
            } else if (totalObj.duration === undefined || totalObj.duration === null || totalObj.duration === "00:00:00") {
                totalObj.duration = this.makeDuration(totalObj);
            }
            return totalObj;
        }
    }

    // TODO create UUID object as a separate module and include it as a module
    this.createUuid = function() {
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        return uuid;
    }
}
// make export work in browser (perhaps by using Browserify)
if (typeof module === "function" && typeof module.exports === "function") {
    module.exports.Training = Training;
}
