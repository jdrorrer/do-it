'use strict';

angular.module('doIt')
  .controller('ListsCtrl', function ($scope, $stateParams, $location, TaskList, TaskHistory) {

    $scope.taskList = TaskList;
    $scope.lists = TaskList.all;
    $scope.list = TaskList.get($stateParams.listId);
    $scope.tasks = TaskList.tasks($stateParams.listId);
    $scope.list.newName = '';

    $scope.taskHistory = TaskHistory;
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

    $scope.deleteList = function() {
      var i = $scope.lists.$indexFor($scope.list.$id);

      // Delete each task in the list
      for (var j=0; j<$scope.tasks.length; j++) {
        TaskHistory.removeTask($scope.tasks[j]);
      }
      
      // Then delete the list itself and redirect to home page
      TaskList.delete($scope.lists[i]).then(function() {
        $location.path('/');
      });
    };

    // Once firebase array of tasks is loaded
    $scope.tasks.$loaded(function() {
      // Check each task to see if it should be expired
      for (var i=0; i<$scope.tasks.length; i++) {
        $scope.taskHistory.setExpiredTask($scope.tasks[i], i, $scope.currentDate);
      }
    });

    $scope.hideButtons = function() {
      angular.element('.buttons').addClass('is-hidden');
    };

    $scope.showButtons = function() {
      angular.element('.buttons').removeClass('is-hidden');
    };

    $scope.addCurrentTask = function(task) {
      TaskHistory.addTask(task);
      $scope.task.name = null;
    };

    $scope.updateTask = function(task) {
      TaskHistory.updateTask(task);
    };

  });
