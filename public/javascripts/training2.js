"use strict";
//const moment:moment.MomentStatic = (<any>moment_)['default'] || moment_;
var PaddedNumber = (function () {
    function PaddedNumber(nr) {
        this.padded = this.lpad(nr);
    }
    Object.defineProperty(PaddedNumber.prototype, "padded", {
        get: function () {
            return this.padded;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return leftpadded number ex: 2 becomes 02
     */
    PaddedNumber.prototype.lpad = function (nr) {
        var num = "" + nr;
        while (num.length < 2) {
            num = "0" + num;
        }
        return num.substr(num.length - 2);
    };
    return PaddedNumber;
})();
var UUID = (function () {
    function UUID() {
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        this.uuidStr = uuid;
    }
    UUID.prototype.toString = function () {
        return this.uuidStr;
    };
    return UUID;
})();
var Duration = (function () {
    function Duration(durationStr) {
        this.durationStr = durationStr;
    }
    /**
     * @return hh:mm:ss String
     */
    Duration.prototype.formatDuration = function (obj) {
        return lpad(obj.hours()) + ":" + lpad(obj.minutes()) + ":" + lpad(obj.seconds());
    };
    return Duration;
})();
var Pace = (function () {
    function Pace(paceStr) {
        this.paceStr = paceStr;
    }
    return Pace;
})();
var Segment = (function () {
    function Segment(distance, duration, pace) {
        this.distance = distance;
        this.duration = duration;
        this.pace = pace;
        this.uuid = new UUID();
    }
    Object.defineProperty(Segment.prototype, "distance", {
        set: function (distance) {
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return mm:ss String
     */
    Segment.prototype.makePace = function (obj) {
        var durationObj = moment.duration(obj.duration), seconds = durationObj.asSeconds(), paceObj = moment.duration(Math.round(seconds / obj.distance), "seconds");
        return new Pace(lpad(paceObj.minutes()) + ":" + lpad(paceObj.seconds()));
    };
    ;
    /**
     * @return hh:mm:ss String as: pace * distance. ex: 5:10 * 12.93 km = 1:6:48
     */
    Segment.prototype.makeDuration = function (obj) {
        var paceObj = moment.duration(obj.pace), seconds = paceObj.asSeconds() / 60, totalSeconds = Math.round(seconds * obj.distance), durationObj = moment.duration(totalSeconds, "seconds");
        return new Duration(formatDuration(durationObj));
    };
    ;
    /**
     * @return float calculated distance based on duration / pace
     */
    Segment.prototype.makeDistance = function (obj) {
        var paceObj = moment.duration(obj.pace), durationObj = moment.duration(obj.duration), durationSeconds = durationObj.asSeconds(), paceSeconds = paceObj.asSeconds() / 60;
        return new Number(durationSeconds / paceSeconds);
    };
    return Segment;
})();
/**
 * Model object concerning the concept of a "Training"
 * TODO support imperial units by config.
 */
var Training = (function () {
    function Training(training) {
        var _this = this;
        if (training) {
            this.segments = training.segments;
            this.segments.forEach(function (segment) {
                _this.augmentSegmentData(segment);
            });
            this.name = training.name;
        }
        else {
            this.segments = [];
            this.name = "new training";
        }
    }
    Training.prototype.addSegment = function (obj, overwriteUuid) {
        if (!obj.uuid || overwriteUuid == true) {
            obj.uuid = new UUID();
        }
        augmentSegmentData(obj);
        this.segments.push(obj);
    };
    Training.prototype.updateSegment = function (obj) {
        var _this = this;
        augmentSegmentData(obj);
        var i = 0;
        this.segments.forEach(function (segment) {
            if (segment.uuid === obj.uuid) {
                _this.segments[i] = obj;
            }
            i++;
        });
    };
    Training.prototype.removeSegment = function (obj) {
        var _this = this;
        var i = 0;
        this.segments.forEach(function (segment) {
            if (segment.uuid === obj.uuid) {
                _this.segments.splice(i, 1);
            }
            i++;
        });
    };
    Training.prototype.augmentSegmentData = function (obj) {
        if (obj.duration === undefined || obj.duration === "00:00:00") {
            obj.duration = makeDuration(obj);
        }
        if (obj.pace === undefined || obj.pace === "00:00") {
            obj.pace = makePace(obj);
        }
        if (obj.distance === undefined || obj.distance === 0) {
            obj.distance = makeDistance(obj);
        }
    };
    /**
     * @return Object
     */
    Training.prototype.total = function () {
        var totalObj = {
            distance: new Number(0),
            duration: "00:00:00",
            pace: "00:00"
        };
        if (this.segments.length === 0) {
            return totalObj;
        }
        else {
            console.log(JSON.stringify(this.segments[0]));
            this.segments.forEach(function (segment) {
                totalObj.distance += parseFloat(segment.distance);
                var totalDurationObj = moment.duration(totalObj.duration).add(segment.duration);
                totalObj.duration = formatDuration(totalDurationObj);
            });
            if (totalObj.pace === undefined || totalObj.pace === null || totalObj.pace === "00:00") {
                totalObj.pace = makePace(totalObj);
            }
            else if (totalObj.duration === undefined || totalObj.duration === null || totalObj.duration === "00:00:00") {
                totalObj.duration = makeDuration(totalObj);
            }
            totalObj.distance = totalObj.distance;
            return totalObj;
        }
    };
    return Training;
})();
// make nodejs export work in browser (perhaps by using Browserify)
var module = module || {
    exports: {}
};
module.exports.Training = Training;
