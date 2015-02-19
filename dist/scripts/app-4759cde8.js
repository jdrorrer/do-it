"use strict";angular.module("doIt",["firebase","ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider",function(t,s){t.state("home",{url:"/",templateUrl:"app/tasks/tasks.html",controller:"TasksCtrl"}).state("history",{url:"/history",templateUrl:"app/history/history.html",controller:"HistoryCtrl"}).state("lists",{url:"/lists/:listId",templateUrl:"app/lists/lists.html",controller:"ListsCtrl"}),s.otherwise("/")}]).constant("FIREBASE_URI","https://do-it.firebaseio.com/"),angular.module("doIt").service("TaskList",["$firebase","FIREBASE_URI","$filter",function(t,s){var a=new Firebase(s),e=t(a.child("lists")),i=e.$asArray(),l={all:i,create:function(t){var s=t.newName;return t={name:s},console.log("Created new task list: "+t.name),i.$add(t)},get:function(s){return t(a.child("lists").child(s)).$asObject()},"delete":function(t){return console.log("Permanently deleted task list: "+t.name),i.$remove(t)},tasks:function(s){return t(a.child("tasks").orderByChild("listId").equalTo(s)).$asArray()}};return l}]),angular.module("doIt").service("TaskHistory",["$firebase","FIREBASE_URI","$filter","$stateParams",function(t,s,a,e){var i=new Firebase(s),l=t(i.child("tasks")),r=l.$asArray();return{all:r,getTaskStatus:function(t){return"active"===t.status?!1:!0},addTask:function(t){var s,a=t.name,i=t.priority,l="active",n=(new Date).getTime();return s=e.listId?e.listId:12345,console.log(s),t={name:a,status:l,priority:i,date:n,listId:s},r.$add(t)},completeTask:function(t){var s=r.$indexFor(t.$id);r[s].status="completed",r.$save(s),console.log("Moved completed task to history: "+t.name)},reActivateTask:function(t){var s=r.$indexFor(t.$id);r[s].status="active",r.$save(s),console.log("Changed task status to active: "+t.name)},removeTask:function(t){var s=r.$indexFor(t.$id);r.$remove(s)},setExpiredTask:function(t,s){var a=864e5,e=s-t.date,i=Math.floor(e/a),l=r.$indexFor(t.$id);i>=7&&"active"===r[l].status&&(r[l].status="expired",r.$save(l),console.log("'"+t.name+"' is older than 7 days. Changed status to 'expired' and moved to task history."))},setTaskClass:function(t){return"completed"===t.status?"completed":"expired"}}}]),angular.module("doIt").controller("NavbarCtrl",["$scope","TaskList",function(t,s){t.taskList=s,t.lists=s.all}]),angular.module("doIt").directive("deleteTask",["$firebase","FIREBASE_URI",function(t,s){return{template:'<i ng-click="onClick($parent.task)" class="fa fa-times-circle-o fa-3x" tooltip="Delete Task" tooltip-placement="right" ng-click="taskHistory.removeTask(task)"></i>',restrict:"E",replace:!0,scope:{},link:function(a){var e=new Firebase(s),i=t(e.child("tasks")),l=i.$asArray();a.onClick=function(t){var s=l.$indexFor(t.$id);l.$remove(s),console.log("Permanently deleted task from history: "+t.name)}}}}]),angular.module("doIt").directive("createTaskList",["$compile",function(t){return{templateUrl:"../../app/task-lists/task-lists.html",restrict:"A",replace:!0,scope:{},link:function(s,a){a.html(templateUrl).show(),t(a.contents())(s)}}}]),angular.module("doIt").directive("completeTask",["$firebase","FIREBASE_URI",function(t,s){return{template:'<i ng-click="onClick($parent.task)" class="fa fa-check-circle-o fa-3x" tooltip="Complete Task" tooltip-placement="left"></i>',restrict:"E",replace:!0,scope:{},link:function(a){var e=new Firebase(s),i=t(e.child("tasks")),l=i.$asArray();a.onClick=function(t){var s=l.$indexFor(t.$id);l[s].status="completed",l.$save(s),console.log("Moved completed task to history: "+t.name)}}}}]),angular.module("doIt").controller("TasksCtrl",["$scope","$filter","$location","TaskList","TaskHistory",function(t,s,a,e,i){t.taskList=e,t.lists=e.all,t.list={newName:""},t.taskHistory=i,t.tasks=i.all,t.task={},t.currentDate=(new Date).getTime(),t.priorities=["high","medium","low"],t.task.category="Current Tasks",t.task.newCategory="",t.createList=function(){e.create(t.list).then(function(s){a.path("/lists/"+s.key()),t.list={newName:""}})},t.tasks.$loaded(function(){for(var s=0;s<t.tasks.length;s++)t.taskHistory.setExpiredTask(t.tasks[s],t.currentDate)}),t.addCurrentTask=function(s){i.addTask(s),t.task.name=null}}]),angular.module("doIt").controller("ListsCtrl",["$scope","$filter","$stateParams","$location","TaskList","TaskHistory",function(t,s,a,e,i,l){t.taskList=i,t.lists=i.all,t.list=i.get(a.listId),t.tasks=i.tasks(a.listId),t.taskHistory=l,t.task={},t.currentDate=(new Date).getTime(),t.priorities=["high","medium","low"],t.createList=function(){i.create(t.list).then(function(s){e.path("/lists/"+s.key()),t.list={newName:""}})},t.deleteList=function(){for(var s=t.lists.$indexFor(t.list.$id),a=0;a<t.tasks.length;a++)l.removeTask(t.tasks[a]);i.delete(t.lists[s]).then(function(){e.path("/")})},t.currentDate=(new Date).getTime(),t.addCurrentTask=function(s){l.addTask(s),t.task.name=null}}]),angular.module("doIt").controller("HistoryCtrl",["$scope","$filter","TaskHistory",function(t,s,a){t.taskHistory=a,t.tasks=a.all}]),angular.module("doIt").run(["$templateCache",function(t){t.put("app/history/history.html",'<div class="container"><div class="task-list"><div class="task-list-head">Task History</div><div class="task-list-body"><ul class="tasks"><li ng-repeat="task in tasks" ng-class="taskHistory.setTaskClass(task)" ng-show="taskHistory.getTaskStatus(task)" ng-swipe-left="taskHistory.reActivateTask(task)" class="task task-history animate-swipe-lt">{{ task.name }}<delete-task></delete-task></li></ul></div></div></div>'),t.put("app/lists/lists.html",'<div class="container"><form class="create-task-list" ng-submit="createList()"><input ng-model="list.newName" type="text" class="create-list-input" placeholder="+ Create new task list..."> <button type="submit" class="create-list-button">Create</button></form><div class="task-list"><div class="task-list-head">{{ list.name }} <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search tasks..."></div><form ng-submit="addCurrentTask(task)" class="add-task-container"><div class="add-task-header"><div class="new-task-label">Task description</div><div class="priority-label">Priority</div></div><div class="add-task"><input ng-model="task.name" class="new-task" type="text" placeholder="Enter new task..."><div class="select-style"><select ng-model="task.priority" ng-options="priority for priority in priorities" class="priority"><option value="" disabled="" selected="">Select priority...</option></select></div><button type="submit" class="add-btn">Add</button></div></form><div class="task-list-body"><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter" ng-hide="taskHistory.getTaskStatus(task)" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul></div></div><div class="delete-container"><button class="delete-btn" ng-click="deleteList()">Delete List</button></div></div>'),t.put("app/tasks/tasks.html",'<div class="container"><form class="create-task-list" ng-submit="createList()"><input ng-model="list.newName" type="text" class="create-list-input" placeholder="+ Create new task list..."> <button type="submit" class="create-list-button">Create</button></form><div class="task-list"><div class="task-list-head">Current Tasks <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search tasks..."></div><form ng-submit="addCurrentTask(task)" class="add-task-container"><div class="add-task-header"><div class="new-task-label">Task description</div><div class="priority-label">Priority</div></div><div class="add-task"><input ng-model="task.name" class="new-task" type="text" placeholder="Enter new task..."><div class="select-style"><select ng-model="task.priority" ng-options="priority for priority in priorities" class="priority"><option value="" disabled="" selected="">Select priority...</option></select></div><button type="submit" class="add-btn">Add</button></div></form><div class="task-list-body"><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter" ng-hide="taskHistory.getTaskStatus(task)" ng-swipe-right="taskHistory.completeTask(task)" class="task animate-swipe-rt">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul></div></div></div>'),t.put("components/footer/footer.html",'<div class="footer"><p>Made with ♥ by Jake</p></div>'),t.put("components/navbar/navbar.html",'<nav class="navbar navbar-static-top navbar-inverse" role="navigation" ng-controller="NavbarCtrl"><div class="container-fluid" id="navfluid"><div class="navbar-header"><a class="navbar-brand" ui-sref="home">d<i class="fa fa-check-circle"></i>.it</a> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#nav-collapse"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button></div><div class="collapse navbar-collapse" id="nav-collapse"><ul class="nav navbar-nav"><li ui-sref-active="active" data-toggle="collapse" data-target="#nav-collapse"><a ui-sref="home">Active Tasks</a></li><li ui-sref-active="active" ng-repeat="list in lists" data-toggle="collapse" data-target="#nav-collapse"><a ui-sref="lists({listId: list.$id})">{{ list.name }}</a></li><li ui-sref-active="active" data-toggle="collapse" data-target="#nav-collapse"><a ui-sref="history">Task History</a></li></ul></div></div></nav>')}]);