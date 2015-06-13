var geocoder;
	var count  = -1;
	var count1 = 0;
	var flag = -1;
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var weekNames = ["Sun", "Mon" , "Tue" , "Wed" , "Thu" , "Fri", "Sat"];
	var autocompleteCityOne;
	var autocompleteCityTwo;
	var statusOfCity = [0,0];
	statusOfCity[0]=0;
	statusOfCity[1]=0;
	var count2 = 0;
	var url1;
	var url2;
	function initialize() {

      //Adds Google Places Auto Complete to the city fields.
      
      autocompleteCityOne = new google.maps.places.Autocomplete( (document.getElementById('city1')), { types: ['(cities)'] });

      autocompleteCityTwo = new google.maps.places.Autocomplete( (document.getElementById('city2')), { types: ['(cities)'] });
      
      google.maps.event.addListener(autocompleteCityOne, 'place_changed', function() {
      });
      
      google.maps.event.addListener(autocompleteCityTwo, 'place_changed', function() {
      });
    
    }

    function initializeConversion() {
    	//Gets the coordinates of both cities
    	
    	if(document.getElementById('datenh1').value.length >0 && document.getElementById('datenh2').value.length>0 ) {
    		alert("Please choose date and time of one of the cities!");
    		location.reload();
    	}
    	if (document.getElementById('datenh1').value.length == 0)
    		setValueOfDateTwo();
    	else
    		setValueOfDateOne();

    	getCoordinates(document.getElementById('city1').value);
    	getCoordinates(document.getElementById('city2').value);

    	
    }

    function setValueOfDateOne() {
    	datenh1 = document.getElementById('datenh1').value;
    	var momentDate1= moment( datenh1, "h:mm a ddd DD MMM YYYY" );
    	///06/05/2015 2:56 PM
    	date1 = momentDate1.month()+1 + "/" + momentDate1.date() + "/" + momentDate1.year() +" "+ momentDate1.hour() +":"+momentDate1.minutes();
    	console.log("Date1:"+date1);
    	document.getElementById('date1').value=date1;
    	console.log("date1:"+document.getElementById('date1').value);
    	document.getElementById('date2').value = "";

    }
    function setValueOfDateTwo() {
    	datenh2 = document.getElementById('datenh2').value;
    	var momentDate2= moment( datenh2, "h:mm a ddd DD MMM YYYY" );
    	///06/05/2015 2:56 PM
    	date2 = momentDate2.month()+1 + "/" + momentDate2.date() + "/" + momentDate2.year() +" "+ momentDate2.hour() +":"+momentDate2.minutes() ;
    	document.getElementById('date2').value=date2;
    	console.log("date2:"+document.getElementById('date2').value);
    	document.getElementById('date1').value = "";

    }

    function getCoordinates(city) {
    	
    	//Gets the coordinates of the city passed

		var address = city;
		var count=0;
		
		geocoder = new google.maps.Geocoder();

		geocoder.geocode( { 'address': address}, function(results, status) {

			if (status == google.maps.GeocoderStatus.OK) {

				console.log(results[0].geometry.location.A);
				console.log(results[0].geometry.location.F);

				longitude=results[0].geometry.location.A;
				latitude=results[0].geometry.location.F;
				
				generateRequestURL(latitude,longitude);

			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});	
	}

	function generateRequestURL(latitude, longitude) {
		//Generates the URL needed to connect to the API
		var timestamp;
		var apiKey = "AIzaSyB4bGs5nvF2cvmCrTm77fv_Mv0XiKqKORY";
		//var myDate = new Date(document.getElementById('date1').value);
		//timestamp2 = Math.round(myDate.getTime()/1000.0);

		if ( document.getElementById('date1').value.length != 0 && document.getElementById('date2').value.length != 0 ) {
			flag = -1;
		}
		if( document.getElementById('date1').value.length == 0) {
				
				if( document.getElementById('date2').value.length == 0 && count1 == 1) {
					flag = -1;
					alert("Please choose date and time of one of the cities!");
					location.reload();
				}
				else {
					flag = 1;
					statusOfCity[1] = 1;
				}
		}
		else {

			flag=0;
			statusOfCity[0] = 1;
		}
		console.log(flag);
		console.log("StatusOfCity 0 : "+statusOfCity[0]);
		console.log("StatusOfCity 1 : "+statusOfCity[1]);
		if(flag == 0 ) {
				
				var myDate = new Date(document.getElementById('date1').value);
				
				timestamp = Math.round(myDate.getTime()/1000.0);
				console.log("Date: "+ document.getElementById('date1').value + "Timestamp: "+timestamp);
				
				var calculatedLocation = longitude + "," + latitude;
				var url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + calculatedLocation + "&timestamp=" + timestamp + "&key=" + apiKey;
				
				if(statusOfCity[count1]) {
					url1=url;
				}
				else {
					url2=url;
				}
			}

		if(flag == 1 ) {
				
				var myDate = new Date(document.getElementById('date2').value);
				
				timestamp = Math.round(myDate.getTime()/1000.0);
				console.log("Date: "+ document.getElementById('date2').value + "Timestamp: "+timestamp);
				
				var calculatedLocation = longitude + "," + latitude;
				var url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + calculatedLocation + "&timestamp=" + timestamp + "&key=" + apiKey;
				
				if(statusOfCity[count1]) {
					url1=url;
				}
				else {
					url2=url;
				}
			}
		if(count1==1) {
			getConvertedTime(timestamp, url1, url2, flag);
			count1=-1;
			flag=-1;
			statusOfCity[0]=0;
			statusOfCity[1]=0;
			document.getElementById('date1').value=0;
			document.getElementById('date2').value=0;
		}
		count1++;	
	}

    function sendRequest(url) {
    	var Httpreq = new XMLHttpRequest(); // a new request
    	
    	Httpreq.open("GET",url,false);
    	Httpreq.send(null);
    	
    	var result = Httpreq.responseText;
    	var jsonObj = JSON.parse(result);

    	return jsonObj;
    }

    function addZero(i) {
		
		if (i < 10) {
			i = "0" + i;
		}
		return i;

	}

    function getConvertedTime(timestamp, url1, url2, flag) {
    	
    	jsonObjOfEntered = sendRequest(url1);
    	jsonObjOfNonEntered = sendRequest(url2);
    	console.log("Entered City URL: "+url1);
    	console.log("Blank City URL: "+url2);
    	var cityOneOffset = jsonObjOfEntered.dstOffset + jsonObjOfEntered.rawOffset; 
    	console.log("City One Offset:"+cityOneOffset);
    	var convertedTimeStamp = timestamp + jsonObjOfNonEntered.dstOffset + jsonObjOfNonEntered.rawOffset - cityOneOffset;
    	var convertedTime = new Date(convertedTimeStamp*1000);

    	console.log("Time:"+convertedTime);
		var suffix = "AM";
		var hours = convertedTime.getHours();

		if ( hours >= 12) {
			suffix = "PM";
			hours = hours-12;
		}
		//8:37 pm Fri 05 Jun 2015
		var fullConvertedTime = ( hours+ ":" + addZero(convertedTime.getMinutes() ) + " " +
			suffix + " " + weekNames [ convertedTime.getDay() ] + " " + addZero(convertedTime.getDate() ) + " " + monthNames [ convertedTime.getMonth() ] + " " + convertedTime.getFullYear()  
			);
	//	var fullConvertedTimeForField = addZero(convertedTime.getMonth()+1) + "/" + addZero(convertedTime.getDay()) + "/" + convertedTime.getFullYear() + " " + hours + ":" +addZero(convertedTime.getMinutes()) + " " + suffix;
		console.log("Flag: "+flag);
		console.log("Full Converted Time: "+fullConvertedTime);
		if(flag == 0) {
			document.getElementById('datenh2').value = fullConvertedTime;
			display(jsonObjOfEntered,jsonObjOfNonEntered,cityOneOffset,flag);
			cityOneOffset=0;
			flag=-1;
		}
		else if (flag == 1) {
			document.getElementById('datenh1').value = fullConvertedTime;
			display(jsonObjOfEntered,jsonObjOfNonEntered,cityOneOffset,flag);
			
			cityOneOffset=0;
			flag=-1;
		}
    }

    function display(jsonObjOfEntered,jsonObjOfNonEntered,cityOneOffset,flag) {
    		
    		var diffInOffset = (jsonObjOfNonEntered.dstOffset + jsonObjOfNonEntered.rawOffset - cityOneOffset)/3600;
			if(diffInOffset>0) {
				var diffInLiterals = "ahead"	
			}
			else
				var diffInLiterals = "behind"
			var fractionOfDiffInOffset = 0;
			fractionOfDiffInOffset = diffInOffset % 1;
			var suffixZero= "";	
			console.log(fractionOfDiffInOffset);
			if ( fractionOfDiffInOffset == 0 ) {
				var newFractionOfDiffInOffset = addZero(fractionOfDiffInOffset);
			}
			else if ( fractionOfDiffInOffset == -0.5 || fractionOfDiffInOffset == 0.5  ) {
				suffixZero = "0";
				var newFractionOfDiffInOffset = 0.30;
			}
			else if ( fractionOfDiffInOffset == -0.25 || fractionOfDiffInOffset == 0.25 ) {
				var newFractionOfDiffInOffset = 0.15;
			}
			else if ( fractionOfDiffInOffset == -0.75 || fractionOfDiffInOffset == 0.75 ) {
				var newFractionOfDiffInOffset = 0.45;				
			}
		//	if(fractionOfDiffInOffset < 0 ) {
		//		fractionOfDiffInOffset = -fractionOfDiffInOffset;
		//	}
			//Pune is +4:30 of London
			if(diffInOffset<0) {
				var sign = "-";
			}
			diffInOffset = Math.abs(diffInOffset) - Math.abs(fractionOfDiffInOffset) + newFractionOfDiffInOffset;
			if(flag==0)  {
				if(sign == "-") {
					document.getElementById('converted').innerHTML = document.getElementById('city1').value +" is " +"+"+Math.abs(diffInOffset)+suffixZero 
														+" of " + document.getElementById('city2').value;		
				}
				else {
					document.getElementById('converted').innerHTML = document.getElementById('city2').value +" is " +"+"+Math.abs(diffInOffset)+suffixZero 
														+ " of " + document.getElementById('city1').value;	
				}
				
			}
			if(flag==1) {
				if(sign == "-") {
					document.getElementById('converted').innerHTML = document.getElementById('city2').value +" is " +"+"+Math.abs(diffInOffset)+suffixZero 
														+" of " + document.getElementById('city1').value;	
				}
				else {
					document.getElementById('converted').innerHTML = document.getElementById('city1').value +" is " +"+"+Math.abs(diffInOffset)+suffixZero 
														+" of " + document.getElementById('city2').value;	
				}
				
			}
    }