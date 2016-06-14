var quizDetail = angular.module('quizDetail',[]);

quizDetail.config(function($interpolateProvider){
    //allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
quizDetail.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


quizDetail.controller('QuizDetailCtrl', function QuizDetailCtrl($scope, $log, $http){

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

    /*
    * Add new question and its choices to the DB
    */
    $scope.addQuestion = function(){
        question = {
            'quiz':$scope.quizId,
            'question_text':$scope.questionText,
            'choices':[],
            'date_created':new Date()
        };

        postQuestion(question)
            .then(function (response) {
                //Append to question list
                question = response.data;
                //TODO: Change this to questionList or change choiceList to choices
                $scope.questions.push(question);

                //Post Choices
                angular.forEach($scope.choiceList, function(choice, key){
                    postNewChoice(question, choice.text);
                });

                //clean form
                $scope.questionText = "";
                //$scope.loadQuestions();
                $scope.choiceList=[choiceObj(1,"")];
            }, function(error) {
                alert ("Unable to post question" + error.message);
            });

    };

    postNewChoice = function(question, choiceText) {
        //Only post non empty choices
        if (choiceText != ""){
            var choice = {
                'question':question.id,
                'choice_text':choiceText,
                'votes':0,
            };

            postChoice(choice)
                .then(function (response) {
                    //Append choice to questions list
                    choice = response.data;
                    question.choices.push(choice);
                }, function(error) {
                    alert("Unable to post choice " + error.message);
                });
        }
    };

    //Save focused text's value before it changes
    $scope.persistCurText = function(curText) {
        //TODO: rename curText if it doesn't make sense
        $scope.curText = curText;
    };

    /*
    * Update Choice on deselect
    */
    $scope.updateChoice = function(choice) {
        //Detect if choice has been edited
        if (choice.choice_text != "" && choice.choice_text != $scope.curText)
        {
            updateChoice(choice);
        }
        $scope.formStatus = "Saved"
    };

    /*
    * Update Question on deselect
    */
    //TODO: Can probably consolidate this function with update choice fn
    $scope.updateQuestion = function(question){
        //Detect if question has been edited
        if (question.question_text != "" && question.question_text != $scope.curText)
        {
            updateQuestion(question);
        }
        $scope.formStatus = "Saved"
    };

    /**
    DELETE
    */
    $scope.removeQuestion = function(questionIndex) {
        //TODO add confirm
        question = $scope.questions[questionIndex];
        deleteQuestion(question.id)
            .then(function (response) {
                //reload question list... might not be needed
                $scope.questions.splice(questionIndex,1);
            }, function(error) {
                alert("Unable to delete question "  + error.message);
            });
    };

    //Update Status Variable on input change
    $scope.updateStatus = function() {
        $scope.formStatus = "Saving";
    };

    //Load Question List
    //TODO this doesnt need to be scope
    $scope.loadQuestions = function() {
        getQuestions($scope.quizId)
            .then(function (response) {
                $scope.questions=response.data;
            }, function(error) {
                alert("Unable to load questions " + error.message);
            });
    };


    /*
    * Service Layer
    */
    // Question Post
    postQuestion = function(question) {
        return ( $http.post('/dynoquiz/api/quiz/'+question.quiz+'/question/', question) );
    };

    // Choice Post
    postChoice = function(choice) {
        return ( $http.post('/dynoquiz/api/question/'+choice.question+'/choice/', choice) );
    };

    // Update Choice
    updateChoice = function(choice) {
        $http.put('/dynoquiz/api/question/'+choice.question+'/choice/'+choice.id+'/', choice)
    };

    // Get Questions List
    getQuestions = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/question') );
    };

    // Delete Question
    deleteQuestion = function(questionId) {
        return ( $http.delete('/dynoquiz/api/quiz/'+$scope.quizId+'/question/'+questionId + '/') );
    };

    // Update Question
    updateQuestion = function(question) {
        $http.put('/dynoquiz/api/quiz/'+ question.quiz +'/question/'+question.id+'/', question)
    };
    /*
    *End Service Layer
    */

    /*
    * Model Layer
    */
    choiceObj = function(id, text) {
        return{
           'id':id,
           'choice_text':text,
        };
    };
    /*
    *End Model Layer
    */





    //TODO: This needs work, not updating the left hand side and something is wrong with the return (google return with async fns)
    $scope.deleteChoice = function(choiceId) {
        $http.delete('/dynoquiz/api/question/'+focusedQuestion.id+'/choice/'+choiceId + '/').then(function(){
            //ReLoad Focused Questions Choices
            $scope.getChoices(focusedQuestion.id);
        });
    };


    //Erase input fields when a question has been canceled
    $scope.cancelQuestion = function() {
        $scope.choiceList=[choiceObj(1,"")];
        $scope.questionText = "";
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
        $scope.choiceList=[choiceObj(1,"")];

    };

    //Validates that the question form is complete
    $scope.questionValid = function() {
        return ($scope.choiceList.length > 1 && $scope.questionText != null )
    }

    /**
    * dynamicList: Appends to objectList if specified attribute of last element is not null
    * Args:
    *   objectList: list of objects you are building
    *   attr: Attribute used to determine if list should be appended
    */
    $scope.dynamicList = function(objectList, attr) {
        //Add new input if input above has been used
        listLength = objectList.length;
        attribute = objectList[(listLength-1)][attr];
        if ( attribute != ""){
           newObject = {
                 id:objectList.length,
           };
           newObject[attr] = "";
           objectList.push(newObject);
        } else if (objectList[(listLength-2)][attr] == ""){
            //Drop last object if 2nd to last object attr is ""
            objectList.pop();
        }
    };

    /* DEPRECIATED DELETE
    //TODO: Save only one choice at a time
    $scope.saveChoice = function(choice) {
        var curChoice = "editChoice"+choice.id;
        $scope[curChoice] = !$scope[curChoice];

        //TODO: Why is this question_text???
        var choice = {
            'quiz':$scope.quizId,
            'question_text':$scope.questionText,
            'date_created':new Date()
        };
    };
    */

    var focusedQuestion = "";
    $scope.choices=[];

});