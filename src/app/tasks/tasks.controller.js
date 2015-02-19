'use strict';

angular.module('doIt')
  .controller('TasksCtrl', function ($scope, $filter, $location, TaskList, TaskHistory) {

    $scope.taskList = TaskList;
    $scope.lists = TaskList.all;
    $scope.list = {newName: ''};

    $scope.taskHistory = TaskHistory;
    $scope.tasks = TaskHistory.all;
    $scope.task = {};
    $scope.currentDate = new Date().getTime(); 
    $scope.priorities = ['high', 'medium', 'low']; 
    $scope.task.category = 'Current Tasks';
    $scope.task.newCategory = '';

    $scope.createList = function() {
      TaskList.create($scope.list).then(function(ref) {
        $location.path('/lists/' + ref.key());
        $scope.list = {newName: ''};
      });
    };


    // console.log($scope.activeTasks);
    // Once firebase array of tasks is loaded
    $scope.tasks.$loaded(function() {
      // Filter to show only the tasks that are active
      // $scope.activeTasks = $filter('filter')($scope.tasks, 'active', status);

      for (var i=0; i<$scope.tasks.length; i++) {
        $scope.taskHistory.setExpiredTask($scope.tasks[i], $scope.currentDate);
      }

      // console.log($scope.activeTasks);
    });

    $scope.addCurrentTask = function(task) {
      TaskHistory.addTask(task);
      $scope.task.name = null;
    };

  });


