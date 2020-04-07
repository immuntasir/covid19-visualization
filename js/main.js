var allCountriesData;
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

  function getCountryData (country_name, min_case_count = 10, init_day = 0, max_day = 20, type='cumulative') {
    var country_data = allCountriesData.filter(function(x){
        return x['Country/Region'] == country_name;
    })[0];

    country_data_keys = Object.keys(country_data);
    data_by_date_keys = country_data_keys.slice(4, );
    is_relevant = false;

    var ret_values = [];
    var init_day = 0;
    for (let i=0; i<data_by_date_keys.length; i++) {
        if (is_relevant == true && i > init_day + max_day) {
            break;
        }
        if (is_relevant == false && country_data[data_by_date_keys[i]] >= min_case_count && i>=init_day) {
            is_relevant = true;
            init_day = i;
        }
        if (is_relevant == false) {
            continue;
        }
        value = 0
        if (type == 'cumulative') {
            value = parseInt(country_data[data_by_date_keys[i]]);
        }
        ret_values.push(value);
    }
    ret_values = [country_name].concat(ret_values);
    return ret_values;
  }

  function showGraph(countries) {
    bd_data = getCountryData('Bangladesh');
    data_columns = [bd_data];
    for (let i=0; i<countries.length; i++)  {
        data_columns.push(getCountryData(countries[i]))
    }
    var chart = c3.generate({
        data: {
            columns: data_columns,
            type: 'line',
            types: {
                Bangladesh: 'bar',
            }           
        }
    });
    d3.select('#chart svg')
            .call(chart);
  }




function showCountryOptions(){
  var countries=['Italy',"France","Germany","USA"];
  let string='',value='';
  for(let i=0;i<countries.length;i++){
      value = countries[i];
      string = string + '<div class="custom-control custom-checkbox" id="country-option-div-'+i.toString()+'">';
      string += '<input type="checkbox" class="custom-control-input" id="country-name-'+i.toString()+'" name="'+value+'" value="'+value+'">';
      string += '<label class="custom-control-label" for="country-name-'+i.toString()+'" ><span>'+value+'</span></label>';
      string += '</div>';
  }
  console.log(string);
  $("#checkBoxContainer").html(string);
}

function showGraphOptions(){
  var list=['Total cases'," New cases per day","Total cases per capita"];
  let string='',value='';
  string += '<div class="tab">';
  for(let i=0;i<list.length;i++){
      value = list[i];
      string += '<button class="tablinks" id="graph-option-'+i.toString()+'">'+value+'</button>';
  }
  string += '</div>';
  //console.log(string);
  $("#checkBoxContainer2").html(string);
}

function sliderDayBased(){
  const $valueSpan = $('.valueSpan');
  const $value = $('#slider11');
  $valueSpan.html($value.val());
  $value.on('input change', () => {
  $valueSpan.html($value.val());
  });
}

function sliderCaseBased(){
  const $valueSpan = $('.valueSpan2');
  const $value = $('#slider12');
  $valueSpan.html($value.val());
  $value.on('input change', () => {
  $valueSpan.html($value.val());
  });
}

$(document).ready(function(){
    showCountryOptions();
    showGraphOptions();
    sliderDayBased();
    sliderCaseBased();


    var data;
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
        dataType: "text",
        success: function(response)
        {
            data = $.csv.toArrays(response);
            allCountriesData = csvJSON(data);
            var bd_data = getCountryData('Bangladesh');
            countries = ['India', 'Saudi Arabia', 'Malaysia'];
            showGraph(countries, min_case_count = 10, init_day = 0, max_day = 20, type='cumulative');
        }
        });

    });
