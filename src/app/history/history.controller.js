'use strict';

angular.module('doIt')
  .controller('HistoryCtrl', function ($scope, TaskHistory) {
    $scope.taskHistory = TaskHistory;

    $scope.tasks = TaskHistory.tasks;
  });
