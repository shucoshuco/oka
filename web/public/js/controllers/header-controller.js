(function(app) {
	app.controller('HeaderController',
		['$scope', '$http', '$mdToast', '$location', 'AuthService',
		function($scope, $http, $mdToast, $location, AuthService) {
			$scope.logout = AuthService.doLogout;
			$scope.isLoggedIn = AuthService.isLoggedIn;
			$scope.home = function() {
				$location.path('/userhome');
			};
		},
	]);
})(web);
