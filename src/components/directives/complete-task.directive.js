'use strict';

angular.module('doIt')
  .directive('completeTask', function ($firebase, FIREBASE_URI) {
    return {
      template: '<i ng-click="onClick($parent.task, $parent.id)" class="fa fa-check-circle-o fa-3x" tooltip="Complete Task" tooltip-placement="left"></i>',
      restrict: 'E',
      replace: true,
      scope: {}, 
      link: function(scope, element, attributes) {
        var ref = new Firebase(FIREBASE_URI);
        var sync = $firebase(ref);
        var tasks = sync.$asArray();

        scope.onClick = function(task, id) {
          tasks[id].status = 'completed';
          tasks.$save(id);
          
          console.log("Moved completed task to history");      
        };
      }
    };
  });