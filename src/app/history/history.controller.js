'use strict';

angular.module('doIt')
  .controller('HistoryCtrl', function ($scope, $filter, TaskHistory) {
    $scope.taskHistory = TaskHistory;

    $scope.tasks = TaskHistory.notActive;
    $scope.highTasks = TaskHistory.high;
    $scope.mediumTasks = TaskHistory.medium;
    $scope.lowTasks = TaskHistory.low;

    // $scope.tasks.$loaded(function() {
    //   console.log($scope.notActiveTasks);
    // });

  });
