(function(app) {
	app.controller('usergamesController',
		['$scope', '$location', '$state', 'GameApi', '$mdDialog', 'UserApi',
		function($scope, $location, $state, GameApi, $mdDialog, UserApi) {
			$scope.user = 1;
			$scope.loading = true;
			$scope.games = GameApi.userGames({userId: 1},
				function success() {
					$scope.loading = false;
					$scope.error = false;
				}, function error(error) {
					$scope.error = error;
					console.error('Error: ', error);
					$scope.loading = false;
				}
			);

			$scope.openBoard = function openBoard(board) {
				$location.path('board/' + board);
			};

			$scope.createGameWithIdConf = function createGameWithIdConf(idConf) {
				let game = GameApi.newGameWithIdConf({id: idConf},
					function success() {
						$scope.openBoard(game.id);
					}, function error(error) {
						alert(error);
					}
				);
			};

			$scope.createGameWithConf = function createGameWithConf(conf) {
				let game = GameApi.newGameWithConf(conf,
					function success() {
						$scope.openBoard(game.id);
					}, function error(error) {
						alert(error);
					}
				);
			};


			$scope.confirmRemoveGame = function confirmRemoveGame(ev, id) {
				// Appending dialog to document.body to cover sidenav in docs app
				let confirm = $mdDialog.confirm()
					.title('¿Quieres eliminar este juego?')
					.textContent(
						'Ten en cuenta que ya no podrás '
						+ 'retomar este juego en el futuro.')
					.ariaLabel('Borrar juego')
					.targetEvent(ev)
					.ok('Sí, bórralo')
					.cancel('Cancelar');

				$mdDialog.show(confirm).then(function() {
					$scope.removeGame(id);
				});
			};

			$scope.removeGame = function removeGame(id) {
				GameApi.delete({id: id},
					function success() {
						$state.reload();
					}, function error(error) {
						alert(error);
					}
				);
			};

			$scope.showNewGameDialog = function(ev) {
				$mdDialog.show({
					controller: NewGameController,
					templateUrl: 'partials/newGame.tmpl.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: false,
				})
				.then(function(answer) {
					if (answer.withIdConf) {
						$scope.createGameWithIdConf(answer.idConf);
					} else if (answer.withConf) {
						$scope.createGameWithConf(answer.conf);
					}
				});
			};

			/**
			 * Controller used to manage dialgos.
			 * @param {Object} $scope Scope of the controler
			 * @param {Object} $mdDialog Injection of $mdDialog object
			 */
			function NewGameController($scope, $mdDialog) {
				$scope.selectedIndex = 0;

				$scope.idConf = -1;
				$scope.conf = {
					name: '',
					ncells: 69,
					dice: 3,
					okaGap: 8,
					levels: [13, 13, 13, 13, 17],
					players: [
						{
							name: 'Felix',
							alias: 'Machote',
							gender: 'MALE',
							nitems: 5,
						},
						{
							name: 'Isabel',
							alias: 'Zorruca',
							gender: 'FEMALE',
							nitems: 5,
						},
					],
				};

				$scope.configurations = UserApi.userConfs({userId: 1},
					function success(confs) { },
					function error(error) {
						alert(error);
					}
				);

				$scope.cancel = function() {
					$mdDialog.cancel();
				};

				$scope.canSubmit = function() {
					if (!$scope.gameForm) {
						return false;
					}
					switch($scope.selectedIndex) {
						case 0: return $scope.idConf >= 0;
						case 1: return $scope.gameForm.$valid;
					}
				};

				$scope.createFromConf = function() {
					switch($scope.selectedIndex) {
						case 0:
							if ($scope.idConf >= 0) {
								$mdDialog.hide({withIdConf: true, idConf: $scope.idConf});
							}
							break;
						case 1:
							if ($scope.gameForm.$valid) {
								$mdDialog.hide({withConf: true, conf: $scope.conf});
							}
							break;
					}
				};
			};
	}]);
})(web);
