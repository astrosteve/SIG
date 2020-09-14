var cookies = 0;
var cursors = 0;
var Lama = 0;
var LamaPower = 0;
var power = 1;
var defense = 1;
var special = 1;
let result;
// var messages = ["None", "None", "None", "None", "None"];   // An array that will contain error message to be displayed. Not yet used.
var mesPos = 1;					// Position to write next message to.
var timeCount = 0;
var TotalPower = 0;			// Total automatic cookie increase per cycle.
var housingAvail = 10; 		// Start off with enough housing for 10 monks/llamas
var totalHoused = 0;		// Total housing used.
var housingCost = 150;		// Base cost to increase housing.
var bakeryCost = 300;       // Cost of one bakery. Price is currently static but I may change that.
var bakeryOwned = 0;        // How many bakeries you own.
var breadLoaves = 0;		// How many loaves they have.
var starving = 0;			// Out of bread and everyone is starving.
var starvingCycles = 0;		// How many cycles they've been starving.
var costSoldier = 50;		// How much a soldier costs to recruit
var breadSoldier = 4;		// Bread quota per soldier
var totalSoldier = 0; 		// How many soldiers
var costMissionary = 15;	// How much a Missionary costs to recruit
var breadMissionary = 2;	// Bread quota per Missionary
var totalMissionary = 0; 	// How many Missionaries

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
        Lama = Lama + 1;                                   			//increases number of Lamas
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
	document.getElementById('housingAvail2').innerHTML = housingAvail;    // I want to display same number twice, this is the only way I can think of to do so.
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
	var breadProd = ((bakeryOwned * 25) + 0);                    // Total bread produced. 
	breadLoaves += breadProd;					                 // Each bakery produces 25 loaves per turn, you start with 5 per cycle.
	breadReq = ((Lama * 3) + (cursors * 1) + (totalSoldier * breadSoldier) + (totalMissionary * breadMissionary));					
	// ^^ Each variable represents how much bread that person needs.
	breadLoaves -= breadReq;									// Figure out new bread count.				
	
	if (breadLoaves < 0) {										// Negative bread is not a thing.
		breadLoaves = 0;
	};
	
    document.getElementById('breadProd').innerHTML = breadProd;
	document.getElementById('breadReq').innerHTML = breadReq;			// Required Bread
	document.getElementById('breadLoaves').innerHTML = breadLoaves;		// Update Loave count on page.	
};

function recruitSoldier() {
	if (cookies >= costSoldier && totalHoused < housingAvail) {		// Check power & housing
		totalSoldier++;
        totalHoused++;													// Take up an available housing unit.
		cookies -= costSoldier;
	} else {
		if (cookies < costSoldier && housingAvail > totalHoused) {    // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= costSoldier) {    // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < costSoldier && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
	};
	
	document.getElementById('totalSoldier').innerHTML = totalSoldier;
	document.getElementById('totalHoused').innerHTML = totalHoused;
};

function recruitMissionary() {
	if (cookies >= costMissionary && totalHoused < housingAvail) {		// Check power & housing
		totalMissionary++;
        totalHoused++;													// Take up an available housing unit.
		cookies -= costMissionary;
	} else {
		if (cookies < costMissionary && housingAvail > totalHoused) {    // If they lack the power but have housing, display this error.
			genError(1);
		};
		if (totalHoused >= housingAvail && cookies >= costMissionary) {    // If they lack housing but have sufficient power.
			genError(2);
		};
		if (cookies < costMissionary && totalHoused >= housingAvail){		// If they lack both resources, print this error.
			genError(3);
		};
	};
	
	document.getElementById('totalMissionary').innerHTML = totalMissionary;
	document.getElementById('totalHoused').innerHTML = totalHoused;
};

function CalcPower() {
	TotalPower = LamaPower + cursors; 								// Calculate the total power.
	if (starving == 1) {
		TotalPower = (TotalPower * .5);								// Starving reduces prayer power. Eventually, they'll start dying.
		TotalPower = Math.round(TotalPower);						// Get rid of any possible decimals.
		if (TotalPower < 0) {										// It shouldn't be possible for this to go negative, but just in case it happens.
			TotalPower = 0;
		};
		if (starvingCycles > 15 && starving == 1) {					// They have 15 cycles to get out of starving before bad things happen.
				if (Lama >= 1) {
					Lama--;											// Lamas die first, followed by monks.
					LamaPower -= 10;								// Decrease power.
					totalHoused -= 1;								// Decrease followers
				};
				if (cursors >= 1 && Lama == 0) {					// If all Lamas are dead, then Monks start dying.
					cursors--;
					totalHoused -= 1;
				};
		// Will be adding Soldier and Missionaries in here once they actually do something beside eat your bread and take up housing.
		};
		starvingCycles++;
	};
	
	document.getElementById('TotalPower').innerHTML = TotalPower;	
	document.getElementById('Lama').innerHTML = Lama;
	document.getElementById('totalHoused').innerHTML = totalHoused;
	document.getElementById('cursors').innerHTML = cursors;

};

function genError(errorCode) {
	if (messageImportance != 1) { 										// 1 means important, override 'lesser' errors.
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
	};
	/*
	messages[mesPos] = result;										// Should write to array sequentially.
	mespos++;														// Increment position counter.
	if (mespos) > 6 {												// Reset to 1 after array full
		mespos = 1;
	}; */
	// This was created to make an array of recent error messages to display a short message log.
	// I've decided that isn't really a core feature needed right now so am not implementing this any further atm. Code completely untested.
	
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
		messageImportance = 0;
	};

};

function endMaint() {											// End of turn maintenance. Just checking for hunger currently.
	if ((breadLoaves == 0) && (totalHoused > 0)) {
		result = "<b>Your followers are starving!</b>";
		timeCount = 3;
		messageImportance = 1; 									// 1 = most important, lesser errors will not overwrite it.
		starving = 1;											// Indicator everyone is starving up in here.
	};
	if ((breadLoaves > 0) && (starving == 1)) {					// Turn off starving indicator if breadloaves are above 0.
		starving = 0;
		starvingCycles = 0;
	};
	
	if ((totalHoused == 0) && (starving == 1)) {				// If no one is left alive, shut off starving. Soldiers and Missionaries never die so this
																// won't work right if you have any of those types.
		starving = 0;
		starvingCycles = 0;
		totalHoused = 0;										// This shouldn't ever be needed, but I'm paranoid.
	};
	
	if ((cursors + Lama == 0)) {								// This is temporary so starving shuts off while Soldiers and Missionaries are immortal.
		starving = 0;
		starvingCycles = 0;
		totalHoused = 0;										// This shouldn't ever be needed, but I'm paranoid.
	};
	document.getElementById('result').innerHTML = result;
};


// Main game loop for anything automated.
window.setInterval(function() {
	CalcPower();												// Calculate total power generated from monks/lamas 
	cookieClick(TotalPower);									// Add TotalPower to cookies.
	decreaseTimer();											// Check if any messages are displayed, if so reduce time left to display.
	breadGen();													// Generate Bread!
	endMaint();													// Do any end-of-turn maintenance.
}, 1000);
