var cookies = 0;
var cursors = 0;
var Lama = 0;
var LamaPower = 0;
var power = 1;
var defense = 1;
var special = 1;
let result;
var timeCount = 0;
var housingAvail = 10; 					// Start off with enough housing for 50 monks/llamas
var totalHoused = 0;		// Total housing used.

function cookieClick(number){
    cookies = cookies + number;
	document.getElementById("cookies").innerHTML = cookies;
};

function buyCursor(){											 // For Meditating Monks. Was originally called cursors.
    var cursorCost = Math.floor(10 * Math.pow(1.1,cursors));     //works out the cost of this cursor
    if (cookies >= cursorCost && totalHoused < housingAvail) {    //checks that the player can afford the cursor
        cursors = cursors + 1;                                   //increases number of cursors
    	cookies = cookies - cursorCost;                          //removes the cookies spent
		totalHoused++;											 // Increased housed.
        document.getElementById('cursors').innerHTML = cursors;  //updates the number of cursors for the user
        document.getElementById('cookies').innerHTML = cookies;  //updates the number of cookies for the user
    } else {
		genError();												 // Something is wrong, generate error.
		
	};
    var nextCost = Math.floor(10 * Math.pow(1.1,cursors));       //works out the cost of the next cursor
    document.getElementById('cursorCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

function buyLama(){
    var LamaCost = Math.floor(100 * Math.pow(1.3,Lama));     		//works out the cost of this cursor
    if (cookies >= LamaCost && totalHoused < housingAvail){          //checks that the player can afford the cursor
        Lama = Lama + 1;                                   			//increases number of cursors
		LamaPower = LamaPower + 10;									//Need a second variable to track how much Cookies increases by.
    	cookies = cookies - LamaCost;                          		//removes the cookies spent
		totalHoused++;												// Increase housed.
        document.getElementById('Lama').innerHTML = Lama;  			//updates the number of praying Lamas for the user
        document.getElementById('cookies').innerHTML = cookies;  	//updates the number of cookies for the user
    } else {
		genError();
	};
    var LamaNext = Math.floor(10 * Math.pow(1.3,Lama));     	  	//works out the cost of the next cursor
    document.getElementById('LamaCost').innerHTML = LamaCost;  		//updates the cursor cost for the user
};

function CalcPower() {
	var TotalPower = LamaPower + cursors; 							// Calculate the total power.
	document.getElementById('TotalPower').innerHTML = TotalPower;	// But Lama needs its own variable as it changes, so LamaPower
};

function genError() {
	result = "You do not have enough available resources!";		
	document.getElementById('result').innerHTML = result;			// Update error log for player.
	timeCount = 5;													// Leave error up for 5 cycles before clearing it.

};

function decreaseTimer() {
	if (timeCount > 0) {										// Check if there's time left to display message.
		timeCount--;
	} else {													// Otherwise, time to clear it out.
		result = "No pertinent messages.";
		document.getElementById('result').innerHTML = result;	
		timeCount = 0;											// Just in case timecount somehow went negative.
	}

};


// Main game loop for anything automated.
window.setInterval(function(){									// Figure out total automated clicks every round.
	cookieClick(cursors);										// Maybe combine these into one number and only call cookeClick once?
	cookieClick(LamaPower);
	CalcPower();												
	decreaseTimer();
}, 1000);
