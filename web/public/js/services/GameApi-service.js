(function(app) {
	app.service('GameApi', ['$resource', function($resource) {
		return $resource(
			'http://192.168.1.105:8080/games/user/:id', {id: '@id'},
			{
				userGames: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/games/user',
					isArray: true,
					withCredentials: true,
				},
				newGameWithIdConf: {
					method: 'POST',
					url: 'http://192.168.1.105:8080/games/user/create/userconf',
					params: {idConf: '@id'},
					withCredentials: true,
				},
				newGameWithConf: {
					method: 'POST',
					url: 'http://192.168.1.105:8080/games/user/create/configurable',
					withCredentials: true,
				},
				newAnonymousGame: {
					method: 'POST',
					url: 'http://192.168.1.105:8080/games/user/create/anonymous',
					withCredentials: true,
				},
				rollDice: {
					method: 'POST',
					url: 'http://192.168.1.105:8080/games/user/:id/roll-dice',
					withCredentials: true,
				},
				status: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/games/user/:id/status',
					withCredentials: true,
				},
				cell: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/cells/:id',
					withCredentials: true,
				},
			});
	}]);
})(web);
