var should = require("should");
var client = require("../public/javascripts/training");

/**
* Tests for {@link client.js}
* These tests use the nodejs 'require' function.
* Run with cli: 'mocha' or 'npm test'
*/
describe('Training', function() {
    console.dir(client);
    describe('#total()', function() {
        it('should return an object with zeros when there is no data', function() {
            var training = new client.Training();
            var total = training.total();
            console.log("total: " + total);
            total.distance.should.equal(0);
            total.duration.should.equal("00:00:00");
            total.pace.should.equal("00:00");
        });
        describe("pace calculation", function() {
            it('should return an object with complete data on one segment', function() {
                var training = new client.Training();
                training.addSegment({distance: 16, duration: "01:10:23"});
                var total = training.total();
                //console.log("total: " + total);
                total.distance.should.equal(16);
                total.duration.should.equal("1:10:23");
                total.pace.should.equal("4:24");
            });
            it('should return an object with complete data on two segments', function() {
                var training = new client.Training();
                training.addSegment({distance: 16, duration: "01:10:23"});
                training.addSegment({distance: 16, duration: "00:59:02"});
                var total = training.total();
                total.distance.should.equal(32);
                total.duration.should.equal("2:9:25");
                total.pace.should.equal("4:3");
            });
            describe("with two digit decimal precision distances", function() {
                it('should return an object with complete data with on two segments', function() {
                    var training = new client.Training();
                    training.addSegment({distance: 1.08, duration: "00:07:43"});
                    training.addSegment({distance: 4.64, duration: "00:28:04"});
                    var total = training.total();
                    total.distance.should.equal(5.72);
                    // TODO use the right values
                    //total.duration.should.equal("2:9:25");
                    //total.pace.should.equal("4:3");
                });
            });
        });
        describe("duration calculation", function() {
            it('should return an object with complete data on one segment', function() {
                var training = new client.Training();
                training.addSegment({distance: 12.93, pace: "5:10"});
                var total = training.total();
                total.duration.should.equal("1:6:48");
            });
        });
        // TODO multiple segments with duration missing

        // TODO optional: multiple mixed missing variables per segment.
    });
});
