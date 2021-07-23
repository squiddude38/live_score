
//goal counter
let home_add = document.getElementById('home_team_goal_button')
let away_add = document.getElementById('away_team_goal_button')

let home_score = document.getElementById('home_team_score')
let away_score = document.getElementById('away_team_score')


//------------------------------ score add buttons ------------------------------
home_add.addEventListener('click', function(){
    if (status === 'started'){
        home_value += 1;
        home_score.innerHTML = home_value;
        sendData((game_id),'home',home_value)
 
    }
})

away_add.addEventListener('click', function(){
    if (status === 'started'){

        away_value += 1;
        away_score.innerHTML = away_value;
        sendData((game_id),'away',away_value)
 
    }
})






//------------------------- timer -------------------------
let seconds = -1;
if (Number.isInteger(minutes) === 'false')
    minutes = 0;

//define vars to hold display
let displaySeconds = 0;
let displayminutes = 0;

//var to hold set interval function
let interval = null;
if ((minutes) === 0){
    status = 'started';
    startstop()
}
if ((minutes) !== 0){
    if (minutes < 90){
        status = 'stopped';
        startstop()
    }
}



function timer(){
    seconds++;

    //determine mins

    if(seconds/60 === 1){
        seconds = 0;
        minutes++;
        sendData(game_id,'time_mins',minutes)



    }

    if(seconds < 10){
        displaySeconds = '0' + seconds.toString();
    }
    else{
        displaySeconds = seconds;
    }

    if(minutes < 10){
        displayminutes = '0' + minutes.toString();
    }
    else{
        displayminutes = minutes;
    }


    if (minutes > 65){
        document.getElementById('half-full_time_button').innerHTML = 'full time';
    }
    //display time
    document.getElementById('display').innerHTML = displayminutes + ':' + displaySeconds;

    if (minutes > 100){
        minutes = 100;
        seconds = 0;
    }

}

function startstop(){
    if(status === 'stopped'){
        interval = window.setInterval(timer, 1000)
        document.getElementById('start-stop_button').innerHTML = 'stop'
        status = 'started';
        
    }
    else{
        window.clearInterval(interval);
        document.getElementById('start-stop_button').innerHTML = 'start';
        status = 'stopped';
    }
}


// half full time function
function half_full_time(){
    if (minutes <= 65){
        document.getElementById('half-full_time_button').innerHTML = 'half time';
        minutes = 45;
        seconds = -1;
        timer()
        window.clearInterval(interval);
        document.getElementById('start-stop_button').innerHTML = 'start';
        sendData(game_id,'time_mins',minutes)
        status = 'stopped';
    }

    if (minutes > 65){
        minutes = 90;
        seconds = -1;
        timer()
        window.clearInterval(interval);
        document.getElementById('start-stop_button').innerHTML = 'start';
        sendData(game_id,'time_mins',minutes)
        status = 'stopped';
    }

}


// ------------------------- post data function -------------------------
function sendData(id,team,data ) {
    console.log( 'Sending data' );
    console.log(data)
    const XHR = new XMLHttpRequest();
  
    // Set up our request
    XHR.open( 'POST', '/update_score/'+ id +'/'+team+'/'+data );
  
    // Add the required HTTP header for form data POST requests
    XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
  
    // Finally, send our data.
    XHR.send( data );
  }
  



  
// ------------------------- submit fixture -------------------------

let openpopupButtons = document.getElementById('half-full_time_button')
let closepopupbuttons = document.getElementById('popup_close')
let submitmatch = document.getElementById('submit_fixture')


openpopupButtons.addEventListener('click', function(){
    if (minutes >= 90){
    
    document.getElementById("select_popup").style.display = 'inherit';
    document.getElementById('overlay').style.display = 'inherit';
    document.getElementById('overlay').style.pointerEvents = 'all';
    }

})

//------------------------------send data------------------------------
closepopupbuttons.addEventListener('click', function(){
    console.log('hello')
    document.getElementById("select_popup").style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('overlay').style.pointerEvents = 'none';
})

submitmatch.addEventListener('click', function(){
    sendData(game_id, 'submit_game', '2')
})




//------------------------------ get data ------------------------------
setInterval(function reload() {
    //function to get data a put in the correct pos
    GetData()
    //update elements
    update_elements()
    console.log(home_value)
    
},  1000)

//update elements function
function update_elements() {
    
    $('#home_team_score').load(location.href + (' #home_team_score'));
    $('#away_team_score').load(location.href + (' #away_team_score'));

}

//input into pos function
function input_data_toelements(data) {
    //give array elements variable
    
    let game = data[game_id]
    console.log(game)
    let home_score = game[1];
    let away_score = game[2];
    let ingame_time = game[3];

    
    $('#home_team_score').text(home_score);
    $('#away_team_score').text(away_score);
    
}


//post data function 
function GetData() {

    const XHR = new XMLHttpRequest();

    // Set up our request
    XHR.onreadystatechange = function (body) {
        //setup GET request
        if (XHR.readyState === XMLHttpRequest.DONE) {
            var status = XHR.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                data = JSON.parse(XHR.responseText)
                // call input function
                input_data_toelements(data)
                

            } 
            //error
            else {
                console.error("Panic!!!!!")
            }
        }
    }
    //send GET request.
    XHR.open('GET', '/get_data');
    XHR.send();


}












