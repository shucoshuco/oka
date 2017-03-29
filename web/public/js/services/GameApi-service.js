(function(app) {
	app.service('GameApi', ['$resource', function($resource) {
		return $resource(
			'http://192.168.1.104:8080/games/:id',
			{id: '58d1ba776aec0e57220dfa08'},
			{
				newGame: {
					method: 'POST',
					url: 'http.//192.168.1.104:8080/games/game/userconf/:idConf',
					params: {idConf: 1},
				},
				rollDice: {
					method: 'POST',
					url: 'http://192.168.1.104:8080/games/:id/roll-dice',
					params: {id: '58d1ba776aec0e57220dfa08'},
				},
				status: {
					method: 'GET',
					url: 'http://192.168.1.104:8080/games/:id/status',
					params: {id: '58d1ba776aec0e57220dfa08'},
				},
				cell: {
					method: 'GET',
					url: 'http://192.168.1.104:8080/cells/cells/:id',
				},
			});
	}]);
})(web);
