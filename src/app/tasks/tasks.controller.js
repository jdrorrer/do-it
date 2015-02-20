'use strict';

angular.module('doIt')
  .controller('TasksCtrl', function ($scope, $location, TaskList, TaskHistory) {

    $scope.taskList = TaskList;
    $scope.lists = TaskList.all;
    $scope.list = {newName: ''};

    $scope.taskHistory = TaskHistory;
    $scope.tasks = TaskHistory.active;
    $scope.highTasks = TaskHistory.high;
    $scope.mediumTasks = TaskHistory.medium;
    $scope.lowTasks = TaskHistory.low;
    $scope.task = {};
    $scope.currentDate = new Date().getTime(); 
    $scope.priorities = ['high', 'medium', 'low']; // Used to populate priority dropdown

    $scope.createList = function() {
      // Create new list and then redirect to that new list
      TaskList.create($scope.list).then(function(ref) {
        $location.path('/lists/' + ref.key());
        $scope.list = {newName: ''};
      });
    };

    // Once firebase array of tasks is loaded
    $scope.tasks.$loaded(function() {
      // Check each task to see if it should be expired
      for (var i=0; i<$scope.tasks.length; i++) {
        $scope.taskHistory.setExpiredTask($scope.tasks[i], $scope.currentDate);
      }
    });

    $scope.addCurrentTask = function(task) {
      TaskHistory.addTask(task);
      $scope.task.name = null;
    };

  });


