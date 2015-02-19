'use strict';

angular.module('doIt')
  .controller('ListsCtrl', function ($scope, $filter, $stateParams, $location, TaskList, TaskHistory) {

    $scope.taskList = TaskList;
    $scope.lists = TaskList.all;
    $scope.list = TaskList.get($stateParams.listId);
    $scope.tasks = TaskList.tasks($stateParams.listId);
    // $scope.list.newName = '';

    $scope.taskHistory = TaskHistory;
    $scope.task = {};
    $scope.currentDate = new Date().getTime(); 
    $scope.priorities = ['high', 'medium', 'low']; 

    $scope.createList = function() {
      TaskList.create($scope.list).then(function(ref) {
        $location.path('/lists/' + ref.key());
        $scope.list = {newName: ''};
      });
    };

    $scope.deleteList = function() {
      var i = $scope.lists.$indexFor($scope.list.$id);

      for (var j=0; j<$scope.tasks.length; j++) {
        TaskHistory.removeTask($scope.tasks[j]);
      }
      
      TaskList.delete($scope.lists[i]).then(function() {
        $location.path('/');
      });
    };
    // $scope.task = {};
    $scope.currentDate = new Date().getTime(); 
    // $scope.priorities = ['high', 'medium', 'low']; 
    // $scope.task.category = 'Current Tasks';
    // $scope.task.newCategory = '';


    // // console.log($scope.activeTasks);
    // // Once firebase array of tasks is loaded
    // $scope.tasks.$loaded(function() {
    //   // Filter to show only the tasks that are active
    //   // $scope.activeTasks = $filter('filter')($scope.tasks, 'active', status);

    //   for (var i=0; i<$scope.tasks.length; i++) {
    //     $scope.taskHistory.setExpiredTask($scope.tasks[i], i, $scope.currentDate);
    //   }

    //   // console.log($scope.activeTasks);
    // });

    $scope.addCurrentTask = function(task) {
      TaskHistory.addTask(task);
      $scope.task.name = null;
    };

  });
