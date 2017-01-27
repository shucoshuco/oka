let web = angular.module('web',
	['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router']);

(function(app) {
	app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider',
		function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider.state('games', {
				url: '/games',
				templateUrl: 'partials/games-partial.html',
				controller: 'gamesController',
			}).state('start', {
				url: '/',
				templateUrl: 'partials/start-partial.html',
				controller: 'StartController',
			}).state('board', {
				url: '/board',
				templateUrl: 'partials/board-partial.html',
				controller: 'BoardController',
			});
			$mdThemingProvider.theme('default')
				.primaryPalette('deep-orange')
				.accentPalette('indigo')
				.warnPalette('red');
		},
	]);
})(web);
