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
    var bd_data = allCountries.filter(function(x){
        return x['Country/Region'] == country_name;
    });
    console.log(bd_data)
  }

  nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })    //Specify the data accessors.
        .y(function(d) { return d.value })
        .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
        .showValues(true)       //...instead, show the bar value right on top of each bar.
        ;

    d3.select('#chart svg')
        .datum(exampleData())
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });

  //Each bar represents a single discrete quantity.
  function exampleData() {
   return  [
      {
        key: "Cumulative Return",
        values: [
          {
            "label" : "A Label" ,
            "value" : -29.765957771107
          } ,
          {
            "label" : "B Label" ,
            "value" : 0
          } ,
          {
            "label" : "C Label" ,
            "value" : 32.807804682612
          } ,
          {
            "label" : "D Label" ,
            "value" : 196.45946739256
          } ,
          {
            "label" : "E Label" ,
            "value" : 0.19434030906893
          } ,
          {
            "label" : "F Label" ,
            "value" : -98.079782601442
          } ,
          {
            "label" : "G Label" ,
            "value" : -13.925743130903
          } ,
          {
            "label" : "H Label" ,
            "value" : -5.1387322875705
          }
        ]
      }
    ]

  }

$(document).ready(function(){
    var countries=['Italy',"France","Germany","USA"];
    let string='',value='';
    for(let i=0;i<countries.length;i++){
        value = countries[i];
        string = string + '<div class="custom-control custom-checkbox" id="country-'+value+'">';
        string += '<input type="checkbox" class="custom-control-input" id="'+value+'" name="'+value+'" value="'+value+'">';
        string += '<label class="custom-control-label" for="'+value+'" ><span>'+value+'</span></label>';
        string += '</div>';
    }
    console.log(string);
    $("#checkBoxContainer").html(string);

    /*$.each(countries,function(index,value){
        var checkbox='<div class="custom-control custom-checkbox">';
        var checkbox="<label for="+value+" class='label-containter'>"+value+"<input type='label-checkbox' id="+value+" value="+value+" name="+value+"><span class='label-checkmark'></span></label>"
        $(".checkBoxContainer").append($(checkbox));
    })*/



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
