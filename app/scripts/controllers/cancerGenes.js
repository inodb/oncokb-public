/**
 * Created by jiaojiao on 6/12/17.
 */
'use strict';

/**
 * @ngdoc function
 * @name oncokbStaticApp.controller:CancerGenesCtrl
 * @description
 * # CancerGenesCtrl
 * Controller of the oncokbStaticApp
 */
angular.module('oncokbStaticApp')
    .controller('CancerGenesCtrl', function($scope, _, api, $q, apiLink) {
        // DataTable initialization & options
        $scope.dt = {};
        $scope.dt.dtOptions = {
            paging: true,
            hasBootstrap: true,
            language: {
                loadingRecords: '<img src="resources/images/loader.gif">'
            },
            pageLength: 15,
            lengthMenu: [[15, 30, 50, 100, -1], [15, 30, 50, 100, 'All']],
            pagingType: 'numbers',
            aaSorting: [[9, 'desc'], [0, 'asc'], [1, 'desc']],
            columns: [
                {type: 'html', orderSequence: ['asc', 'desc']},
                {type: 'html', orderSequence: ['desc', 'asc']},
                {type: 'string', orderSequence: ['desc', 'asc']},
                {type: 'string', orderSequence: ['desc', 'asc']},
                {type: 'string', orderSequence: ['desc', 'asc']},
                {type: 'string', orderSequence: ['desc', 'asc']},
                {type: 'string', orderSequence: ['desc', 'asc']},
                {type: 'string', orderSequence: ['desc', 'asc']},
                {type: 'string', orderSequence: ['desc', 'asc']},
                {type: 'number', orderSequence: ['desc', 'asc']}
            ],
            responsive: true
        };

        function displayConvert(obj, keys) {
            _.each(keys, function(key) {
                obj[key] = obj[key] === true ? 'Yes' : 'No';
            });
            return obj;
        }

        $scope.fetchedDate = '05/30/2017';
        $scope.doneLoading = false;
        $scope.columnOrder = ['mSKImpact', 'mSKHeme', 'foundation', 'foundationHeme', 'vogelstein', 'sangerCGC'];

        $q.all([api.getGenes(), api.getCancerGeneList()]).then(function(result) {
            var geneTypeMapping = {};
            _.each(result[0].data, function(gene) {
                if (gene.oncogene) {
                    if (gene.tsg) {
                        geneTypeMapping[gene.hugoSymbol] = 'Both';
                    } else {
                        geneTypeMapping[gene.hugoSymbol] = 'Oncogene';
                    }
                } else if (gene.tsg) {
                    geneTypeMapping[gene.hugoSymbol] = 'TSG';
                }
            });
            var tempData = result[1].data;
            _.each(tempData, function(item) {
                item = displayConvert(item, ['oncokbAnnotated', 'foundation', 'foundationHeme', 'mSKImpact', 'mSKHeme', 'vogelstein', 'sangerCGC']);
                switch (geneTypeMapping[item.hugoSymbol]) {
                case 'Oncogene':
                    item.oncogene = 'Yes';
                    break;
                case 'TSG':
                    item.tsg = 'Yes';
                    break;
                case 'Both':
                    item.oncogene = 'Yes';
                    item.tsg = 'Yes';
                    break;
                default:
                    break;
                }
            });
            $scope.cancerGeneList = tempData;
            $scope.doneLoading = true;
        }, function(error) {
            $scope.cancerGeneList = [];
            $scope.doneLoading = true;
        });
        $scope.apiLink = apiLink;
    });
