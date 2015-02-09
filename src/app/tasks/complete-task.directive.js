'use strict';

angular.module('doIt')
  .directive('completeTask', function ($firebase, FIREBASE_URI) {
    return {
      template: '<div ng-transclude ng-click="onClick($parent.task, $parent.id)"></div>',
      transclude: true,
      restrict: 'A',
      scope: {},
      link: function(scope, element, attributes) {
        var ref = new Firebase(FIREBASE_URI);
        var sync = $firebase(ref);
        var tasks = sync.$asArray();

        scope.onClick = function(task, id) {
          tasks[id].status = 'completed';
          tasks.$save(id);

          console.log("Moved completed task to history", scope.$parent.task);
        };
      }
    };
  });