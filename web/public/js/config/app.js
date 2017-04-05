let web = angular.module('web',
	['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router',
		'ngResource']);

(function(app) {
	app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider',
		function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
			.state('start', {
				url: '/',
				templateUrl: 'partials/start-partial.html',
				controller: 'StartController',
			}).state('usergames', {
				url: '/usergames',
				templateUrl: 'partials/usergames-partial.html',
				controller: 'usergamesController',
			}).state('games', {
				url: '/games',
				templateUrl: 'partials/games-partial.html',
				controller: 'gamesController',
			}).state('board', {
				url: '/board/{boardId}',
				templateUrl: 'partials/board-partial.html',
				controller: 'BoardController',
			});
			$mdThemingProvider.theme('default')
				.primaryPalette('indigo')
				.accentPalette('deep-orange')
				.warnPalette('red');
		},
	]);
})(web);
