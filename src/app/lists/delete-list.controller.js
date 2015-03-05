'use strict';

angular.module('doIt')
  .controller('DeleteListCtrl', function ($scope, $modalInstance, list) {
    $scope.list = list;

    $scope.delete = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });