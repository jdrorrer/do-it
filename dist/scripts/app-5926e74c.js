"use strict";angular.module("doIt",["xeditable","firebase","ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider",function(t,s){t.state("home",{url:"/",templateUrl:"app/tasks/tasks.html",controller:"TasksCtrl"}).state("history",{url:"/history",templateUrl:"app/history/history.html",controller:"HistoryCtrl"}).state("lists",{url:"/lists/:listId",templateUrl:"app/lists/lists.html",controller:"ListsCtrl"}),s.otherwise("/")}]).constant("FIREBASE_URI","https://do-it.firebaseio.com/"),angular.module("doIt").service("TaskList",["$firebase","FIREBASE_URI","$filter",function(t,s){var a=new Firebase(s),e=t(a.child("lists")),i=e.$asArray(),l={all:i,create:function(t){var s=t.newName;return t={name:s},console.log("Created new task list: "+t.name),i.$add(t)},get:function(s){return t(a.child("lists").child(s)).$asObject()},"delete":function(t){return console.log("Permanently deleted task list: "+t.name),i.$remove(t)},tasks:function(s){return t(a.child("tasks").orderByChild("listId").equalTo(s)).$asArray()}};return l}]),angular.module("doIt").service("TaskHistory",["$firebase","FIREBASE_URI","$filter","$stateParams",function(t,s,a,e){var i=new Firebase(s),l=t(i.child("tasks")),r=l.$asArray(),o=t(i.child("tasks").orderByChild("priority").equalTo("high")).$asArray(),n=t(i.child("tasks").orderByChild("priority").equalTo("medium")).$asArray(),c=t(i.child("tasks").orderByChild("priority").equalTo("low")).$asArray(),d=t(i.child("tasks").orderByChild("status").equalTo("active")).$asArray(),k=t(i.child("tasks").orderByChild("status").equalTo("completed")).$asArray();return{all:r,high:o,medium:n,low:c,active:d,notActive:k,getTaskStatus:function(t){return"active"===t.status?!1:!0},addTask:function(t){var s,a=t.name,i=t.priority,l="active",o=(new Date).getTime();return s=e.listId?e.listId:12345,t={name:a,status:l,priority:i,date:o,listId:s},r.$add(t)},updateTask:function(t){var s=r.$indexFor(t.$id);r[s]=t,r.$save(s),console.log("Changed task name to: "+r[s].name)},completeTask:function(t){var s=r.$indexFor(t.$id);r[s].status="completed",r.$save(s),console.log("Moved completed task to history: "+t.name)},reActivateTask:function(t){var s=r.$indexFor(t.$id);r[s].status="active",r.$save(s),console.log("Changed task status to active: "+t.name)},removeTask:function(t){var s=r.$indexFor(t.$id);r.$remove(s)},setExpiredTask:function(t,s){var a=864e5,e=s-t.date,i=Math.floor(e/a),l=r.$indexFor(t.$id);i>=7&&"active"===r[l].status&&(r[l].status="expired",r.$save(l),console.log("'"+t.name+"' is older than 7 days. Changed status to 'expired' and moved to task history."))},setTaskClass:function(t){return"completed"===t.status?"completed":"expired"}}}]),angular.module("doIt").controller("NavbarCtrl",["$scope","TaskList",function(t,s){t.taskList=s,t.lists=s.all}]),angular.module("doIt").directive("deleteTask",["$firebase","FIREBASE_URI",function(t,s){return{template:'<i ng-click="onClick($parent.task)" class="fa fa-times-circle-o fa-3x" tooltip="Delete Task" tooltip-placement="right" ng-click="taskHistory.removeTask(task)"></i>',restrict:"E",replace:!0,scope:{},link:function(a){var e=new Firebase(s),i=t(e.child("tasks")),l=i.$asArray();a.onClick=function(t){var s=l.$indexFor(t.$id);l.$remove(s),console.log("Permanently deleted task from history: "+t.name)}}}}]),angular.module("doIt").directive("completeTask",["$firebase","FIREBASE_URI",function(t,s){return{template:'<i ng-click="onClick($parent.task)" class="fa fa-check-circle-o fa-3x" tooltip="Complete Task" tooltip-placement="left"></i>',restrict:"E",replace:!0,scope:{},link:function(a){var e=new Firebase(s),i=t(e.child("tasks")),l=i.$asArray();a.onClick=function(t){var s=l.$indexFor(t.$id);l[s].status="completed",l.$save(s),console.log("Moved completed task to history: "+t.name)}}}}]),angular.module("doIt").controller("TasksCtrl",["$scope","$location","TaskList","TaskHistory",function(t,s,a,e){t.taskList=a,t.lists=a.all,t.list={newName:""},t.taskHistory=e,t.tasks=e.active,t.task={},t.currentDate=(new Date).getTime(),t.priorities=["high","medium","low"],t.createList=function(){a.create(t.list).then(function(a){s.path("/lists/"+a.key()),t.list={newName:""}})},t.tasks.$loaded(function(){for(var s=0;s<t.tasks.length;s++)t.taskHistory.setExpiredTask(t.tasks[s],t.currentDate)}),t.addCurrentTask=function(s){e.addTask(s),t.task.name=null},t.updateTask=function(t){e.updateTask(t)}}]),angular.module("doIt").controller("ListsCtrl",["$scope","$stateParams","$location","TaskList","TaskHistory",function(t,s,a,e,i){t.taskList=e,t.lists=e.all,t.list=e.get(s.listId),t.tasks=e.tasks(s.listId),t.list.newName="",t.taskHistory=i,t.task={},t.currentDate=(new Date).getTime(),t.priorities=["high","medium","low"],t.createList=function(){e.create(t.list).then(function(s){a.path("/lists/"+s.key()),t.list={newName:""}})},t.deleteList=function(){for(var s=t.lists.$indexFor(t.list.$id),l=0;l<t.tasks.length;l++)i.removeTask(t.tasks[l]);e.delete(t.lists[s]).then(function(){a.path("/")})},t.tasks.$loaded(function(){for(var s=0;s<t.tasks.length;s++)t.taskHistory.setExpiredTask(t.tasks[s],s,t.currentDate)}),t.addCurrentTask=function(s){i.addTask(s),t.task.name=null},t.updateTask=function(t){i.updateTask(t)}}]),angular.module("doIt").controller("HistoryCtrl",["$scope","$filter","TaskHistory",function(t,s,a){t.taskHistory=a,t.tasks=a.notActive}]),angular.module("doIt").run(["$templateCache",function(t){t.put("app/history/history.html",'<div class="container"><div class="task-list"><div class="task-list-head">Task History <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search tasks..."></div><div class="task-list-body"><h4 class="priority-header">High</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'high\'}" ng-class="taskHistory.setTaskClass(task)" ng-swipe-left="taskHistory.reActivateTask(task)" class="task task-history animate-swipe-lt">{{ task.name }}<delete-task></delete-task></li></ul><h4 class="priority-header">Medium</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'medium\'}" ng-class="taskHistory.setTaskClass(task)" ng-swipe-left="taskHistory.reActivateTask(task)" class="task task-history animate-swipe-lt">{{ task.name }}<delete-task></delete-task></li></ul><h4 class="priority-header">Low</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'low\'}" ng-class="taskHistory.setTaskClass(task)" ng-swipe-left="taskHistory.reActivateTask(task)" class="task task-history animate-swipe-lt">{{ task.name }}<delete-task></delete-task></li></ul></div></div></div>'),t.put("app/lists/lists.html",'<div class="container"><form class="create-task-list" ng-submit="createList()"><input ng-model="list.newName" type="text" class="create-list-input" placeholder="+ Create new task list..."> <button type="submit" class="create-list-button">Create</button></form><div class="task-list"><div class="task-list-head">{{ list.name }} <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search tasks..."></div><form ng-submit="addCurrentTask(task)" class="add-task-container"><div class="add-task-header"><div class="new-task-label">Task description</div><div class="priority-label">Priority</div></div><div class="add-task"><input ng-model="task.name" class="new-task" type="text" placeholder="Enter new task..."><div class="select-style"><select ng-model="task.priority" ng-options="priority for priority in priorities" class="priority"><option value="" disabled="" selected="">Select priority...</option></select></div><button type="submit" class="add-btn">Add</button></div></form><div class="task-list-body"><h4 class="priority-header priority-high-header">High</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'high\'}" ng-hide="taskHistory.getTaskStatus(task)" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt" editable-text="task.name" onaftersave="updateTask(task)">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul><h4 class="priority-header">Medium</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'medium\'}" ng-hide="taskHistory.getTaskStatus(task)" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt" editable-text="task.name" onaftersave="updateTask(task)">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul><h4 class="priority-header">Low</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'low\'}" ng-hide="taskHistory.getTaskStatus(task)" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt" editable-text="task.name" onaftersave="updateTask(task)">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul></div><div class="delete-link-container"><a class="delete-link" ng-click="deleteList()">&#10005 Delete this list</a></div></div></div>'),t.put("app/tasks/tasks.html",'<div class="container"><form class="create-task-list" ng-submit="createList()"><input ng-model="list.newName" type="text" class="create-list-input" placeholder="+ Create new task list..."> <button type="submit" class="create-list-button">Create</button></form><div class="task-list"><div class="task-list-head">Current Tasks <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search tasks..."></div><form ng-submit="addCurrentTask(task)" class="add-task-container"><div class="add-task-header"><div class="new-task-label">Task description</div><div class="priority-label">Priority</div></div><div class="add-task"><input ng-model="task.name" class="new-task" type="text" placeholder="Enter new task..."><div class="select-style"><select ng-model="task.priority" ng-options="priority for priority in priorities" class="priority"><option value="" disabled="" selected="">Select priority...</option></select></div><button type="submit" class="add-btn">Add</button></div></form><div class="task-list-body"><h4 class="priority-header priority-high-header">High</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'high\'}" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt" editable-text="task.name" onaftersave="updateTask(task)">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul><h4 class="priority-header">Medium</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'medium\'}" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt" editable-text="task.name" onaftersave="updateTask(task)">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul><h4 class="priority-header">Low</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'low\'}" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt" editable-text="task.name" onaftersave="updateTask(task)">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul></div></div></div>'),t.put("components/footer/footer.html",'<div class="footer"><p>Made with ♥ by Jake</p></div>'),t.put("components/navbar/navbar.html",'<nav class="navbar navbar-static-top navbar-inverse" role="navigation" ng-controller="NavbarCtrl"><div class="container-fluid" id="navfluid"><div class="navbar-header"><a class="navbar-brand" ui-sref="home">d<i class="fa fa-check-circle"></i>.it</a> <button type="button" class="navbar-toggle" ng-init="navCollapsed = true" ng-click="navCollapsed = !navCollapsed"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button></div><div class="collapse navbar-collapse" id="nav-collapse" collapse="navCollapsed" ng-click="navCollapsed=true"><ul class="nav navbar-nav"><li ui-sref-active="active"><a ui-sref="home">Active Tasks</a></li><li ui-sref-active="active" ng-repeat="list in lists"><a ui-sref="lists({listId: list.$id})">{{ list.name }}</a></li><li ui-sref-active="active"><a ui-sref="history">Task History</a></li></ul></div></div></nav>')}]);