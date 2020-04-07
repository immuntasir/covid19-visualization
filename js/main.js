"use strict"
$(document).ready(function(){
    var countries=["Italy","France","Germany","USA"];
    
    $.each(countries,function(index,value){
        var checkbox="<label for="+value+" class='label-containter'>"+value+"<input type='label-checkbox' id="+value+" value="+value+" name="+value+"><span class='label-checkmark'></span></label>"
        $(".checkBoxContainer").append($(checkbox));
    })
    
    });