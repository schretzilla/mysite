var index = angular.module('index',[]);

index.config(function($interpolateProvider){
	//allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
index.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


index.controller('QuizCtrl', function QuizCtrl($scope, $log, $http){
	
	$scope.loadItems = function() {
		$http.get('/dynoquiz/api/quiz/').then(function(response){
			$scope.quizes = response.data.reverse();
		});
	}; // End loadItems 

	$scope.addQuiz = function(){
		$scope.date = new Date();
		quiz = {
		    'user':$scope.userId,
			'quiz_name':$scope.quizName,
			'quiz_details':$scope.quizDetails,
			'date_created':$scope.date
		};
		$scope.quizName=null;
		$scope.quizDetails=null;
		$http.post('/dynoquiz/api/quiz/', quiz).then(function(){
			$scope.loadItems();
		});
	};

	$scope.updateQuiz = function(){

	    quiz = {
	      'id':focusedQuiz.id,
          'quiz_name': $scope.quizName,
          'quiz_details':$scope.quizDetails,
          'date_created':focusedQuiz.date_created
	    };
        //focusedQuiz.quiz_name = $scope.quizName;
        //focusedQuiz.quizDetails = $scope.quizDetails;
        $http.put('/dynoquiz/api/quiz/'+quiz.id + '/', quiz).then(function(){
            $scope.loadItems();
        }, function(response) {
            alert("error: " + response.data);
        });
	};

	$scope.deleteQuiz = function(id) {
		$http.delete('/dynoquiz/api/quiz/' + id).then(function(){
			$scope.loadItems();
		});
	};

	$scope.toggleCreateQuiz = function() {
		$scope.createQuizFields = !$scope.createQuizFields;
	};

	$scope.formsetEditQuiz = function(quiz) {
	    $scope.updateQuizBtn = true;
	    $scope.editBtnClass = "active";
	    $scope.createBtnClass = "";
	    $scope.createQuizBtn = false;
	    setFocusedQuiz(quiz);
	    loadQuizFields(focusedQuiz);
	};

	$scope.formsetCreateQuiz = function() {
	    $scope.updateQuizBtn = false;
	    $scope.editBtnClass="disabled";
	    $scope.createBtnClass="active";
	    $scope.createQuizBtn = true;
	    setFocusedQuiz("");
	    loadQuizFields(focusedQuiz)
	}

	loadQuizFields = function(quiz) {
	    $scope.quizName = quiz.quiz_name;
	    $scope.quizDetails = quiz.quiz_details;
	};

    //Set Focused Quiz when Edit is selected
    setFocusedQuiz = function(quiz) {
        focusedQuiz = {
          'id':quiz.id,
          'quiz_name': quiz.quiz_name,
          'quiz_details':quiz.quiz_details,
          'date_created':quiz.date_created
        };
    };

    //ToDO: Remove
    quizToString = function(quiz) {
        return ('id:' + quiz.id + ' quiz_name:' + quiz.quiz_name + ' quiz_details:' + quiz.quiz_details + ' date_created:' + quiz.date_created)
    };

    $scope.shareQuiz = function(quiz) {
        $scope.curQuiz=quiz;
        $http.get('/dynoquiz/api/quiz/'+quiz.id+'/nonuser')
            .then(function (response) {
                $scope.nonUsers=response.data;
            }, function(error) {
                alert("Unable to load users " + error.message);
            });
    };

    $scope.shareWithUser = function(user) {
        $scope.curQuiz.users.push(user);
        updateQuiz($scope.curQuiz)
            .then(function (response) {
                user.saved=true;
            }, function(error) {
                alert("Unable to load users " + error.message);
            });
    };


    //On page load
    $scope.loadPage = function(userId) {
        $scope.loadItems();
        var focusedQuiz = "";
        $scope.formsetCreateQuiz();
        $scope.curUserId=userId;
    };

//TODO: Create Service Layer
    updateQuiz = function(quiz){
        return ($http.put('/dynoquiz/api/quiz/'+quiz.id + '/', quiz) );
    };


}); //End Index controller 