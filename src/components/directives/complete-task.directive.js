'use strict';

angular.module('doIt')
  .directive('completeTask', function ($firebase, FIREBASE_URI) {
    return {
      template: '<i ng-click="onClick($parent.task)" class="fa fa-check-circle-o fa-3x" tooltip="Complete Task" tooltip-placement="left"></i>',
      restrict: 'E',
      replace: true,
      scope: {}, 
      link: function(scope, element, attributes) {
        var ref = new Firebase(FIREBASE_URI);
        var sync = $firebase(ref.child('tasks'));
        var tasks = sync.$asArray();

        scope.onClick = function(task) {
          var i = tasks.$indexFor(task.$id);

          tasks[i].status = 'completed';
          tasks.$save(i);
          
          console.log("Moved completed task to history: " + task.name); 
        };
      }
    };
  });