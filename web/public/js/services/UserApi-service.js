(function(app) {
	app.service('UserApi', ['$resource', function($resource) {
		return $resource(
			'http://192.168.1.105:8080/users/:id', {},
			{
				userConfs: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/users/confs/user/:userId',
					isArray: true,
				},
			});
	}]);
})(web);
