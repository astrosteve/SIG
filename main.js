var cookies = 0;
var cursors = 0;
var Lama = 0;
var LamaPower = 0;
var power = 1;
var defense = 1;
var special = 1;
let result;
var timeCount = 0;
var housingAvail = 10; 		// Start off with enough housing for 10 monks/llamas
var totalHoused = 0;		// Total housing used.
var housingCost = 150;		// Base cost to increase housing.
var bakeryCost = 300;       // Cost of one bakery. Price is currently static but I may change that.
var bakeryOwned = 0;        // How many bakeries you own.
var breadLoaves = 0;
var costSoldier = 50;		// How much a soldier costs to recruit
var breadSoldier = 4;		// Bread quota per soldier
var totalSoldier = 0; 		// How many soldiers

// Currently not using acreage. Unsure how/if I want to do that.
var ownedLand = 2;			// Land at start of game. In acres.
var liveRatio = 20;			// How much housing (as shown in housingAvail) can fit on an acre.


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
		if (cookies < cursorCost && housingAvail > totalHoused) {       // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= cursorCost) {     // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < cursorCost && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
		
	};
    var nextCost = Math.floor(10 * Math.pow(1.1,cursors));          //works out the cost of the next cursor
    document.getElementById('cursorCost').innerHTML = nextCost;     //updates the cursor cost for the user
	document.getElementById('totalHoused').innerHTML = totalHoused; // Update display of total housed.
};

function buyLama(){
    var LamaCost = Math.floor(100 * Math.pow(1.3,Lama));     		//works out the cost of this cursor
    if (cookies >= LamaCost && totalHoused < housingAvail){         //checks that the player can afford the cursor
        Lama = Lama + 1;                                   			//increases number of cursors
		LamaPower = LamaPower + 10;									//Need a second variable to track how much Cookies increases by.
    	cookies = cookies - LamaCost;                          		//removes the cookies spent
		totalHoused++;												// Increase housed.
        document.getElementById('Lama').innerHTML = Lama;  			//updates the number of praying Lamas for the user
        document.getElementById('cookies').innerHTML = cookies;  	//updates the number of cookies for the user
    } else {
		if (cookies < LamaCost && housingAvail > totalHoused) {    // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= LamaCost) {    // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < LamaCost && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
		
	};
    var LamaNext = Math.floor(100 * Math.pow(1.3,Lama));     	  	//works out the cost of the next cursor
    document.getElementById('LamaCost').innerHTML = LamaNext;  		//updates the cursor cost for the user
	document.getElementById('totalHoused').innerHTML = totalHoused; // Update display of total housed.
};

function buyHousing() {
	if (cookies >= housingCost) {
		housingAvail = housingAvail+10;
		cookies = cookies - housingCost;
	} else {
		genError(1);												// Not enough cookies.
	};
	document.getElementById('housingAvail').innerHTML = housingAvail;
};

function buyBakery() {
	if (cookies >= bakeryCost) {
		bakeryOwned++;
		cookies -= bakeryCost;
	} else {
		genError(1);
	};
	document.getElementById('bakeryOwned').innerHTML = bakeryOwned;
};

function breadGen() {
	breadLoaves += ((bakeryOwned * 25) + 5);					// Each bakery produces 25 loaves per turn, you start with 5 per cycle.
	breadReq = ((Lama * 3) + (cursors * 1) + (totalSoldier * breadSoldier));					
	// ^^ Each variable represents how much bread that person needs.
	breadLoaves -= breadReq;									// Figure out new bread count.				
	
	if (breadLoaves < 0) {										// Negative bread is not a thing.
		breadLoaves = 0;
	};
	
	document.getElementById('breadReq').innerHTML = breadReq;			// Required Bread
	document.getElementById('breadLoaves').innerHTML = breadLoaves;		// Update Loave count on page.	
};

function recruitSoldier() {
	if (cookies >= costSoldier) {		// Check power
		totalSoldier++;
		cookies -= costSoldier;
	} else {
		genError(1);				   // Not enough power.
	};
	
	document.getElementById('totalSoldier').innerHTML = totalSoldier;
};

function CalcPower() {
	var TotalPower = LamaPower + cursors; 							// Calculate the total power.
	document.getElementById('TotalPower').innerHTML = TotalPower;	// But Lama needs its own variable as it changes, so LamaPower
};

function genError(errorCode) {
		
	switch(errorCode) {
		case 1:														// 1 is not enough cookies.
		  result = "You do not have the Power for this!";
		break;
		case 2:														// 2 is not enough Housing.
		  result = "You do not have the Housing for this!";
		break;
		case 3:														// 3 is lack of all resources required.
		  result = "You lack all the resources for this!";
		break;
		case 4:														// 4 is not enough bread.
		  result = "You need more bread for this!";					
		 break;
		default:													// Generic message if no match.
		  result = "You cannot do that now.";
	};
	
	document.getElementById('result').innerHTML = result;			// Update error log for player.
	timeCount = 3;													// Leave error up for 3 cycles before clearing it.
};

function decreaseTimer() {
	if (timeCount > 0) {										// Check if there's time left to display message.
		timeCount--;
	} else {													// Otherwise, time to clear it out.
		result = "No pertinent messages.";
		document.getElementById('result').innerHTML = result;	
		timeCount = 0;											// Just in case timecount somehow went negative. Stupid floating point.
	}

};


// Main game loop for anything automated.
window.setInterval(function(){									// Figure out total automated clicks every round.
	cookieClick(cursors);										// Maybe combine these into one number and only call cookeClick once?
	cookieClick(LamaPower);
	CalcPower();
	decreaseTimer();
	breadGen();													// Generate Bread!
}, 1000);
