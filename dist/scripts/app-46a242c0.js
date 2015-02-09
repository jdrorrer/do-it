"use strict";angular.module("doIt",["firebase","ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider",function(t,a){t.state("home",{url:"/",templateUrl:"app/tasks/tasks.html",controller:"TasksCtrl"}).state("history",{url:"history",templateUrl:"app/history/history.html",controller:"HistoryCtrl"}),a.otherwise("/")}]).constant("FIREBASE_URI","https://do-it.firebaseio.com/"),angular.module("doIt").service("TaskHistory",["$firebase","FIREBASE_URI","$timeout",function(t,a){var s=new Firebase(a),e=t(s);return{tasks:e.$asArray(),getTaskStatus:function(t){return"active"===t.status?!1:!0},addTask:function(t){var a=t.name,s=t.priority,e="active",i=(new Date).getTime();t={name:a,status:e,priority:s,date:i},this.tasks.$add(t)},removeTask:function(t){this.tasks.$remove(t)},setExpiredTask:function(t,a,s){var e=864e5,i=s-t.date,r=Math.floor(i/e);r>=7&&"active"===this.tasks[a].status&&(this.tasks[a].status="expired",this.tasks.$save(a),console.log("'"+t.name+"' is older than 7 days. Changed status to 'expired' and moved to task history."))},setTaskClass:function(t){return"completed"===t.status?"completed":"expired"}}}]),angular.module("doIt").controller("NavbarCtrl",["$scope",function(t){t.date=new Date}]),angular.module("doIt").directive("deleteTask",["$firebase","FIREBASE_URI",function(t,a){return{template:'<i ng-click="onClick($parent.task, $parent.id)" class="fa fa-times-circle-o fa-3x" tooltip="Delete Task" tooltip-placement="right" ng-click="taskHistory.removeTask(task)"></i>',restrict:"E",replace:!0,scope:{},link:function(s){var e=new Firebase(a),i=t(e),r=i.$asArray();s.onClick=function(t,a){r.$remove(a),console.log("Permanently deleted task from history")}}}}]),angular.module("doIt").directive("completeTask",["$firebase","FIREBASE_URI",function(t,a){return{template:'<i ng-click="onClick($parent.task, $parent.id)" class="fa fa-check-circle-o fa-3x" tooltip="Complete Task" tooltip-placement="left"></i>',restrict:"E",replace:!0,scope:{},link:function(s){var e=new Firebase(a),i=t(e),r=i.$asArray();s.onClick=function(t,a){r[a].status="completed",r.$save(a),console.log("Moved completed task to history")}}}}]),angular.module("doIt").controller("TasksCtrl",["$scope","TaskHistory",function(t,a){t.taskHistory=a,t.tasks=a.tasks,t.task={},t.currentDate=(new Date).getTime(),t.checkExpiration=function(s,e){a.setExpiredTask(s,e,t.currentDate)},t.addCurrentTask=function(s){a.addTask(s),t.task.name=null,t.task.priority=null}}]),angular.module("doIt").controller("HistoryCtrl",["$scope","TaskHistory",function(t,a){t.taskHistory=a,t.tasks=a.tasks}]),angular.module("doIt").run(["$templateCache",function(t){t.put("app/history/history.html",'<div class="container"><div ng-include="\'components/navbar/navbar.html\'"></div><div class="task-list"><div class="task-list-head">Task History</div><div class="task-list-body"><ul class="tasks"><li ng-repeat="(id, task) in tasks" ng-show="taskHistory.getTaskStatus(task)" ng-class="taskHistory.setTaskClass(task)" class="task">{{ task.name }}<delete-task></delete-task></li></ul></div></div><div ng-include="\'components/footer/footer.html\'"></div></div>'),t.put("app/tasks/tasks.html",'<div class="container"><div ng-include="\'components/navbar/navbar.html\'"></div><div class="task-list"><div class="task-list-head">Current Tasks</div><div class="add-task-container"><div class="add-task-header"><div class="new-task-label">Task description</div><div class="priority-label">Priority</div></div><div class="add-task"><input ng-model="task.name" class="new-task" type="text" placeholder="Enter new task"> <input ng-model="task.priority" class="priority" type="text" placeholder="high, med, low"> <button class="add-btn" ng-click="addCurrentTask(task)">Add</button></div></div><div class="task-list-body"><ul class="tasks"><li ng-repeat="(id, task) in tasks" ng-hide="taskHistory.getTaskStatus(task)" ng-init="checkExpiration(task, id)" class="task">{{ task.name }}<complete-task></complete-task><delete-task></delete-task></li></ul></div></div><div></div><div ng-include="\'components/footer/footer.html\'"></div></div>'),t.put("components/footer/footer.html",'<div class="footer"><p>Made with ♥ by Jake</p></div>'),t.put("components/navbar/navbar.html",'<nav class="navbar navbar-static-top navbar-inverse" ng-controller="NavbarCtrl"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" ui-sref="home"><i class="fa fa-check-circle"></i> Do.it</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-6"><ul class="nav navbar-nav"><li ui-sref-active="active"><a ui-sref="home">Active Tasks</a></li><li ui-sref-active="active"><a ui-sref="history">Task History</a></li></ul><ul class="nav navbar-nav navbar-right"><li>Current date: {{ date | date:\'yyyy-MM-dd\' }}</li></ul></div></div></nav>')}]);