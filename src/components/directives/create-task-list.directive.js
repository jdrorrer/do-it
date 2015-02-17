'use strict';

angular.module('doIt')
  .directive('createTaskList', function ($compile) {
    return {
      templateUrl: '../../app/task-lists/task-lists.html',
      restrict: 'A',
      replace: true,
      scope: {}, 
      link: function(scope, element, attributes) {
        element.html(templateUrl).show();

        $compile(element.contents())(scope);
      }
    };
  });