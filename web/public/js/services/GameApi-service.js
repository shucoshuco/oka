(function(app) {
	app.service('GameApi', ['$resource', function($resource) {
		return $resource(
			'http://192.168.1.105:8080/games/:id', {id: '@id'},
			{
				userGames: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/games/users/:userId',
					isArray: true,
				},
				newGameWithIdConf: {
					method: 'POST',
					url: 'http://192.168.1.105:8080/games/game/create/userconf',
					params: {idConf: '@id'},
				},
				newGameWithConf: {
					method: 'POST',
					url: 'http://192.168.1.105:8080/games/game/create/:userId/configurable',
					params: {userId: 1},
				},
				rollDice: {
					method: 'POST',
					url: 'http://192.168.1.105:8080/games/:id/roll-dice',
				},
				status: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/games/:id/status',
				},
				cell: {
					method: 'GET',
					url: 'http://192.168.1.105:8080/cells/cells/:id',
				},
			});
	}]);
})(web);
