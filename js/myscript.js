var contexto = canvas.getContext("2d"); 

var 
rightAnswer,
rightAnswIndex,
wrongAnswers,
prevQuestion,
life,
initialLife=20,
player,
ninjaVioleta,
ninjaVerde,
ninjaMarrom,
gamePaused = true
desenhaFundo();   

//-------------------------------------------Draw the Background------------------------------------

function desenhaFundo () { 
	//preenche o fundo com cinza escuro 
	contexto.fillStyle = "dimgray"; contexto.fillRect(0, 0, canvas.width, canvas.height); //calcada superior 
	contexto.fillStyle = "lightgray"; contexto.fillRect(0, 0, canvas.width, 80); //calcada inferior 
	contexto.fillStyle = "lightgray"; contexto.fillRect(0, 380, canvas.width, 100); //faixas 
	contexto.fillStyle = "white"; 
	for(var i = 0; i < 25; i++){ 
		contexto.fillRect(i*30-5, 185, 20, 4); 
		contexto.fillRect(i*30-5, 280, 20, 4); 
	};  
}  

//-----------------------------------------Set the Sprite class-----------------------------------

function Sprite(caminhoDaImagem, xInicial, yInicial) { 	
	this.x = xInicial; 
	this.y = yInicial; 
	this.imagem = new Image(); 
	this.imagem.src = caminhoDaImagem; 
	var that = this; 
	this.imagem.onload = function() { 
		that.largura = that.imagem.width; 
		that.altura = that.imagem.height; 
		that.desenhaImagem(); 
	} 
	
	this.desenhaImagem = function() { 
		contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura); 
		contexto.strokeStyle="darkred"; 
		contexto.lineWidth = 0.2; 
		contexto.strokeRect(this.x, this.y, this.largura, this.altura); 
	}			
	
	
	this.move = function(dx, dy) {				  
		this.x += dx; 
		this.y += dy; 
		
		//limites 
		if(this.x > canvas.width) { 
			this.x =- this.largura; 
			} else if(this.x < -this.largura) { 	   
			this.x = canvas.width; 	   
		} 
		if(this.y > canvas.height - this.altura + 5) { 
		this.y -= dy; } 
		
		else if(this.y <= -5) { 
		this.y = canvas.height - this.altura; } 
	}
	
	this.colidiu = function(outro) { 
		var colidiuNoXTopo = outro.x >= this.x && outro.x <= (this.x + this.largura); 
		var colidiuNoYTopo = outro.y >= this.y && outro.y <= (this.y + this.altura); 
		var colidiuNoXBase = (outro.x + outro.largura) >= this.x && (outro.x + + outro.largura) <= (this.x + this.largura); 
		var colidiuNoYBase = (outro.y + outro.altura) >= this.y && (outro.y + outro.altura) <= (this.y + this.altura); 
		
		return (colidiuNoXTopo && colidiuNoYTopo) || (colidiuNoXBase && colidiuNoYBase); 
	} 
	
}


//-------------------------------------------Start the Game-----------------------------------------

$('.game_over').hide();

$('.inicio, .game_over').click(function(){
	start();
	$(this).hide();
});

