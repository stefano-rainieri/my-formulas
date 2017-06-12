// angular.module is a global place for creating, registering and retrieving Angular modules
// 'my-formulas' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('my-formulas', ['ionic'])

    // This factory allow to load and save formulas
    // from / to local storage
    .factory('Formulas', function () {
        return {

            /**
             * @description Get all formulas on local storage
             * @return {*}
             */
            all: function () {
                var formulas = window.localStorage['formulas'];
                return formulas ? angular.fromJson(formulas) : [];
            },

            /**
             * @description Save all formulas
             * @param {*} formulas
             */
            save: function (formulas) {
                window.localStorage['formulas'] = angular.toJson(formulas);
            },

            /**
             * @description Create formula object
             * @param {string} title
             * @return {{id: *, title: string, elements: Array}}
             */
            create: function (title) {
                return {
                    id: new Date().valueOf(),
                    title: title,
                    elements: []
                }
            },

            /**
             * @description Get the index of last active formula object
             * @return {Number|number}
             */
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveFormula']) || 0;
            },

            /**
             * @description Set the index of last active formula object
             * @param {int} index
             */
            setLastActiveIndex: function (index) {
                window.localStorage['lastActiveFormula'] = index;
            }
        }
    })

    // This controller allow to add and remove elements to a specific formula
    // and manage formulas with the proper factory
    .controller('ElementsCtrl', function ($scope, $timeout, $ionicModal, Formulas, $ionicSideMenuDelegate) {

        /**
         * @param {string} title
         * @private
         */
        var _createFormula = function (title) {
            var formula = Formulas.create(title);
            $scope.formulas.push(formula);

            Formulas.save($scope.formulas);
            $scope.selectFormula(formula, $scope.formulas.length - 1);
        };

        /**
         * @description Initialize toggle formula deletion
         */
        $scope.shouldShowDelete = false;

        /**
         * @description Load / initialize formulas
         */
        $scope.formulas = Formulas.all();

        /**
         * @description Set the active formula
         */
        $scope.activeFormula = $scope.formulas[Formulas.getLastActiveIndex()];

        /**
         * @description Create a formula
         */
        $scope.newFormula = function () {
            var title = prompt('Your brand new secret formula is: ');

            if (title) {
                _createFormula(title);
            }
        };

        /**
         * @description Delete the selected formula
         * @param {{id: int, title: string, elements: Array}} formula
         */
        $scope.deleteFormula = function (formula) {
            var wereActive = formula === $scope.activeFormula;

            $scope.formulas.splice($scope.formulas.indexOf(formula), 1);
            Formulas.save($scope.formulas);

            if (wereActive) {
                $scope.activeFormula = $scope.formulas[0];
                Formulas.setLastActiveIndex(0);
            }

            
        };

        /**
         * @description Choose a formula and close left menu
         * @param {{id: int, title: string, elements: Array}} formula
         * @param {int} index
         */
        $scope.selectFormula = function (formula, index) {
            $scope.activeFormula = formula;
            Formulas.setLastActiveIndex(index);

            $ionicSideMenuDelegate.toggleLeft(false);
        };

        /**
         * @description Load modal new-element
         */
        $ionicModal.fromTemplateUrl('new-element.html', function (modal) {
            $scope.elementModal = modal;
        }, {
            scope: $scope
        });

        /**
         * @description Submit form
         * @param {{name: string, color: string, qty: int}} element
         */
        $scope.addElement = function (element) {
            if (!$scope.activeFormula || !element) {
                return;
            }

            $scope.activeFormula.elements.push({
                id: new Date().valueOf(),
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

        /**
         * @description Delete an item of the active formula
         * @param {Number} id
         */
        $scope.deleteElement = function (id) {
            if (!$scope.activeFormula) {
                return;
            }

            $scope.activeFormula.elements = _.reject($scope.activeFormula.elements, function (element) {
                return element.id === id;
            });

            Formulas.save($scope.formulas);
        };

        /**
         * @description Show modal
         */
        $scope.newElement = function () {
            $scope.elementModal.show();
        };

        /**
         * @description Hide modal
         */
        $scope.closeNewElement = function () {
            $scope.elementModal.hide();
        };

        /**
         * @description Open left menu
         */
        $scope.toggleFormulas = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        /**
         * @description Purpose an unlimited timeout prompt to add the first formula if there's no one
         */
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
        }, 1000);
    })

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
