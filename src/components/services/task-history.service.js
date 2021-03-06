'use strict';

angular.module('doIt')
  .service('TaskHistory', function ($firebase, FIREBASE_URI, $filter, $stateParams, $timeout) {
    var ref = new Firebase(FIREBASE_URI);
    var sync = $firebase(ref.child('tasks'));
    var tasks = sync.$asArray();
    var activeTasks = $firebase(ref.child('tasks').orderByChild('status').equalTo('active')).$asArray();

    var setExpiredTask = function(task, currentDate) {
      var oneDayInMilliseconds = 86400000; // equivalent of one day in milliseconds
      var dateTimeDiff = currentDate - task.date;
      var daysPassed = Math.floor(dateTimeDiff / oneDayInMilliseconds);

      var i = tasks.$indexFor(task.$id);

      // console.log(task.$id, daysPassed, dateTimeDiff, tasks[i]);

      if (daysPassed >= 7 && tasks[i].status === 'active') {
        tasks[i].status = 'expired';
        tasks.$save(i);

        console.log ("'" + task.name + "' is older than 7 days. Changed status to 'expired' and moved to task history.");
      } 
    };

    var currentDate = new Date().getTime();

    // Once firebase array of tasks is loaded
    tasks.$loaded(function() {
      // Check each task to see if it should be expired
      for(var i=0; i<tasks.length; i++) {
        setExpiredTask(tasks[i], currentDate);
      }
    });

    return {
      all: tasks,
      active: activeTasks,

      getTaskStatus: function(task) {
        return task.status === 'active';
      },
      addTask: function(task) {
        var taskName = task.name;
        var taskPriority = task.priority;
        var taskStatus = 'active';
        var dateAdded = new Date().getTime();
        var listId;

        // If $stateParams.listId does not exist, return dummy listId
        // This allows add tasks functionality to work on Active Tasks list
        if (!$stateParams.listId) {
          listId = 12345; // Dummy task listId - all tasks show up in Active Tasks
        } 
        else {
          listId = $stateParams.listId; // If not Active Tasks, grab $stateParams of current list
        }

        task = {
          'name': taskName,
          'status': taskStatus,
          'priority': taskPriority,
          'date': dateAdded,
          'listId': listId
        }

        return tasks.$add(task);
      },
      updateTask: function(task) {
        var i = tasks.$indexFor(task.$id);

        tasks[i] = task;
        tasks.$save(i);

        console.log("Changed task name to: " + tasks[i].name);
      }, 
      completeTask: function(task) {
        var i = tasks.$indexFor(task.$id);

        $timeout(function() { // allow time for swipe right animation to complete
          tasks[i].status = 'completed';
          tasks.$save(i);
        }, 900);
        
        console.log("Moved completed task to history: " + task.name);  
      },
      reActivateTask: function(task) {
        var i = tasks.$indexFor(task.$id);

        $timeout(function() { // allow time for swipe right animation to complete
          tasks[i].status = 'active';
          tasks.$save(i);
        }, 900);

        console.log("Changed task status to active: " + task.name);
      },
      removeTask: function(task) {
        var i = tasks.$indexFor(task.$id);

        tasks.$remove(i);
      },
      setTaskClass: function(task) {
        return task.status === 'completed' ? true : false;
      }
    };
  });