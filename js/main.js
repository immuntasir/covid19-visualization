function csvJSON(csv){

    var lines=csv;
  
    var result = [];
  
    var headers=lines[0]
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i];
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    
    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
  }


  function filterByCountry(x) {
    var countries=['Italy',"France","Germany","USA"];
    for (let i=0; i<countries.length; i++){
        if (countries[i] == x) {
            return true;
        }
    }
    return false;
  }

  function getCountryData (allCountries, country_name) {
    return allCountries.filter(function(x){
        return x['Country/Region'] == country_name;
    })
  }

$(document).ready(function(){
    var countries=Array(['Italy',"France","Germany","USA"]);
    
    $.each(countries,function(index,value){
        var checkbox="<label for="+value+" class='label-containter'>"+value+"<input type='label-checkbox' id="+value+" value="+value+" name="+value+"><span class='label-checkmark'></span></label>"
        $(".checkBoxContainer").append($(checkbox));
    })
    

    
    var data;
    $.ajax({
        type: "GET",  
        url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
        dataType: "text",       
        success: function(response)  
        {
            data = $.csv.toArrays(response);
            var jsonData = csvJSON(data);
            var bd_data = getCountryData(jsonData, 'Bangladesh');
            console.log(bd_data);
        }   
        });



    });