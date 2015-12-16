var cterm = {};
var termsolved = true;
var defHidden = true;
function showDef() { $(".def").html(cterm.def); defHidden = false; }

function hideDef() { $(".def").html(""); defHidden = true; }
function showTerm() {
  if(termsolved) {
    $.getJSON( "http://localhost:3000/term?rand=true&spec=true", function( data ) {
      cterm = data;
      termsolved = false;
      $(".term").html(cterm.term + " (R:" + (cterm.right || 0) + "/W:" + (cterm.wrong || 0) + ")")
    });
  }
  else {
    showDef();
  }
}

function markCorrect() {
  if(defHidden)
    return null;
  $.getJSON( "http://localhost:3000/term/" + cterm.id + "/right",  function( data ) {
    termsolved = true;
    showTerm();
    hideDef();
  });
}

function markWrong() {
  if(defHidden)
    return null;
  $.getJSON( "http://localhost:3000/term/" + cterm.id + "/wrong",  function( data ) {

    termsolved = true;
    showTerm();
    hideDef();
  });
}

document.onkeydown = checkKey;
window.onbeforeunload = function() {
  $.getJSON( "http://localhost:3000/kill",  function( data ) {
  });
};
window.addEventListener("beforeunload", function(e){
  $.getJSON( "http://localhost:3000/kill",  function( data ) {
  });
}, false);
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        showTerm()
    }
    else if (e.keyCode == '37') {
       markWrong()
    }
    else if (e.keyCode == '39') {
       markCorrect()
    }
}
