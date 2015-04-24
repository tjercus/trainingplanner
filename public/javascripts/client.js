
var trainingplannerApp = angular.module("TrainingplannerApp", []);

// TODO support integer only inputs (autocomplete with ':')
// TODO support changing the order of segments up and down
// TODO deploy als 'Open Web App for Android'
trainingplannerApp.controller('CreateTrainingController', ['$scope', function($scope) {
    var emptyObj = {distance: 0, duration: "00:00:00", pace: "00:00"};
    $scope.training = new Training();
    $scope.total = {};

    $scope.addEmptySegment = function() {
        console.log("createTrainingController.addEmptySegment();");
        $scope.training.addSegment(angular.copy(emptyObj));
    }

    $scope.calculateTotal = function() {
        // TODO perhaps make 'total' a public field on 'training' so it gets automatically recalculated when segments array is accessed
        $scope.total = $scope.training.total();
    }

    $scope.clearTraining = function()  {
        $scope.training = new Training(angular.copy(emptyObj));
        $scope.total = $scope.training.total();
    }

    /**
    * recalculate by nullifying the inverse value (duration versus pace) to re-calulate the other
    * TODO ask user which value should be calculated?
    * TODO move this into Training object
    */
    $scope.valueChanged = function(segment, propertyname) {
        if (propertyname === "pace") {
            segment.duration = 0;
        }
        if (propertyname === "duration") {
            segment.pace = "00:00";
        }
        $scope.calculateTotal();
    }

    $scope.addEmptySegment();
}]);
