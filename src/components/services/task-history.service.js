'use strict';

angular.module('doIt')
  .service('TaskHistory', function ($firebase, FIREBASE_URI, $filter, $stateParams) {
    var ref = new Firebase(FIREBASE_URI);
    var sync = $firebase(ref.child('tasks'));
    var tasks = sync.$asArray();

    return {
      all: tasks,

      getTaskStatus: function(task) {
        return task.status === 'active' ? false : true;
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
        
        console.log(listId);

        task = {
          'name': taskName,
          'status': taskStatus,
          'priority': taskPriority,
          'date': dateAdded,
          'listId': listId
        }

        return tasks.$add(task);
      },
      completeTask: function(task) {
        var i = tasks.$indexFor(task.$id);

        tasks[i].status = 'completed';
        tasks.$save(i);
          
        console.log("Moved completed task to history: " + task.name);  
      },
      reActivateTask: function(task) {
        var i = tasks.$indexFor(task.$id);

        tasks[i].status = 'active';
        tasks.$save(i);

        console.log("Changed task status to active: " + task.name);
      },
      removeTask: function(task) {
        var i = tasks.$indexFor(task.$id);

        tasks.$remove(i);
      },
      setExpiredTask: function(task, currentDate) {
        var oneDayInMilliseconds = 86400000;
        var dateTimeDiff = currentDate - task.date;
        var daysPassed = Math.floor(dateTimeDiff / oneDayInMilliseconds);

        var i = tasks.$indexFor(task.$id);

        // console.log(task.$id, daysPassed);

        if (daysPassed >= 7 && tasks[i].status === 'active') {
          tasks[i].status = 'expired';
          tasks.$save(i);

          console.log ("'" + task.name + "' is older than 7 days. Changed status to 'expired' and moved to task history.");
        } 
      },
      setTaskClass: function(task) {
        return task.status === 'completed' ? 'completed' : 'expired';
      }
    };
  });