function start() {	
	gamePaused = false;
	$('.insercao').css('visibility', 'visible');	
	life = initialLife;
	
	var 
	questions = [],
	answers = [],
	rightAnswer,
	prevAnswer = null;	
	
	//---------------------Shuffle a random question and its answer-------------------------------	
	
	initQuestionAndAnswers();
	
	function initQuestionAndAnswers() {	
	
	    prevQuestion = questions[0]
	
	    $('.insere_respostas div').empty();	
		
	    questions = ['porta',   'cadeira', 'parede', 'mesa', 'comer', 'dormir', 'colher', 'prato', 'acordar', 'noite'];
		answers =   ['door', 'chair',      'wall',  'table',  'eat',    'sleep',  'spoon' , 'dish', 'wake up' , 'night' ];
				
		/*
		Catch the value of the right answer on the previous turn to prohibit it to be 
		repeated on the current turn in the 'prohibitRepetition()' function
		*/	
		
		prohibitRepetition();
		
		function prohibitRepetition() {
			if(prevQuestion){
				for(i=0; i < questions.length; i++){
					if(questions[i] == prevQuestion) {
						var indexaa = questions.indexOf(questions[i]);	
						questions.splice(indexaa, 1);
						answers.splice(indexaa, 1);			 
					}
				}
			}	
		}
				
	    //Clone the arrays to save their original positions
	    questsInitialPositions = questions.slice();
		answsInitialPositions = answers.slice();		
		
		//Shuffle the questions and answers
		shuffle(questions);
		shuffle(answers);	  
		
		function shuffle( el ) 
		{
			var i = el.length, j, tempi, tempj;
			if ( i == 0 ) return el;
			
			while ( --i ) 
			{
				j       = Math.floor( Math.random() * ( i + 1 ) );
				tempi   = el[i];
				tempj   = el[j];
				el[i] = tempj;
				el[j] = tempi;
			}
		}		
		
		//Set a random question  		
		var question = questions[0];
		
		function searchQuestionInitialIndex(index) 
		{   
			return index == questions[0];
		}
		
		//Search the answer that matches the question 
		searchAnswer();
		
		function searchAnswer() {
			
			questsInitialPositions.findIndex(searchQuestionInitialIndex);
			rightAnswer = answsInitialPositions
			[
				questsInitialPositions
				.findIndex(searchQuestionInitialIndex)
			];
			
			rightAnswIndex = answers.indexOf(rightAnswer);
			
		}	
		
		//Generate an array of wrong answers to get mixed up with the right answer
		
		wrongAnswers = answers.slice();		
		wrongAnswers.splice(rightAnswIndex, 1);	
		
		insertQuestion();
		function insertQuestion() {	   			
			$('.insere_pergunta').html(questions[0]);
		}
		
		//Insert the right answer mixed with the wrong answers all in random DIVS
		
		insertAnswers();
		
		function insertAnswers() {				
			//Return a random number between 1 and total number of DIVS:
			var container = $('.insere_respostas div');
			var count = container.length;  
			var randomIndex = Math.floor(Math.random() * count);
			
			container.eq(randomIndex)		
			.html(rightAnswer);		
			
			for(var i=0; i < count; i++){	
				
				if(container.eq(i).text() == '') {
					container
					.eq(i)
					.html(wrongAnswers[i]); 				
				}
			}
		};
				
		
	}//initQuestionAndAnswers	
	
	//Insert the Question	
	
	
	//Draw the game player, enemies and the life's counter
	
	life = initialLife;
	
	function desenhalife(){
		contexto.fillStyle = "black";
		contexto.font="12pt Monospace";
		contexto.fillText('Life: ' + life, 5, 20);
	}
	
	ninjaVioleta = new Sprite("images/ninja_violeta.png", -10, 200); 
	ninjaVerde = new Sprite("images/ninja_verde.png", 560, 200); 
	ninjaMarrom = new Sprite("images/ninja_marrom.png", 10, 100); 
	
	player = new Sprite("images/player_01.png", 320, 332); 
	
	player.passou = function(){
		if(this.y <= 10) {
			this.y = canvas.height - this.altura;
			return true;
		}
		return false;
	}
	
	//set keys
	
	document.onkeydown = function(event) { 
		
		switch(event.which) { 
			case 37: //pra esquerda 
			player.move(-10, 0); 
			break; 
			case 38: //pra cima 
			player.move(0, -10); 
			break; 
			case 39: //pra direita 
			player.move(10, 0); 
			break; 
			case 40: //pra baixo 
			player.move(0, 10); 
			break; 
		}
		
		if (player.passou()) {
			pontos++;
		}
	} 
	
	//Game loop
	
	gameLoop();
	function gameLoop(){	  
		if(!gamePaused) {
			setTimeout(function(){ 
				desenhaFundo();
				desenhalife();		
				player.desenhaImagem(); 
				ninjaVioleta.desenhaImagem(); 
				ninjaMarrom.desenhaImagem(); 		  
				ninjaVerde.desenhaImagem(); 			
				ninjaVioleta.move(7, 0); 
				ninjaVerde.move(-5, 0); 
				ninjaMarrom.move(10, 0); 	
				
				
				function insertRightResult() {
					contexto.fillStyle = "GREEN"; 
					contexto.font="Bold 80px Sans"; 
					contexto.fillText("RIGHT", canvas.width/4, canvas.height/2+20);	
					setTimeout(function(){
					ninjaVioleta.x= -100;	
					ninjaVerde.x= -100;
					ninjaMarrom.x= -100;
					initQuestionAndAnswers();
					}, 500)
					player.imagem.src = "images/player_02.png";
					setTimeout(function(){ 
					  player.imagem.src = "images/player_01.png";					
					}, 500)
				}
				
				function insertWrongResult() {
					contexto.fillStyle = "RED"; 
					contexto.font="Bold 80px Sans"; 
					contexto.fillText("WRONG", canvas.width/4, canvas.height/2+20); 
					player.imagem.src = "images/player_03.png";
					setTimeout(function(){ 
					  player.imagem.src = "images/player_01.png";					
					}, 500)
					life --;					
				}				
				
				if($('.insere_respostas div').eq(0).text() == rightAnswer)
				{	  
					if(ninjaVioleta.colidiu(player)){
						insertRightResult();						
					}
					
					if(ninjaMarrom.colidiu(player)){
						insertWrongResult();	
						
					}
					
					if(ninjaVerde.colidiu(player)){
						insertWrongResult();		
					}
					
				}
				
				
				if($('.insere_respostas div').eq(1).text() == rightAnswer)
				{	  
					if(ninjaVioleta.colidiu(player)){
						insertWrongResult();	  
					}
					
					if(ninjaMarrom.colidiu(player)){
						insertRightResult();		
					}
					
					if(ninjaVerde.colidiu(player)){
						insertWrongResult();		
					}
					
				}
				
				if($('.insere_respostas div').eq(2).text() == rightAnswer)
				{	  
					if(ninjaVioleta.colidiu(player)){
						insertWrongResult();	  
					}
					
					if(ninjaMarrom.colidiu(player)){
						insertWrongResult();		
					}
					
					if(ninjaVerde.colidiu(player)){
						insertRightResult();		
					}		
				}
				
				
				if(life <= 0) {			  
					gameOver();
				}
				
				gameLoop();
			}, 50);	
			
		}
	} //gameLoop
	
} //start

//Game Over 

function gameOver() {
	//hide some elements and show others 
	gamePaused = true; 
	$('.game_over').show();   
	$('.insercao').css('visibility', 'hidden');	
	player.imagem.src = null; 	

	
	//draw the background again to cover the game's characters
	desenhaFundo ();
	
	resetNinjasVelocities();  
	function resetNinjasVelocities() {
		
	    //Reset the ninjas' velocities   
		
		if(gamePaused){
			setTimeout(function() {
				ninjaVioleta.stop(); 
				ninjaVerde.stop(); 
				ninjaMarrom.stop(); 				
				resetNinjasVelocities();
			}, 	
			50
			);
		}
	} //resetNinjasVelocities
	
} //gameOver


















