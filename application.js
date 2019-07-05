function Word(word, number) {
	this.word   = word;
	this.number = number;

	var dieFaces = {
		"1": "&#9856;",
		"2": "&#9857;",
		"3": "&#9858;",
		"4": "&#9859;",
		"5": "&#9860;",
		"6": "&#9861;"
	}

	this.hexColor = function() {
		var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
	}

	this.dice = function() {
		dice = '';
		$.each(this.number.split(''), function(k, v) {
			dice = dice + " " + dieFaces[v];
		});
		return dice.trim();
	}
}

window.Seeder = {
    //How much clicks does the user need to seed the randomnumbergenerator
	seedLimit: Math.floor(Math.random() * 10)+5,
	seeds: 0,

	push: function(seed) {
		Math.seedrandom(seed, true);
		this.seeds++;
	},

	isDone: function() {
		if ((this.seeds + 1)== this.seedLimit) {
			return true;
		}
		return false;
	},

	percentage: function() {
		return Math.round((this.seeds / this.seedLimit) * 100)
	}
}

window.Passphrase = {
    //Generates a new passphrase with "wordCount" words.
    //The new passphrase has at least one:
    // - capital letter
    // - number
    // - special char
	generate: function(wordCount) {
	var wordsList = new Array(wordCount);
	var capital = false;
	var number = false;
	var special = false;
	this.reset();
	var word = "";
    for (var i = 0; i < wordCount; i++) {
        word = WordDispenser.getWord();
        if(capital == false){
            while(capital == false){
                word = WordDispenser.getWord();
                if((!checkForNumber(word.word))&&(!checkForSpecialChar(word.word))){
                    word.word = capitalizeFirstChar(word.word);
                    wordsList[i] = word;
                    capital = true;
                }
            }
        }else{
            if(number == false){
                while(number == false){
                    word = WordDispenser.getWord();
                    if(checkForNumber(word.word)){
                         wordsList[i] = word;
                         number = true;
                    }
                }
            }else{
                if(special == false){
                    while(special == false){
                        word = WordDispenser.getWord();
                        try{
                            if(checkForSpecialChar(word.word)){
                                 wordsList[i] = word;
                                 special = true;
                            }
                        }catch(err){
                            console.log(word);
                        }
                    }
                }else{
                    wordsList[i] = word;
                }
            }
        }
    }
    wordsList = shuffle(wordsList);
    //Displays the shuffeld list
    for (var i = 0; i < wordCount; i++) {
        document.getElementById("passphrase").innerHTML += "<span class='word'>" + wordsList[i].word + "<span class='word-color' style='background-color:" + wordsList[i].hexColor() + "'></span></span>";
	}
},
	reset: function() {
		document.getElementById("passphrase").innerHTML = "";
	},
}
//Shuffels the items of the array randomly
function shuffle(array ){
    var counter = array.length, temp, index;
    // While there are elements in the array
    while ( counter > 0 ) {
        // Pick a random index
        index = Math.floor( Math.random() * counter );
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        temp = array[ counter ];
        array[ counter ] = array[ index ];
        array[ index ] = temp;
    }
    return array;
}

//Is responsible for the transition between the seed screen and the final screen.
//It also calls the generate() function which creates a passphrase
function seed(){
 	if (Seeder.isDone()) {
 	    document.getElementById("1").removeAttribute("onclick");
 	    var pos = window.innerHeight-115;
        document.getElementById("new_passphrase").style.top = pos+"px";
        document.getElementById("new_passphrase").style.display = "block";
        document.getElementById("seeder").style.opacity = 0;
        document.getElementById("seeder").style.transition = "opacity 3s";
        var elem = document.getElementById("seeder");
        elem.parentNode.removeChild(elem);
 	    Passphrase.generate(7);
 		document.getElementById("passphrase_container").style.opacity = 1.0;
        document.getElementById("passphrase_container").style.transition = "opacity 3s ease 0s";
        document.getElementById("passphrase_container").style.display = "block";
        document.getElementById("randompw").innerHTML = randomPassword();
        document.getElementById("randompw").style.opacity = 1.0;
        document.getElementById("altpw").style.opacity = 1.0;
    }else{
        var randomnum1 = Math.floor(Math.random() * 500)+1;
     	var randomnum2 = Math.floor(Math.random() * 500)+1;
     	var seed = [randomnum1,randomnum2, + new Date];
     	Seeder.push(seed);
        var percentage = Seeder.percentage() + '%';
        document.getElementById("seed_progress").style.width = percentage;
        //console.log(percentage+"");
        document.getElementById("seed_progress").innerHTML = percentage;

    }
}
//Generates a new passphrase with "x" words
function newpassphrase(x){
    Passphrase.generate(x);
    document.getElementById("randompw").innerHTML = randomPassword();
}
//Checks if "s" is a number
function checkForNumber(s){
    if(isNaN(s)){
	    return false;
    }else{
	    return true;
    }
}
//Checks if "s" contains a special char
function checkForSpecialChar(s){
var specialChars = " <>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    for(i = 0; i < specialChars.length;i++){
      if(s.indexOf(specialChars[i]) > -1){
          return true;
       }
    }
    return false;
}
//Converts the first letter of the string to a capitalized letter
function capitalizeFirstChar(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function randomPassword() {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < 16; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}
