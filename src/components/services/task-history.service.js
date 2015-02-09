'use strict';

angular.module('doIt')
  .service('TaskHistory', function ($firebase, FIREBASE_URI, $timeout) {
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
        var dateAdded = new Date().getTime();

        task = {
          'name': taskName,
          'status': taskStatus,
          'priority': taskPriority,
          'date': dateAdded
        }

        this.tasks.$add(task);
      },
      removeTask: function(task) {
        this.tasks.$remove(task);
      },
      setExpiredTask: function(task, id, currentDate) {
        var oneDayInMilliseconds = 86400000;
        var dateTimeDiff = currentDate - task.date;
        var daysPassed = Math.floor(dateTimeDiff / oneDayInMilliseconds);

        if (daysPassed >= 7 && this.tasks[id].status === 'active') {
          this.tasks[id].status = 'expired';
          this.tasks.$save(id);

          console.log (task.name + " is older than 7 days. Changed status to 'expired' and moved to task history.");
        } 
      },
      setTaskClass: function(task) {
        return task.status === 'completed' ? 'completed' : 'expired';
      }
    };
  });