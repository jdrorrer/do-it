'use strict';

angular.module('doIt', ['firebase', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/tasks/tasks.html',
        controller: 'TasksCtrl'
      })
      .state('history', {
        url: 'history',
        templateUrl: 'app/history/history.html',
        controller: 'HistoryCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FIREBASE_URI', 'https://crackling-heat-9699.firebaseio.com/');
