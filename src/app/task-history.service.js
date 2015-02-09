'use strict';

angular.module('doIt')
  .service('TaskHistory', function ($firebase, FIREBASE_URI) {
    var ref = new Firebase(FIREBASE_URI);
    var sync = $firebase(ref);

    return {
      tasks: sync.$asArray(),

      getTaskStatus: function(task) {
        return task.status === 'active' ? false : true;
      },
      addTask: function(task) {
        var taskName = task.name;
        var taskPriority = task.priority;
        var taskStatus = 'active';

        task = {
          'name': taskName,
          'status': taskStatus,
          'priority': taskPriority
        }

        this.tasks.$add(task);
      },
      removeTask: function(task) {
        this.tasks.$remove(task);
      },
      setTaskClass: function(task) {
        return task.status === 'completed' ? 'completed' : 'expired';
      }
    };
  });