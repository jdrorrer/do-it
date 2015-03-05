'use strict';

angular.module('doIt')
  .directive('deleteTask', function ($firebase, FIREBASE_URI, $timeout) {
    return {
      template: '<i ng-click="onClick($parent.task)" class="fa fa-times-circle-o fa-3x" tooltip="Delete Task" tooltip-placement="right" ng-click="taskHistory.removeTask(task)"></i>',
      restrict: 'E',
      replace: true,
      scope: {}, 
      link: function(scope, element, attributes) {
        var ref = new Firebase(FIREBASE_URI);
        var sync = $firebase(ref.child('tasks'));
        var tasks = sync.$asArray();

        scope.onClick = function(task) {
          var i = tasks.$indexFor(task.$id);

          $timeout(function() { // allow time for swipe right animation to complete
            tasks.$remove(i);
          }, 900);
         
          console.log("Permanently deleted task from history: " + task.name);      
        };
      }
    };
  });