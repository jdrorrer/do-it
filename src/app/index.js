'use strict';

angular.module('doIt', ['xeditable', 'firebase', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/tasks/tasks.html',
        controller: 'TasksCtrl'
      })
      .state('history', {
        url: '/history',
        templateUrl: 'app/history/history.html',
        controller: 'HistoryCtrl'
      })
      .state('lists', {
        url: '/lists/:listId',
        templateUrl: 'app/lists/lists.html',
        controller: 'ListsCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FIREBASE_URI', 'https://do-it.firebaseio.com/');
