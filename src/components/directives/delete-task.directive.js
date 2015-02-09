'use strict';

angular.module('doIt')
  .directive('deleteTask', function ($firebase, FIREBASE_URI) {
    return {
      template: '<i ng-click="onClick($parent.task, $parent.id)" class="fa fa-times-circle-o fa-3x" tooltip="Delete Task" tooltip-placement="right" ng-click="taskHistory.removeTask(task)"></i>',
      restrict: 'E',
      replace: true,
      scope: {}, 
      link: function(scope, element, attributes) {
        var ref = new Firebase(FIREBASE_URI);
        var sync = $firebase(ref);
        var tasks = sync.$asArray();

        scope.onClick = function(task, id) {
          tasks.$remove(id);
          
          console.log("Permanently deleted task from history");      
        };
      }
    };
  });