'use strict';

angular.module('doIt')
  .controller('HistoryCtrl', function ($scope, $filter, TaskHistory) {
    $scope.taskHistory = TaskHistory;

    $scope.tasks = TaskHistory.tasks;

    // Once firebase array of tasks is loaded
    // $scope.tasks.$loaded(function() {
    //   // Filter to show only the tasks that are NOT active
    //   $scope.notActiveTasks = $filter('filter')($scope.tasks, '!active', status);
    // });
  });
