var should = require("should");
var client = require("../public/javascripts/client");

/**
* Tests for {@link client.js}
*/
describe('Training', function(){
    describe('#total()', function() {
        it('should return an object with zeros when there is no data', function() {
            var training = new client.Training();
            var total = training.total();
            console.log("total: " + total);
            total.distance.should.equal(0);
            total.duration.should.equal("00:00:00");
            total.pace.should.equal("00:00");
        });
        it('should return an object with data on one segment', function() {
            var training = new client.Training();
            training.addSegment({distance: 16, duration: "01:10:23"});
            var total = training.total();
            //console.log("total: " + total);
            total.distance.should.equal(16);
            total.duration.should.equal("01:10:23");
            total.pace.should.equal("4:24");
        });
        it('should return an object with data on two segments', function() {
            var training = new client.Training();
            training.addSegment({distance: 16, duration: "01:10:23"});
            training.addSegment({distance: 16, duration: "00:59:02"});
            var total = training.total();
            total.distance.should.equal(32);
            total.duration.should.equal("02:09:25");
            total.pace.should.equal("4:02");
        });
        // TODO tests for calculating the third missing variable when the other two are present: distance + pace and duration + pace
    });
});
