
setInterval(function reload() {
    //function to get data a put in the correct pos
    GetData()
    //update elements
    for (var i = 0; i < game_num; i++) {
        update_elements(i)
    }
},  1000)

//update elements function
function update_elements(i) {
    i++;
    let place = (' #game-'+i);
    $(place).load(location.href + (place));
}
//input into pos function
function input_data_toelements(data) {
    for (i=0 ; i < data.length; i++ ){
       
        //give array elements variable
        let game = data[i]
        let game_id = game[0];
        let home_score = game[1];
        let away_score = game[2];
        let ingame_time = game[3];
        let status = game[4];
        let time = game[5];
        let date = game[6];
        
        //jquery to input score
        $('#home-score'+game_id).text(home_score);
        $('#away-score'+game_id).text(away_score);


        //jquery to input time/date
        if (status === 2){
            $('#game-time'+game_id).text("F.T");
            
        }
        else{

            if (ingame_time <= 0){
                $('#game-time'+game_id).text(time+', '+date);
            }
            else if (ingame_time < 90)   {
                $('#game-time'+game_id).text(ingame_time+"'");
            }

        }
        
    }

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


