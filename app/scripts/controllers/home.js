'use strict';

/**
 * @ngdoc function
 * @name oncokbStaticApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the oncokbStaticApp
 */
angular.module('oncokbStaticApp')
    .controller('HomeCtrl', function($scope, $location, $rootScope, $window,
                                     $timeout, api, _) {
        $scope.content = {
            hoveredGene: 'gets',
            hoveredCount: '',
            main: $rootScope.meta.numbers.main,
            levels: $rootScope.meta.numbers.levels,
            matchedGenes: [],
            selectedGene: ''
        };

        $scope.searchKeyUp = function(query) {
            return api.blurSearch(query)
                .then(function(resp) {
                    if (_.isObject(resp)) {
                        return resp.data;
                    } else if (_.isArray(resp)) {
                        return resp;
                    }
                }, function() {

                });
        };

        $scope.searchConfirmed = function() {
            if ($scope.content.selectedItem) {
                $location.path($scope.content.selectedItem.link);
            }
        };

        $scope.getGeneCountForLevel = function(level) {
            if ($scope.content.levels.hasOwnProperty(level)) {
                return $scope.content.levels[level].length;
            }
        };

        $rootScope.$watch('meta.numbers.main', function(n) {
            $scope.content.main = n;
        });

        $rootScope.$watch('meta.numbers.levels', function(n) {
            $scope.content.levels = n;
        });
    });
