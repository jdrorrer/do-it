'use strict';

angular.module('doIt')
  .controller('NavbarCtrl', function ($scope, TaskList) {
    $scope.taskList = TaskList;
    $scope.lists = TaskList.all;
  });
