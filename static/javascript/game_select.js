let openpopupButtons = document.getElementById('game_select_button')
let closepopupbuttons = document.getElementById('popup_close')
let submitmatch = document.getElementById('submit_fixture')


openpopupButtons.addEventListener('click', function(){
    console.log('hello')
    document.getElementById("select_popup").style.display = 'inherit';
    document.getElementById('overlay').style.display = 'inherit';
    document.getElementById('overlay').style.pointerEvents = 'all';


})


closepopupbuttons.addEventListener('click', function(){
    document.getElementById("select_popup").style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('overlay').style.pointerEvents = 'none';

})
