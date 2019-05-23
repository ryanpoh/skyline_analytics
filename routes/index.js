var express = require('express'),
	router = express.Router();

var	Lot = require('../models/lot');
var	Process = require('../models/process');
var	Employee = require('../models/employee');


router.get('/', function(req,res){
	res.render("landing");
});

router.get('/home', isLoggedIn, function(req, res){
	
	// TAKEN FROM DB
	var timeTakenLot = []; //[ 10 ]
	var processesIdLot = [];

	var processesTimeDb =[]; //[ 20, 30, 50, 30 ]
	var processesIdDb = []; // [100,200,300]



	// PROCESS INFO	
	var respectiveProcessTime = [];	
	var performance = []; 
	var unixTime = [];
	var objToPass = {lots: [], timeTaken: timeTakenLot, processTime: respectiveProcessTime, unixTime: unixTime, performance: performance, featuredEmployees: []};
	
	
	Employee.find({featured: true}, function(err, employeesData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
			objToPass.featuredEmployees = employeesData;    //full RAW lot Database file from DB	
		}
	});


	Lot.find({}, function(err, lotsData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
				objToPass.lots = lotsData;    //full RAW lot Database file from DB	
				lotsData.forEach(function(individualLot){
					var string = JSON.stringify(individualLot);
					var obj = JSON.parse(string);
					processesIdLot.push(obj.processId);
					timeTakenLot.push(obj.timeTaken);
				});
			// console.log(processesIdLot);
			// console.log(timeTakenLot);
			// console.log('timeTakenLot' + timeTakenLot);
			
			Process.find({}, function(err, processesData){ //{} means you take everything from DB
				if(err){
					console.log(err);
				} else {

					processesData.forEach(function(individualProcess){
						var string = JSON.stringify(individualProcess);
						var obj = JSON.parse(string);
						processesIdDb.push(obj.subProcesses.buttonProcess.subProcessId);  
						processesIdDb.push(obj.subProcesses.collarProcess.subProcessId);  
						processesIdDb.push(obj.subProcesses.bodyProcess.subProcessId);  
						processesIdDb.push(obj.subProcesses.sleeveProcess.subProcessId);  
						
						processesTimeDb.push(obj.subProcesses.buttonProcess.subTime);
						processesTimeDb.push(obj.subProcesses.collarProcess.subTime);
						processesTimeDb.push(obj.subProcesses.bodyProcess.subTime);
						processesTimeDb.push(obj.subProcesses.sleeveProcess.subTime);
					});	

					processesIdLot.forEach(function(processIdLot, i){

						processesIdDb.forEach(function(processIdDb, j){

							if (processIdLot == processIdDb){
								respectiveProcessTime.push(processesTimeDb[j]);
								
								// console.log( 'time taken = ' + timeTakenLot[j]);
								// console.log('processesTimeDb =' +  processesTimeDb[j]);
								performance.push(Math.round(100 - ((timeTakenLot[i] - processesTimeDb[j]) / processesTimeDb[j] *100)));
								// console.log('CALCULATION =' + performance);
							} else {
								// console.log("No matches"); //why does it output no match but still get correct output
							}											 
						});


					});


					console.log('STAFF PROCESS ID'+ processesIdLot );
					console.log('STAFF TIME TAKEN =' + timeTakenLot);
					console.log('RESPECTIVE PROCESS TIME =' + respectiveProcessTime);
					console.log('PERFORMANCE =' + performance);
					

					res.render('home', objToPass);	
				}	

			});			
			
		}
	});
	

});

function isLoggedIn(req,res, next){
	// if(req.isAuthenticated()){
	if(true){
		console.log("YOU PASS");
		return next();
	}
	console.log("YOU FAIL");
	res.redirect("/login");
}

module.exports = router;


