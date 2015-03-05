"use strict";angular.module("doIt",["xeditable","firebase","ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider",function(t,s){t.state("home",{url:"/",templateUrl:"app/tasks/tasks.html",controller:"TasksCtrl"}).state("history",{url:"/history",templateUrl:"app/history/history.html",controller:"HistoryCtrl"}).state("lists",{url:"/lists/:listId",templateUrl:"app/lists/lists.html",controller:"ListsCtrl"}),s.otherwise("/")}]).constant("FIREBASE_URI","https://do-it.firebaseio.com/"),angular.module("doIt").service("TaskList",["$firebase","FIREBASE_URI","$filter",function(t,s){var e=new Firebase(s),a=t(e.child("lists")),i=a.$asArray(),l={all:i,create:function(t){var s=t.newName;return t={name:s},console.log("Created new task list: "+t.name),i.$add(t)},get:function(s){return t(e.child("lists").child(s)).$asObject()},"delete":function(t){return console.log("Permanently deleted task list: "+t.name),i.$remove(t)},tasks:function(s){return t(e.child("tasks").orderByChild("listId").equalTo(s)).$asArray()}};return l}]),angular.module("doIt").service("TaskHistory",["$firebase","FIREBASE_URI","$filter","$stateParams","$timeout",function(t,s,e,a,i){var l=new Firebase(s),n=t(l.child("tasks")),r=n.$asArray(),o=t(l.child("tasks").orderByChild("status").equalTo("active")).$asArray(),c=function(t,s){var e=864e5,a=s-t.date,i=Math.floor(a/e),l=r.$indexFor(t.$id);i>=7&&"active"===r[l].status&&(r[l].status="expired",r.$save(l),console.log("'"+t.name+"' is older than 7 days. Changed status to 'expired' and moved to task history."))},d=(new Date).getTime();return r.$loaded(function(){for(var t=0;t<r.length;t++)c(r[t],d)}),{all:r,active:o,getTaskStatus:function(t){return"active"===t.status},addTask:function(t){var s,e=t.name,i=t.priority,l="active",n=(new Date).getTime();return s=a.listId?a.listId:12345,t={name:e,status:l,priority:i,date:n,listId:s},r.$add(t)},updateTask:function(t){var s=r.$indexFor(t.$id);r[s]=t,r.$save(s),console.log("Changed task name to: "+r[s].name)},completeTask:function(t){var s=r.$indexFor(t.$id);i(function(){r[s].status="completed",r.$save(s)},900),console.log("Moved completed task to history: "+t.name)},reActivateTask:function(t){var s=r.$indexFor(t.$id);i(function(){r[s].status="active",r.$save(s)},900),console.log("Changed task status to active: "+t.name)},removeTask:function(t){var s=r.$indexFor(t.$id);r.$remove(s)},setTaskClass:function(t){return"completed"===t.status?!0:!1}}}]),angular.module("doIt").controller("NavbarCtrl",["$scope","TaskList",function(t,s){t.taskList=s,t.lists=s.all}]),angular.module("doIt").directive("deleteTask",["$firebase","FIREBASE_URI","$timeout",function(t,s,e){return{template:'<i ng-click="onClick($parent.task)" class="fa fa-times-circle-o fa-3x" tooltip="Delete Task" tooltip-placement="right" ng-click="taskHistory.removeTask(task)"></i>',restrict:"E",replace:!0,scope:{},link:function(a){var i=new Firebase(s),l=t(i.child("tasks")),n=l.$asArray();a.onClick=function(t){var s=n.$indexFor(t.$id);e(function(){n.$remove(s)},900),console.log("Permanently deleted task from history: "+t.name)}}}}]),angular.module("doIt").directive("completeTask",["$firebase","FIREBASE_URI","$timeout",function(t,s,e){return{template:'<i ng-click="onClick($parent.task);" class="fa fa-check-circle-o fa-3x" tooltip="Complete Task" tooltip-placement="left"></i>',restrict:"E",replace:!0,scope:{},link:function(a){var i=new Firebase(s),l=t(i.child("tasks")),n=l.$asArray();a.onClick=function(t){var s=n.$indexFor(t.$id);e(function(){n[s].status="completed",n.$save(s)},900),console.log("Moved completed task to history: "+t.name)}}}}]),angular.module("doIt").controller("TasksCtrl",["$scope","$location","$document","TaskList","TaskHistory",function(t,s,e,a,i){t.taskList=a,t.lists=a.all,t.list={newName:""},t.taskHistory=i,t.tasks=i.active,t.allTasks=i.all,t.task={},t.currentDate=(new Date).getTime(),t.priorities=["high","medium","low"],t.createList=function(){a.create(t.list).then(function(e){s.path("/lists/"+e.key()),t.list={newName:""}})};t.hideButtons=function(){angular.element(".buttons").addClass("is-hidden")},t.showButtons=function(){angular.element(".buttons").removeClass("is-hidden")},t.addCurrentTask=function(s){i.addTask(s),t.task.name=null},t.updateTask=function(t){i.updateTask(t)}}]),angular.module("doIt").controller("ListsCtrl",["$scope","$stateParams","$location","TaskList","TaskHistory","$modal",function(t,s,e,a,i,l){t.taskList=a,t.lists=a.all,t.list=a.get(s.listId),t.tasks=a.tasks(s.listId),t.list.newName="",t.taskHistory=i,t.task={},t.currentDate=(new Date).getTime(),t.priorities=["high","medium","low"],t.createList=function(){a.create(t.list).then(function(s){e.path("/lists/"+s.key()),t.list={newName:""}})},t.open=function(s){var e=l.open({templateUrl:"app/lists/delete-list-modal.html",controller:"DeleteListCtrl",size:s,backdrop:!0,resolve:{list:function(){return t.list}}});e.result.then(function(){t.deleteList()})},t.deleteList=function(){for(var s=t.lists.$indexFor(t.list.$id),l=0;l<t.tasks.length;l++)i.removeTask(t.tasks[l]);a.delete(t.lists[s]).then(function(){e.path("/")})},t.hideButtons=function(){angular.element(".buttons").addClass("is-hidden")},t.showButtons=function(){angular.element(".buttons").removeClass("is-hidden")},t.addCurrentTask=function(s){i.addTask(s),t.task.name=null},t.updateTask=function(t){i.updateTask(t)}}]),angular.module("doIt").controller("DeleteListCtrl",["$scope","$modalInstance","list",function(t,s,e){t.list=e,t.delete=function(){s.close()},t.cancel=function(){s.dismiss("cancel")}}]),angular.module("doIt").controller("HistoryCtrl",["$scope","$filter","TaskHistory",function(t,s,e){t.taskHistory=e,t.tasks=e.all}]),angular.module("doIt").run(["$templateCache",function(t){t.put("app/history/history.html",'<div class="container"><div class="task-list"><div class="task-list-head">Task History <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search..."></div><div class="task-list-body"><h4 class="priority-header">High</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'high\'} | filter: {status: \'!active\'}" ng-init="swipe = false;" ng-class="{\'completed\': taskHistory.setTaskClass(task), \'animate-swipe-lt\': swipe}" ng-swipe-left="swipe = !swipe; taskHistory.reActivateTask(task)" class="task task-history">{{ task.name }}<delete-task ng-click="swipe = !swipe;"></delete-task></li></ul><h4 class="priority-header">Medium</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'medium\'} | filter: {status: \'!active\'}" ng-init="swipe = false;" ng-class="{\'completed\': taskHistory.setTaskClass(task), \'animate-swipe-lt\': swipe}" ng-swipe-left="swipe = !swipe; taskHistory.reActivateTask(task)" class="task task-history">{{ task.name }}<delete-task ng-click="swipe = !swipe;"></delete-task></li></ul><h4 class="priority-header">Low</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'low\'} | filter: {status: \'!active\'}" ng-init="swipe = false;" ng-class="{\'completed\': taskHistory.setTaskClass(task), \'animate-swipe-lt\': swipe}" ng-swipe-left="swipe = !swipe; taskHistory.reActivateTask(task)" class="task task-history">{{ task.name }}<delete-task ng-click="swipe = !swipe;"></delete-task></li></ul></div></div></div>'),t.put("app/lists/delete-list-modal.html",'<div class="modal-header"><h3 class="modal-title">Delete Task List</h3></div><div class="modal-body"><br>Are you sure you want to delete this task list? <b>{{ list.name }}</b><br><br>This list will be permanently deleted as well as all tasks associated with it.<br><br></div><div class="modal-footer"><button class="btn btn-danger" ng-click="delete()">Delete</button> <button class="btn btn-primary" ng-click="cancel()">Cancel</button></div>'),t.put("app/lists/lists.html",'<div class="container"><form class="create-task-list" ng-submit="createList()"><input ng-model="list.newName" type="text" class="create-list-input" placeholder="+ Create new task list..."> <button type="submit" class="create-list-button">Create</button></form><div class="task-list"><div class="task-list-head">{{ list.name }} <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search..."></div><form ng-submit="addCurrentTask(task)" class="add-task-container"><div class="add-task-header"><div class="new-task-label">Task description</div><div class="priority-label">Priority</div></div><div class="add-task"><input ng-model="task.name" class="new-task" type="text" placeholder="Enter new task..."><div class="select-style"><select ng-model="task.priority" ng-options="priority for priority in priorities" class="priority"><option value="" disabled="" selected="">Select priority...</option></select></div><button type="submit" class="add-btn">Add</button></div></form><div class="task-list-body"><h4 class="priority-header priority-high-header">High</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'high\'} | filter: {status: \'active\'}" ng-init="swipe = false;" ng-swipe-right="swipe = !swipe; taskHistory.completeTask(task)" ng-class="{\'animate-swipe-rt\': swipe}" class="task"><span editable-text="task.name" onaftersave="updateTask(task)" onshow="hideButtons()" onhide="showButtons()">{{ task.name }}</span><span class="buttons"><complete-task ng-click="swipe = !swipe;"></complete-task><delete-task ng-click="swipe = !swipe;"></delete-task></span></li></ul><h4 class="priority-header">Medium</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'medium\'} | filter: {status: \'active\'}" ng-init="swipe = false;" ng-swipe-right="swipe = !swipe; taskHistory.completeTask(task)" ng-class="{\'animate-swipe-rt\': swipe}" class="task"><span editable-text="task.name" onaftersave="updateTask(task)" onshow="hideButtons()" onhide="showButtons()">{{ task.name }}</span><span class="buttons"><complete-task ng-click="swipe = !swipe;"></complete-task><delete-task ng-click="swipe = !swipe;"></delete-task></span></li></ul><h4 class="priority-header">Low</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'low\'} | filter: {status: \'active\'}" ng-init="swipe = false;" ng-swipe-right="swipe = !swipe; taskHistory.completeTask(task)" ng-class="{\'animate-swipe-rt\': swipe}" class="task"><span editable-text="task.name" onaftersave="updateTask(task)" onshow="hideButtons()" onhide="showButtons()">{{ task.name }}</span><span class="buttons"><complete-task ng-click="swipe = !swipe;"></complete-task><delete-task ng-click="swipe = !swipe;"></delete-task></span></li></ul></div><div class="delete-link-container"><a class="delete-link" ng-click="open()">&#10005 Delete this list</a></div></div></div>'),t.put("app/tasks/tasks.html",'<div class="container"><form class="create-task-list" ng-submit="createList()"><input ng-model="list.newName" type="text" class="create-list-input" placeholder="+ Create new task list..."> <button type="submit" class="create-list-button">Create</button></form><div class="task-list"><div class="task-list-head">Current Tasks <input ng-model="task.searchFilter" type="text" class="search-input" placeholder="Search..."></div><form ng-submit="addCurrentTask(task)" class="add-task-container"><div class="add-task-header"><div class="new-task-label">Task description</div><div class="priority-label">Priority</div></div><div class="add-task"><input ng-model="task.name" class="new-task" type="text" placeholder="Enter new task..."><div class="select-style"><select ng-model="task.priority" ng-options="priority for priority in priorities" class="priority"><option value="" disabled="" selected="">Select priority...</option></select></div><button type="submit" class="add-btn">Add</button></div></form><div class="task-list-body"><h4 class="priority-header priority-high-header">High</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'high\'}" ng-init="swipe = false;" ng-swipe-right="swipe = !swipe; taskHistory.completeTask(task);" ng-class="{\'animate-swipe-rt\': swipe}" class="task"><span editable-text="task.name" onaftersave="updateTask(task)" onshow="hideButtons()" onhide="showButtons()">{{ task.name }}</span><span class="buttons"><complete-task ng-click="swipe = !swipe;"></complete-task><delete-task ng-click="swipe = !swipe;"></delete-task></span></li></ul><h4 class="priority-header">Medium</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'medium\'}" ng-init="swipe = false;" ng-swipe-right="swipe = !swipe; taskHistory.completeTask(task)" ng-class="{\'animate-swipe-rt\': swipe}" class="task"><span editable-text="task.name" onaftersave="updateTask(task)" onshow="hideButtons()" onhide="showButtons()">{{ task.name }}</span><span class="buttons"><complete-task ng-click="swipe = !swipe;"></complete-task><delete-task ng-click="swipe = !swipe;"></delete-task></span></li></ul><h4 class="priority-header">Low</h4><ul class="tasks"><li ng-repeat="task in tasks | filter: task.searchFilter | filter: {priority: \'low\'}" ng-init="swipe = false;" ng-swipe-right="swipe = !swipe; taskHistory.completeTask(task)" ng-class="{\'animate-swipe-rt\': swipe}" class="task"><span editable-text="task.name" onaftersave="updateTask(task)" onshow="hideButtons()" onhide="showButtons()">{{ task.name }}</span><span class="buttons"><complete-task ng-click="swipe = !swipe;"></complete-task><delete-task ng-click="swipe = !swipe;"></delete-task></span></li></ul></div></div></div>'),t.put("components/footer/footer.html",'<div class="footer"><p>Made with ♥ by Jake</p></div>'),t.put("components/navbar/navbar.html",'<nav class="navbar navbar-static-top navbar-inverse" role="navigation" ng-controller="NavbarCtrl"><div class="container-fluid" id="navfluid"><div class="navbar-header"><a class="navbar-brand" ui-sref="home">d<i class="fa fa-check-circle"></i>.it</a> <button type="button" class="navbar-toggle" ng-init="navCollapsed = true" ng-click="navCollapsed = !navCollapsed"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button></div><div class="collapse navbar-collapse" id="nav-collapse" collapse="navCollapsed" ng-click="navCollapsed=true"><ul class="nav navbar-nav"><li ui-sref-active="active"><a ui-sref="home">Active Tasks</a></li><li ui-sref-active="active" ng-repeat="list in lists"><a ui-sref="lists({listId: list.$id})">{{ list.name }}</a></li><li ui-sref-active="active"><a ui-sref="history">Task History</a></li></ul></div></div></nav>')}]);