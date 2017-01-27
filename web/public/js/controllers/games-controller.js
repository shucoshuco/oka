(function(app) {
	app.controller('gamesController', ['$scope', '$mdSidenav', '$location',
		function($scope, $mdSidenav, $location) {
			$scope.openLeftMenu = function() {
				$mdSidenav('left').toggle();
			};

			$scope.go = function(path) {
				$location.path( path );
			};

			$scope.games = [
				{
					'name': 'OKASutra',
					'image': 'public/images/oca.jpg',
					'link': 'board',
					'description': [
						'Coge una probeta, échale un juego de la oca, ',
						'añade un libro de kamasutra y... ¡¡tachán!!',
					],
				},
				{
					'name': 'Dados',
					'image': 'public/images/dices.jpg',
					'link': 'board',
					'description': [
						'Lanza los dados y practica las posturas que la ',
						'suerte te depare.',
					],
				},
			];
	}]);
})(web);
