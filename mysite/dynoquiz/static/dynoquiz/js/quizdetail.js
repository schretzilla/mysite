var quizDetail = angular.module('quizDetail',[]);

quizDetail.config(function($interpolateProvider){
    //allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//TODO: Either Implement or remove
quizDetail.directive('showChoices', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs){
            scope.choices = attrs.question.choice_set.all();
        },
        template: '<p ng-repeat="choice in choices">{{choice.id}}</p> <p>test</p>'
    };
});

quizDetail.controller('QuizDetailCtrl', function QuizDetailCtrl($scope, $log, $http){

    //On page load
    $scope.loadQuestions = function() {
       //save cur quiz id
       $http.get('/dynoquiz/api/quiz/'+$scope.quizId+'/question').then(function(response){
            $scope.questions = response.data;
       });
    };

    /*
    * LOAD
    */
    //TODO: Get choices should return a value
    $scope.getChoices = function(questionId) {
        $http.get('/dynoquiz/api/question/'+questionId+'/choice').then(function(response) {
             $scope.choices = response.data;
             focusedQuestion.choices=$scope.choices;
        });
    };

    //TODO: Load question on edit click
    $scope.getFullQuestion = function(questionId) {
       $http.get('/dynoquiz/api/quiz/'+$scope.quizId+'/question/'+questionId).then(function(response){
            $scope.questions = response.data;
       },
            function(data) {
                //Error
                alert("error: on get full question: " +data );
            });
    };

    $scope.addQuestion = function(){
        question = {
            'quiz':$scope.quizId,
            'question_text':$scope.questionText,
            'date_created':new Date()
        };
        $http.post('/dynoquiz/api/quiz/'+$scope.quizId+'/question/', question).then(function(){
            $scope.loadQuestions();
            $scope.question=null;

        });
    };

    $scope.updateQuestion = function(){
        question = {
            'id':focusedQuestion.id,
            'quiz':focusedQuestion.quiz,
            'question_text':$scope.questionText,
            'date_created':focusedQuestion.date_created,
        };

        $http.put('/dynoquiz/api/quiz/'+$scope.quizId+'/question/'+focusedQuestion.id, question).then(function(){
            $scope.loadQuestions();
        }, function(response) {
            alert("error: " + response.data);
        });
    };

    /**
    DELETE
    */
    $scope.deleteQuestion = function(questionId) {
        //alert("Deleting question: " + questionId);
        $http.delete('/dynoquiz/api/quiz/'+$scope.quizId+'/question/'+questionId).then(function(){
            $scope.loadQuestions();
        });
    };

    //TODO: This needs work, not updating the left hand side and something is wrong with the return (google return with async fns)
    $scope.deleteChoice = function(choiceId) {
        $http.delete('/dynoquiz/api/question/'+focusedQuestion.id+'/choice/'+choiceId).then(function(){
            //ReLoad Focused Questions Choices
            $scope.getChoices(focusedQuestion.id);
        });
    };


    $scope.postNewChoice = function() {
        var choice = {
            'question':focusedQuestion.id,
            'choice_text':$scope.newChoiceText,
            'votes':0,
            'date_created':new Date()
        };

        $http.post('/dynoquiz/api/question/'+focusedQuestion.id+'/choice/', choice).then(function(response){
            //Add newly created choice to the focused questions choices
            choice.id = response.data.id;
            focusedQuestion.choices.push(choice);
            loadQuestionFields(focusedQuestion);
            //clear choice box and hide it
            $scope.newChoiceText=null;
            $scope.addChoice();
        });
    };

    //Erase input fields when a question has been cancled
    cancelQuestion = function() {

    };

    //Set Focused Question when Edit is selected
    setFocusedQuestion = function(question) {
        focusedQuestion = {
            'id':question.id,
            'question_text':question.question_text,
            'quiz':question.quiz,
            'date_created':question.date_created,
            'choices':question.choices
        };
    };

    $scope.addChoice = function() {
        var newChoice = {
            'choice_text':"",
            'question':focusedQuestion.id,
            'votes':0,
            'date_created':new Date()

        };

        $scope.addNewChoiceBtn = !$scope.addNewChoiceBtn;
        $scope.addNewChoice = !$scope.addNewChoice;
    };


    //TODO: Save only one choice at a time
    $scope.saveChoice = function(choice) {
        var curChoice = "editChoice"+choice.id;
        $scope[curChoice] = !$scope[curChoice];

        var choice = {
            'quiz':$scope.quizId,
            'question_text':$scope.questionText,
            'date_created':new Date()
        };


    };



    loadQuestionFields = function(question) {
        $scope.questionText = question.question_text;
        $scope.choices = question.choices;
    };

    $scope.formsetEditChoice = function(choice) {
        setFocusedChoice(choice);
        var curChoice = "editChoice"+choice.id;
        $scope[curChoice] = !$scope[curChoice];
    };


    setFocusedChoice = function(choice) {
        focusedChoice = {
            'id':choice.id,
            'choice_text':choice.choice_text,
            'votes':choice.votes
        };
    };

    $scope.formsetEditQuestion = function(question) {
        setFocusedQuestion(question);
        loadQuestionFields(focusedQuestion);
    };

    $scope.loadPage = function(curQuizId) {
        //save persistant variables
        $scope.quizId = curQuizId;
        $scope.loadQuestions();
        //$scope.getFullQuestion(1);
    };

    var focusedQuestion = "";
    $scope.choices=[];

});