
var moment = require("moment");

var Training = function() {
    this.segments = [];

    this.addSegment = function(obj) {
        this.segments.push(obj);
    }

    // TODO leftpad minutes
    this.makePace = function(obj) {
        var durationObj = moment.duration(obj.duration),
            seconds = durationObj.asSeconds(),
            paceObj = moment.duration(Math.ceil(seconds / obj.distance), "seconds");
        return paceObj.minutes() + ":" + paceObj.seconds();
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
                console.log("obj: " + obj);
                totalObj.distance += parseInt(obj.distance);
                // add duration
                var totalDurationObj = moment.duration(totalObj.duration).add(obj.duration);
                // TODO leftpad with zeros
                totalObj.duration = totalDurationObj.hours() + ":" + totalDurationObj.minutes() + ":" + totalDurationObj.seconds();
            }
            totalObj.pace = this.makePace(totalObj);
            return totalObj;
        }
    }
}
module.exports.Training = Training;
