let web = angular.module('web',
	['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router',
		'ngResource']);

(function(app) {
	app.config(
		['$stateProvider', '$urlRouterProvider', '$mdThemingProvider',
			'$mdDialogProvider', '$mdToastProvider', '$httpProvider',
			function($stateProvider, $urlRouterProvider, $mdThemingProvider,
						$mdDialogProvider, $mdToastProvider, $httpProvider) {
				$urlRouterProvider.otherwise('/');

				$stateProvider
				.state('start', {
					url: '/',
					templateUrl: 'partials/start-partial.html',
					controller: 'StartController',
				}).state('userhome', {
					url: '/userhome',
					templateUrl: 'partials/userhome-partial.html',
					controller: 'userhomeController',
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

				$mdDialogProvider.addPreset('login', {
					options: function() {
						return {
							controller: LoginController,
							templateUrl: 'partials/login.tmpl.html',
							parent: angular.element(document.body),
							clickOutsideToClose: true,
//							fullscreen: $scope.useFullScreen,
							openFrom: {
								top: -150,
								left: document.documentElement.clientWidth / 2 - 150,
								width: 300,
								height: 300,
							},
							closeTo: {
								top: -150,
								left: document.documentElement.clientWidth / 2 - 150,
								width: 300,
								height: 300,
							},
						};
					},
				});

				$httpProvider.defaults.withCredentials = true;

				let LoginController =
					function loginController(
							$scope, $mdDialog, $mdToast, $http, AuthService) {
						$scope.username = '';
						$scope.password = '';

						$scope.close = function() {
							$mdDialog.cancel();
						};

						$scope.login = function() {
							AuthService.doLogin($scope.username, $scope.password)
							.then(
								function successCallback(response) {
									$mdDialog.hide();
								}, function errorCallback(response) {
								}
							);
						};
					};
			},
	]);
})(web);


web.run(['$rootScope', '$location', 'AuthService',
	function($rootScope, $location, AuthService) {
		let privateRoutes = ['/userhome', '/games'];

		$rootScope.$on('$stateChangeStart', function(event, route) {
			if (privateRoutes.indexOf(route.url) > -1) {
				AuthService.user()
				.then(function() {
					},
					function() {
						console.log('DENY : Redirecting to Login');
						event.preventDefault();
						$location.path('/');
					}
				);
			}
		});
	}]
);
