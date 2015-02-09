'use strict';

angular.module('doIt')
  .controller('TasksCtrl', function ($scope, TaskHistory) {

    $scope.taskHistory = TaskHistory;
    $scope.tasks = TaskHistory.tasks;
    $scope.task = {};
    $scope.currentDate = new Date().getTime();  

    $scope.checkExpiration = function(task, id) {
      TaskHistory.setExpiredTask(task, id, $scope.currentDate);
    };

    $scope.addCurrentTask = function(task) {
      TaskHistory.addTask(task);
      $scope.task.name = null;
      $scope.task.priority = null;
    };

  });
