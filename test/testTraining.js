var should = require("should");
var trainingModule = require("../public/javascripts/training");

/**
 * Tests for {@link training.js}
 * These tests use the nodejs 'require' function.
 * Run with cli: 'mocha' or 'npm test'
 */
describe('Training', function() {
      //console.dir(trainingModule.Training);
      describe('#makeDistance()', function() {
        it('should calculate distance based on duration and pace', function() {
          var training = new trainingModule.Training();
          var segment = {
            duration: "01:02:23",
            pace: "03:53"
          };
          var distance = training.makeDistance(segment);
          distance.should.equal(16.064377682403432);
        });
      });
      describe('#total()', function() {
        it('should return an object with zeros when there is no data', function() {
            var training = new trainingModule.Training();
            var total = training.total();            
            total.distance.should.equal(0);
            total.duration.should.equal("00:00:00");
            total.pace.should.equal("00:00");
          });
          describe("pace calculation", function() {
            it('should return an object with complete data on one segment', function() {
              var training = new trainingModule.Training();
              training.addSegment({
                distance: 16,
                duration: "01:10:23"
              });
              var total = training.total();              
              total.distance.should.equal(16.000);
              total.duration.should.equal("01:10:23");
              total.pace.should.equal("04:24");
            });
            it('should return an object with complete data on two segments', function() {
              var training = new trainingModule.Training();
              training.addSegment({
                distance: 16,
                duration: "01:10:23"
              });
              training.addSegment({
                distance: 16,
                duration: "00:59:02"
              });
              var total = training.total();
              total.distance.should.equal(32.000);
              total.duration.should.equal("02:09:25");
              total.pace.should.equal("04:03");
            });
            describe("with three digit decimal precision distances", function() {
              it('should return an object with complete data with on two segments', function() {
                var training = new trainingModule.Training();
                training.addSegment({
                  distance: 1.08,
                  duration: "00:07:43"
                });
                training.addSegment({
                  distance: 4.64,
                  duration: "00:28:04"
                });
                var total = training.total();
                total.distance.should.equal(5.720);
                total.duration.should.equal("00:35:47");
                total.pace.should.equal("06:15");
              });
            });
          });
          describe("duration calculation", function() {
            it('should return an object with complete data on one segment', function() {
              var training = new trainingModule.Training();
              training.addSegment({
                distance: 12.930,
                pace: "05:10"
              });
              var total = training.total();
              total.duration.should.equal("01:06:48");
            });
            it('should return an object with complete data on two segments', function() {
              var training = new trainingModule.Training();
              training.addSegment({
                distance: 12.930,
                pace: "04:10"
              });
              training.addSegment({
                distance: 11.042,
                pace: "02:59"
              });
              var total = training.total();
              total.duration.should.equal("01:26:50");
            });
            describe("two segments with mixed missing data", function() {
              it('should return an object with complete data on two segments', function() {
                var training = new trainingModule.Training();
                training.addSegment({
                  distance: 12.930,
                  pace: "04:10"
                });
                training.addSegment({
                  duration: "00:58:12",
                  pace: "02:59"
                });
                var total = training.total();
                total.duration.should.equal("01:52:05");
              });
            });
          });
        });
      });