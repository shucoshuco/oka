(function(app) {
	app.directive('winnerCell', [function() {
		return {
			template: '<div class="last-cell"></div>',
			restrict: 'E',
			replace: true,
			scope: {
				cell: '=',
			},
			link: function($scope, elem, attrs, controller) {
				let _cell = $scope.cell;
				$scope.$watch('cell.left', function() {
					elem.css('left', _cell.left);
					elem.css('top', $scope.cell.top);
					elem.css('width', $scope.cell.width);
					elem.css('height', $scope.cell.height);
				});
			},
		};
	}]);
})(web);
