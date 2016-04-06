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
    
    var emptyObj = {distance: 0, duration: "00:00:00", pace: "00:00", lapPace: "00:00"};
    $scope.training = new Training();
    $scope.total = {};
    $scope.notification = null;
    // TODO make settings updatable via settings panel
    $scope.paces = [
      {"1.6KP": "3:15"},         
      {"3KP": "3:24"},
      {"5KP": "3:35"},
      {"10KP": "3:42"},
      {"SPEED": "3:42"},
      {"16KP": "3:50"},
      {"VVLT": "3:50"},
      {"21KP": "3:55"},
      {"STRENGTH": "4:04"},
      {"MP": "4:10"},
      {"MP+5%": "4:23"},
      {"MP+10%": "4:35"},
      {"MP+15%": "4:47"},
      {"MP+20%": "5:00"},
      {"RECOV1": "5:10"},
      {"RECOV2": "5:30"}
    ];

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
    $scope.trainings = trainings;
    
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

trainingplannerApp.controller("SettingsController", ["$rootScope", '$scope', function($rootScope, $scope) {
    angular.extend(this, new BaseController($rootScope, $scope));    
}]);

trainingplannerApp.run(function($rootScope) {
    //$rootScope.$broadcast("MENU_CLICK", "createTraining");
    console.log("run phase");
});