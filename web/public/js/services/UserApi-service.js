(function(app) {
	app.service('UserApi', ['$resource', function($resource) {
		return $resource(
			'http://192.168.1.105:8080/users/current', {},
			{
				userConfs: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/config/user',
					isArray: true,
					withCredentials: true,
				},
			});
	}]);
})(web);
