// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

// This factory allow to load and save formulas from / to local storage
.factory('Formulas', function () {
  return {

    all: function () {
      var formulas = window.localStorage['formulas'];
      return formulas ? angular.fromJson(formulas) : [];
    },

    save: function(formulas) {
      window.localStorage['formulas'] = angular.toJson(formulas);
    },

    create: function (title) {
      return {
        title: title,
        elements: []
      }
    },

    getLastActiveIndex: function () {
      return parseInt(window.localStorage['lastActiveFormula']) || 0;
    },

    setLastActiveIndex: function (index) {
      window.localStorage['lastActiveFormula'] = index;
    }
  }
})

// This controller allow to add and remove elements to a specific formula
// and manage formulas with the proper factory
.controller('ElementsCtrl', function ($scope, $timeout, $ionicModal, Formulas, $ionicSideMenuDelegate) {

  var _createFormula = function (title) {
    var formula = Formulas.create(title);
    $scope.formulas.push(formula);

    Formulas.save($scope.formulas);
    $scope.selectFormula(formula, $scope.formulas.length - 1);
  };

  // Load / initialize formulas
  $scope.formulas = Formulas.all();

  // Set the active formula
  $scope.activeFormula = $scope.formulas[Formulas.getLastActiveIndex()];

  // Create a formula
  $scope.newFormula = function () {
    console.log('annannata');
    var title = prompt('Your brand new secret formula is: ');

    if (title) {
      _createFormula(title);
    }
  };

  // Choose a formula and close left menu
  $scope.selectFormula = function (formula, index) {
    $scope.activeFormula = formula;
    Formulas.setLastActiveIndex(index);

    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Load modal new-element
  $ionicModal.fromTemplateUrl('new-element.html', function (modal) {
      $scope.elementModal = modal;
    }, {
      scope: $scope
  });

  // Submit form
  $scope.addElement = function (element) {
    if (!$scope.activeFormula || !element) {
      return;
    }

    $scope.activeFormula.elements.push({
      name: element.name,
      color: element.color,
      qty: element.qty
    });

    $scope.elementModal.hide();
    Formulas.save($scope.formulas);

    element.name = '';
    element.color = 'stable';
    element.qty = null;
  };

  // Show modal
  $scope.newElement = function () {
    $scope.elementModal.show();
  };

  // Hide modal
  $scope.closeNewElement = function () {
    $scope.elementModal.hide();
  };

  // Open left menu
  $scope.toggleFormulas = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Purpose an unlimited timeout prompt to add the first formula if there's no one.
  $timeout(function () {
    if (0 < $scope.formulas.length) {
      return;
    }

    var title = null;
    while (!title) {
      title = prompt('Your FIRST brand new secret formula is: ');

      if (title) {
        _createFormula(title);
      }
    }
  }, 1000)
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
