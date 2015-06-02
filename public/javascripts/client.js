
var trainingplannerApp = angular.module("TrainingplannerApp", []);

function BaseController($rootScope, $scope) {
	$scope.selectedMenuItemName = "";

	$rootScope.$on("MENU_CLICK", function(event, name) {
		console.log("MENU_CLICK: " + name);
		$scope.selectedMenuItemName = name;
	});
}

trainingplannerApp.controller("headerController", ["$rootScope", "$scope", function($rootScope, $scope) {
    
	$scope.handleMenuClick = function(name) {
		console.log("handleMenuClick: " + name);
		$rootScope.$broadcast("MENU_CLICK", name);
		$scope.selectedMenuItemName = name;
	};
}]);

// TODO support integer only inputs (autocomplete with ':')
// TODO support changing the order of segments up and down
// TODO deploy als 'Open Web App for Android'
trainingplannerApp.controller("CreateTrainingController", ["$rootScope", '$scope', function($rootScope, $scope) {
    var emptyObj = {distance: 0, duration: "00:00:00", pace: "00:00"};
    $scope.training = new Training();
    $scope.total = {};
    
    angular.extend(this, new BaseController($rootScope, $scope));

    $scope.addEmptySegment = function() {
        console.log("createTrainingController.addEmptySegment();");
        $scope.training.addSegment(angular.copy(emptyObj));
    };

    $scope.clearTraining = function()  {
        $scope.training = new Training(angular.copy(emptyObj));
        $scope.calculateTotal();
    };
    
    $scope.saveTraining = function()  {
        // TODO switch to dialog where user is asked to provide a name for the training
    };

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
    };
    
    /* TODO make really private */
    
    $scope.calculateTotal = function() {
        // TODO perhaps make 'total' a public field on 'training' so it gets automatically recalculated when segments array is accessed
        $scope.total = $scope.training.total();
    };

    $scope.addEmptySegment();
}]);

trainingplannerApp.controller("StoredTrainingsController", ["$rootScope", '$scope', function($rootScope, $scope) {
    
    angular.extend(this, new BaseController($rootScope, $scope));    
}]);
