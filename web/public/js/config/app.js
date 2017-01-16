let web = angular.module('web',
    ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router']);

(function(app) {
    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider.state('board', {
                url: '/',
                templateUrl: 'partials/board-partial.html',
                controller: 'BoardController',
            }).state('about', {
                url: '/about',
                templateUrl: 'partials/about-partial.html',
                controller: 'AboutController',
            });
        },
    ]);
})(web);
