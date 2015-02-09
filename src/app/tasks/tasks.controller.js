'use strict';

angular.module('doIt')
  .controller('TasksCtrl', function ($scope, TaskHistory) {

    $scope.taskHistory = TaskHistory;
    $scope.tasks = TaskHistory.tasks;

    $scope.addCurrentTask = function(task) {
      TaskHistory.addTask(task);
      $scope.task.name = null;
      $scope.task.priority = null;
    };

  });
