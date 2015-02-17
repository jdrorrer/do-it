'use strict';

angular.module('doIt')
  .service('TaskHistory', function ($firebase, FIREBASE_URI, $filter) {
    var ref = new Firebase(FIREBASE_URI);
    var sync = $firebase(ref);

    return {
      tasks: sync.$asArray(),
      activeTasks: $filter('filter')(this.tasks, 'active', status),
      notActiveTasks: $filter('filter')(this.tasks, '!active', status),

      getTaskStatus: function(task) {
        return task.status === 'active' ? false : true;
      },
      addTask: function(task) {
        var taskName = task.name;
        var taskPriority = task.priority;
        var taskStatus = 'active';
        var dateAdded = new Date().getTime();
        var taskCategory = task.category;

        task = {
          'name': taskName,
          'status': taskStatus,
          'priority': taskPriority,
          'date': dateAdded,
          'category': taskCategory
        }

        this.tasks.$add(task);
      },
      completeTask: function(task, id) {
        this.tasks[id].status = 'completed';
        this.tasks.$save(id);
          
        console.log("Moved completed task to history");  
      },
      reActivateTask: function(task, id) {
        this.tasks[id].status = 'active';
        this.tasks.$save(id);

        console.log("Changed task status to active");
      },
      removeTask: function(task, id) {
        this.tasks.$remove(id);
      },
      setExpiredTask: function(task, id, currentDate) {
        var oneDayInMilliseconds = 86400000;
        var dateTimeDiff = currentDate - task.date;
        var daysPassed = Math.floor(dateTimeDiff / oneDayInMilliseconds);

        // console.log(task.$id, daysPassed);

        if (daysPassed >= 7 && this.tasks[id].status === 'active') {
          this.tasks[id].status = 'expired';
          this.tasks.$save(id);

          console.log ("'" + task.name + "' is older than 7 days. Changed status to 'expired' and moved to task history.");
        } 
      },
      setTaskClass: function(task) {
        return task.status === 'completed' ? 'completed' : 'expired';
      }
    };
  });