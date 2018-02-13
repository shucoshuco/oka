(function(app) {
	app.controller('StartController',
		['$scope', '$location', 'AuthService', 'GameApi',
		function($scope, $location, AuthService, GameApi) {
			$scope.showLogin = function showLogin(event) {
				AuthService.startLogin();
			};

			$scope.startDefault = function startDefault() {
				GameApi.newAnonymousGame({},
					function success(response) {
						$location.path('board/' + response.id);
					}, function error() {
						alert('Error creando juego por defecto');
					}
				);
			};
		}]);
})(web);
