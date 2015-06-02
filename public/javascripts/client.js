
var trainingplannerApp = angular.module("TrainingplannerApp", []);

function BaseController($rootScope, $scope) {
	$scope.selectedMenuItemName = "";
	
	$scope.handleMenuClick = function(name) {
		console.log("handleMenuClick: " + name);
		$rootScope.$broadcast("MENU_CLICK", name);
		$scope.selectedMenuItemName = name;
	};
	
	$rootScope.$on("MENU_CLICK", function(event, name) {
		console.log("MENU_CLICK: " + name);
		$scope.selectedMenuItemName = name;
	});
}

trainingplannerApp.controller("HeaderController", ["$rootScope", "$scope", function($rootScope, $scope) {
	angular.extend(this, new BaseController($rootScope, $scope));
}]);

// TODO support integer only inputs (autocomplete with ':')
// TODO support changing the order of segments up and down
// TODO deploy als 'Open Web App for Android'
trainingplannerApp.controller("CreateTrainingController", ["$rootScope", '$scope', function($rootScope, $scope) {
    angular.extend(this, new BaseController($rootScope, $scope));
    
    var emptyObj = {distance: 0, duration: "00:00:00", pace: "00:00"};
    $scope.training = new Training();
    $scope.total = {};
    $scope.notification = null;

    $scope.addEmptySegment = function() {
        console.log("createTrainingController.addEmptySegment();");
        $scope.training.addSegment(angular.copy(emptyObj));
    };

    $scope.clearTraining = function()  {
        $scope.training = new Training(angular.copy(emptyObj));
        $scope.calculateTotal();
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
    
    $rootScope.$on("SAVE_TRAINING", function(event, name) {
      localStorage.setItem(name, JSON.stringify($scope.training));
      $scope.notification = "saved training in localStorage as '" + name + '"';
    });

    $scope.addEmptySegment();
}]);

trainingplannerApp.controller("SaveTrainingDialogController", ["$rootScope", '$scope', function($rootScope, $scope) {
    angular.extend(this, new BaseController($rootScope, $scope));
    
    $scope.trainingName = "";
    
    $scope.save = function() {
      $rootScope.$broadcast("SAVE_TRAINING", $scope.trainingName);
      $rootScope.$broadcast("MENU_CLICK", "createTraining");
    };
    
    $scope.dontSave = function() {
      $scope.trainingName = "";
      $rootScope.$broadcast("MENU_CLICK", "createTraining");
    };
}]);

trainingplannerApp.controller("StoredTrainingsController", ["$rootScope", '$scope', function($rootScope, $scope) {
    angular.extend(this, new BaseController($rootScope, $scope));
    $scope.trainings = []; // TODO get from localStorage.
}]);
