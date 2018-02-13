(function(app) {
	app.service('CallService', ['$http', '$location', '$mdToast', 'AuthService',
		function($http, $location, $mdToast, AuthService) {
			let showToast = function(content) {
				$mdToast.show(
					$mdToast.simple()
						.content(content)
						.position('top right')
						.hideDelay(3000)
				);
			};

			let handleError = function(response) {
				switch (response.status) {
					case -1:
						showToast('Comunication failure');
						break;
					case 401:
						showToast('Authentication failure. Please login again');
						$location.path('/');
						break;
					case 500:
						showToast('Server error');
						break;
					default:
						showToast('Unknown error');
						break;
				};
				AuthService.markAsLogout();
			};

			return {
				callPrivateGet: function(url) {
					return new Promise(function(success, error) {
						$http.get(url)
						.then(
							success,
							function(response) {
								handleError(reponse);
								error(response);
							}
						);
					});
				},
				callPrivateService: function(service, params, success, error) {
					service(params, success, function(response) {
						handleError(response);
						error(response);
					});
				},
				handleError: handleError,
			};
		}]);
})(web);
