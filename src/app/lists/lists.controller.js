'use strict';

angular.module('doIt')
  .controller('ListsCtrl', function ($scope, $stateParams, $location, TaskList, TaskHistory, $modal) {

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

    // Delete list modal configuration
    $scope.open = function(size) {
      var modalInstance = $modal.open({
        templateUrl: '../../components/modals/delete-list-modal.html',
        controller: 'DeleteListCtrl',
        size: size,
        backdrop: true,
        resolve: {
          list: function () {
            return $scope.list;
          }
        }
      });

      modalInstance.result.then(function () {
        $scope.deleteList();
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
