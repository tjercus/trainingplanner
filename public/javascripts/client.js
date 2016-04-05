"use strict";

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
        $scope.training.addSegment(angular.copy(emptyObj), false);        
    };

    $scope.cloneSegment = function(segment) {
        console.log("createTrainingController.cloneSegment(segment);");
        $scope.training.addSegment(angular.copy(segment), true);
        $scope.calculateTotal();
    };

    $scope.removeSegment = function(segment) {
      $scope.training.removeSegment(segment);
      $scope.calculateTotal();
    }

    $scope.clearTraining = function()  {        
        $scope.training = new Training();
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
    
    $rootScope.$on("POPULATE_FORM", function(event, json) {
        console.log("populate: " + json);
        var training = JSON.parse(json);
        $scope.training = new Training(training);
        $scope.calculateTotal();
    });

    $scope.addEmptySegment();
}]);

trainingplannerApp.controller("SaveTrainingDialogController", ["$rootScope", '$scope', function($rootScope, $scope) {
    angular.extend(this, new BaseController($rootScope, $scope));
    
    // TODO show name when a training was previously saved and loaded
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
    $scope.trainings = [
      new Training({
        name: "Hansons strength 1, 6 x 1m",
        segments: [
          {uuid: "1", distance: 2.000, duration: "00:13:00"},
          {uuid: "2", distance: 1.601, duration: "00:06:30"},
          {uuid: "3", distance: 0.400, duration: "00:02:20"},
          {uuid: "4", distance: 1.601, duration: "00:06:30"},
          {uuid: "5", distance: 0.400, duration: "00:02:20"},
          {uuid: "6", distance: 1.601, duration: "00:06:30"},
          {uuid: "7", distance: 0.400, duration: "00:02:20"},
          {uuid: "8", distance: 1.601, duration: "00:06:30"},
          {uuid: "9", distance: 0.400, duration: "00:02:20"},
          {uuid: "10", distance: 1.601, duration: "00:06:30"},
          {uuid: "11", distance: 0.400, duration: "00:02:20"},
          {uuid: "12", distance: 1.601, duration: "00:06:30"},
          {uuid: "13", distance: 2.000, duration: "00:14:00"}
        ]
      }),
      new Training({name: "Mona fartlek", segments: []}),
    ];
    
    /*
    // TODO refresh instead of loading just once
    for (var i = 0, len = localStorage.length; i < len; i++) {
      var obj = {};
      obj.name = localStorage.key(i);
      console.log("name: " + obj.name);
      console.log("storage: " + localStorage.getItem(obj));
      if (localStorage.getItem(obj) === null) {
        $rootScope.$broadcast("POPULATE_FORM_ERR_EVT", "object in localStorage is broken");
      } else {
        obj.training = JSON.parse(localStorage.getItem(obj.name));
        $scope.trainings.push(obj);
      }
    }
    */
    
    $scope.loadInForm = function(training) {      
      $rootScope.$broadcast("POPULATE_FORM", JSON.stringify(training));
      $rootScope.$broadcast("MENU_CLICK", "createTraining");
    }
}]);

trainingplannerApp.run(function($rootScope) {
    //$rootScope.$broadcast("MENU_CLICK", "createTraining");
    console.log("run phase");
});