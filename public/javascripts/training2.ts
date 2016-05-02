"use strict";

/// <reference path="moment/moment.d.ts" />

// make nodejs require work in browser
//if (typeof require === "function") {
  //import moment = require("moment");
//}

//import moment = require('node_modules/moment/moment');
//import { moment } from "./node_modules/moment/moment";
import moment_ from './moment';
//const moment:moment.MomentStatic = (<any>moment_)['default'] || moment_;

class PaddedNumber {  
  constructor(nr: number) {
     this.padded = this.lpad(nr);
  }

  public get padded(): string {
    return this.padded;
  }

  /**
   * @return leftpadded number ex: 2 becomes 02
   */
  private lpad(nr: number) {
    let num: string = "" + nr;
    while (num.length < 2) {
      num = "0" + num;
    }
    return num.substr(num.length - 2);
  } 
}

class UUID {
  private uuidStr:string;

  constructor() {
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0,
        v = c == "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    this.uuidStr = uuid;
  }

  public toString():string {
    return this.uuidStr;
  }
}

class Duration {
  constructor(private durationStr:string) {}

  /**    
   * @return hh:mm:ss String
   */
  private formatDuration(obj): string {
    return lpad(obj.hours()) + ":" + lpad(obj.minutes()) + ":" + lpad(obj.seconds());
  }
}

class Pace {
  constructor(private paceStr:string) {}
}

class Segment {
  private uuid: UUID;
  
  constructor(private distance: number, private duration: Duration, private pace: Pace) {
    this.uuid = new UUID();
  }

  set distance(distance: number): void {

  }

  /**
   * @return mm:ss String
   */
  private makePace(obj): Pace {
    let durationObj = moment.duration(obj.duration),
      seconds = durationObj.asSeconds(),
      paceObj = moment.duration(Math.round(seconds / obj.distance), "seconds");
    return new Pace(lpad(paceObj.minutes()) + ":" + lpad(paceObj.seconds()));
  };

  /**    
   * @return hh:mm:ss String as: pace * distance. ex: 5:10 * 12.93 km = 1:6:48
   */
  private makeDuration(obj): Duration {
    let paceObj = moment.duration(obj.pace),
      seconds = paceObj.asSeconds() / 60,
      totalSeconds = Math.round(seconds * obj.distance),
      durationObj = moment.duration(totalSeconds, "seconds");
    return new Duration(formatDuration(durationObj));
  };

  /**
   * @return float calculated distance based on duration / pace
   */
  private makeDistance(obj): Number {
    let paceObj = moment.duration(obj.pace),
      durationObj = moment.duration(obj.duration),
      durationSeconds = durationObj.asSeconds(),
      paceSeconds = paceObj.asSeconds() / 60;      
    return new Number(durationSeconds / paceSeconds);
  }
}

/**
 * Model object concerning the concept of a "Training"
 * TODO support imperial units by config.
 */
class Training {

  private segments:Array<Segment>;
  private name: string;

  constructor(training) {
    if (training) {
      this.segments = training.segments;
      this.segments.forEach((segment) => {
        this.augmentSegmentData(segment);
      });
      this.name = training.name;
    } else {
      this.segments = [];
      this.name = "new training";
    }
  }
  
  public addSegment(obj, overwriteUuid): void {
    if (!obj.uuid || overwriteUuid == true) {      
      obj.uuid = new UUID();
    }
    augmentSegmentData(obj);
    this.segments.push(obj);
  }

  public updateSegment(obj): void {
    augmentSegmentData(obj);
    let i = 0;
    this.segments.forEach((segment) => {
      if (segment.uuid === obj.uuid) {        
        this.segments[i] = obj;        
      }
      i++;
    });    
  }

  public removeSegment(obj): void {
    let i = 0;
    this.segments.forEach((segment) => {
      if (segment.uuid === obj.uuid) {
        this.segments.splice(i, 1);
      }
      i++;
    });
  }

 

  private augmentSegmentData(obj) {
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
   * @return Object
   */
  public total() {
    let totalObj = {
      distance: new Number(0),
      duration: "00:00:00",
      pace: "00:00"
    }
    if (this.segments.length === 0) {
      return totalObj;
    } else {
      console.log(JSON.stringify(this.segments[0]));
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
  }
}

// make nodejs export work in browser (perhaps by using Browserify)
var module = module || {
  exports: {}
};
module.exports.Training = Training;