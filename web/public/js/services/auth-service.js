(function(app) {
	app.service('AuthService', ['$http', '$location', '$mdToast', '$mdDialog',
		function($http, $location, $mdToast, $mdDialog) {
			let pending = true;
			let user = undefined;

			userPromise = function() {
				return new Promise(function(success, error) {
					$http.get('http://192.168.1.105:8080/users/current')
						.then(
							function(response) {
								pending = false;
								user = response.data;
								success(user);
							},
							function(err) {
								pending = false,
								user = undefined;
								error(err);
							}
						);
				});
			};

			let showToast = function(content) {
				$mdToast.show(
					$mdToast.simple()
						.content(content)
						.position('top right')
						.hideDelay(3000)
				);
			};

			return {
				isLoggedIn: function() {
					return user !== undefined;
				},
				user: function() {
					return pending
						? userPromise()
						: new Promise(function(success, error) {
							if (user !== undefined) {
								success(user);
							} else {
								error();
							}
						});
				},
				startLogin: function(url) {
					let redirect = url || '/userhome';
					if (user !== undefined) {
						$location.path(redirect);
					} else {
						userPromise()
							.then(
								function() {
									$location.path(redirect);
								},
								function() {
									$mdDialog
										.show($mdDialog.login())
										.then(
											function successLogin() {
												$location.path(redirect);
											}, function errorLogin() {
											}
										);
								}
							);
					}
				},
				doLogin: function(username, password) {
					return new Promise(function(success, error) {
						$http.post(
							'http://192.168.1.105:8080/login',
							'username=' + username + '&password=' + password,
							{
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							}
						).then(function() {
							return userPromise();
						})
						.then(
							function successCallback(user) {
								showToast('Login completed');
								success(user);
							}, function errorCallback(response) {
								switch (response.status) {
									case -1: showToast('Comunication failure'); break;
									case 401: showToast('Wrong login'); break;
									case 500: showToast('Server error'); break;
									default: showToast('Unknown error'); break;
								}
								error(response);
							}
						);
					});
				},
				doLogout: function() {
					$http.post('http://192.168.1.105:8080/logout')
					.then(
						function successCallback(response) {
							showToast('Logout successfull');
							user = undefined;
							$location.path('/');
						}, function errorCallback(response) {
							console.log('Logout response: ', response);
							user = undefined;
							showToast('Wrong logout');
						}
					);
				},
				markAsLogout: function() {
					user = undefined;
				},
			};
		}]);
})(web);
