(function(app) {
	app.service('fileUpload', ['$http', function($http) {
		this.uploadFileToUrl = function(file, uploadUrl) {
			let fd = new FormData();
			fd.append('file', file);

			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined},
			}).success(
				function() {
				}
			).error(
				function() {
				}
			);
		};
	}]);
})(web);
