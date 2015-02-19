'use strict';

angular.module('doIt')
  .service('TaskList', function ($firebase, FIREBASE_URI, $filter) {
    var ref = new Firebase(FIREBASE_URI);
    var sync = $firebase(ref.child('lists'));
    var lists = sync.$asArray();

    var Tasklist = {
      all: lists,
      create: function(list) {
        var listName = list.newName;

        list = {name: listName};

        console.log("Created new task list: " + list.name);
        return lists.$add(list);
      },
      get: function(listId) {
        return $firebase(ref.child('lists').child(listId)).$asObject();
      },
      delete: function(list) {
        console.log("Permanently deleted task list: " + list.name);
        return lists.$remove(list);
      },
      tasks: function(listId) {
        return $firebase(ref.child('tasks').orderByChild('listId').equalTo(listId)).$asArray();
      }
    };

    return Tasklist;
  });