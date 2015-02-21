'use strict';

angular.module('doIt')
  .controller('HistoryCtrl', function ($scope, $filter, TaskHistory) {
    $scope.taskHistory = TaskHistory;

    $scope.tasks = TaskHistory.notActive;


    // $scope.tasks.$loaded(function() {
    //   console.log($scope.notActiveTasks);
    // });

  });
