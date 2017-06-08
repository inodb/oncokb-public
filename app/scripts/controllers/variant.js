'use strict';

/**
 * @ngdoc function
 * @name oncokbStaticApp.controller:VariantCtrl
 * @description
 * # VariantCtrl
 * Controller of the oncokbStaticApp
 */
angular.module('oncokbStaticApp')
    .controller('VariantCtrl', function($routeParams, $location, $rootScope,
                                        $route, $scope, api) {
        $scope.data = {
            hugoSymbol: $routeParams.geneName,
            variant: $routeParams.variant
        };
        $scope.meta = {
            tableOptions: {
                hasBootstrap: true,
                aoColumnDefs: [{
                    aTargets: 1,
                    sType: 'level-html',
                    asSorting: ['desc', 'asc']
                }, {
                    aTargets: 2,
                    sType: 'num-html',
                    asSorting: ['desc', 'asc']
                }],
                columnDefs: [],
                paging: false,
                scrollCollapse: true,
                scrollY: 500,
                sDom: 'ft',
                aaSorting: [[1, 'desc'], [0, 'asc']],
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.childRowImmediate,
                        type: '',
                        renderer: function(api, rowIdx, columns) {
                            var data = $.map(columns, function(col) {
                                return col.hidden ?
                                    '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                    '<td>' + col.title + ':</td> ' +
                                    '<td>' + col.data + '</td>' +
                                    '</tr>' :
                                    '';
                            }).join('');

                            return data ?
                                $('<table/>').append(data) :
                                false;
                        }
                    }
                }
            }
        };
        $scope.status = {};

        $scope.getNumOfRefsTreatment = function(item) {
            var numOfPmids = item.pmids.length +
                item.abstracts.length;
            return numOfPmids === 0 ? '' : (numOfPmids + (numOfPmids > 1 ? ' references' : ' reference'));
        };

        api.getNumbers('gene', $scope.data.hugoSymbol)
            .then(function(resp) {
                var content = resp.data;
                if (content) {
                    $scope.data.gene = content.gene;
                    $route.updateParams({geneName: $scope.data.gene.hugoSymbol});
                    var subNavItems = [{content: $scope.data.gene.hugoSymbol}];

                    if (content.highestLevel) {
                        $scope.meta.highestLevel = content.highestLevel.replace('LEVEL_', '');
                        $scope.status.hasLevel = true;
                    }

                    $rootScope.view.subNavItems = subNavItems;
                } else if (/[a-z]/.test($routeParams.geneName)) {
                    $location.path('/genes/' +
                        $routeParams.geneName.toUpperCase());
                } else {
                    $location.path('/genes');
                }
            }, function(error) {
                console.log('oppos error happened ', error);
            });

        api.generalSearch($scope.data.hugoSymbol, $scope.data.variant)
            .then(function(resp) {
                var content = resp.data;
                if (content) {
                    $scope.data.searchResult = content;
                } else {
                    // TODO:
                }
            });
    });
