var allCountriesData = Object();

var countries_to_compare = ['Italy', 'France', 'Spain', 'US', 'Malaysia', 'India', 'Saudi Arabia', 'Mexico', 'Germany', 'Greece', 'Pakistan', 'Singapore'];

var content_list=['Cases',"Death","Recovered"];
var content_actual_name=['cases','death','recovered'];
var graph_content='cases';


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

  function getCountryRow(country_name, content='cases') {
      var country_rows;  
      country_rows = allCountriesData[content]; 
      
      var country_data
      if (country_name == 'France') {
        country_data = country_rows.filter(function(x) {
            return x['Country/Region'] == 'France' && x['Province/State'] == '';
        })[0];
      }
      else {
        country_data = country_rows.filter(function(x){
            return x['Country/Region'] == country_name;
        })[0];
      }
      return country_data;
  }

  function getCountryData (country_name, min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative') {
    var country_data = getCountryRow(country_name, content);

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
        if (aggregation == 'cumulative') {
            value = parseInt(country_data[data_by_date_keys[i]]);
        }
        ret_values.push(value);
    }
    ret_values = [country_name].concat(ret_values);
    return ret_values;
  }

  function showGraph(countries, min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative', normalization='none', scale='linear') {
    bd_data = getCountryData('Bangladesh', min_case_count, init_day, max_day, content, aggregation);
    console.log(bd_data);
    data_columns = [bd_data];
    for (let i=0; i<countries.length; i++)  {
        data_columns.push(getCountryData(countries[i], min_case_count, init_day, max_day, content, aggregation))
    }

    for (let i=0; i<data_columns.length; i++) {
        for (let j=1; j<data_columns[i].length; j++) {
            data_columns[i][j] = Math.log10(data_columns[i][j]);
        }
    }

    var chart = c3.generate({
        data: {
            columns: data_columns,
            type: 'line',
            types: {
                Bangladesh: 'bar',
            }
        },
        axis : {
            y : {
                show:true,
                tick: {
                   format: function (d) { return Math.pow(10,d).toFixed(0); }
                }
            },
            x : {
                show:true,
                tick: {
                   format: function (d) { return 'Day ' + d; }
                }
            }
        },
    });
  }




function showCountryOptions(){
  var countries=countries_to_compare;
  let string='',value='';
  for(let i=0;i<countries.length;i++){
      value = countries[i];
      string = string + '<div class="custom-control custom-checkbox form-check" id="country-option-div-'+i.toString()+'">';
      string += '<input type="checkbox" class="custom-control-input form-check-input" id="country-name-'+i.toString()+'" name="'+value+'" value="'+value+'" style="vertical-align:middle;">';
      string += '<label class="custom-control-label form-check-label" for="country-name-'+i.toString()+'" ><span>'+value+'</span></label>';
      /*string += '<div class="form-check" id="country-option-div-'+i.toString()+'">';
      string += '<input type="checkbox" class="form-check-input" id="country-name-'+i.toString()+'" name="'+value+'" value="'+value+'">';
      string += '<label class="form-check-label" for="country-name-'+i.toString()+'" ><span>'+value+'</span></label>';*/
      string += '</div>';
  }
  //console.log(string);
  $("#checkBoxContainer").html(string);
}

function colorChanger(idx){
  for(let i=0;i<content_actual_name.length;i++){
    if(i==parseInt(idx)){
        document.getElementById("graph-option-"+i).style.color="blue";
    }
    else{
      document.getElementById("graph-option-"+i).style.color="black";
    }
  }
}

function graphContentOptionSelection(type,idx){
  graph_content = type;
  colorChanger(idx);
  InitTheVariablesAndGenerateGraph();
}

function showGraphOptions(){
  let string='',value='';
  string += '<div class="tab">';
  for(let i=0;i<content_list.length;i++){
      value = content_list[i];
      string += '<button class="tablinks" class="graph-option" id="graph-option-'+i.toString()+'" onClick="graphContentOptionSelection('+"'"+content_actual_name[i]+"'"+','+i+')" >'+value+'</button>';
  }
  string += '</div>';
  //console.log(string);
  $("#checkBoxContainer2").html(string);
}

function InitTheVariablesAndGenerateGraph(){
  let countries=getTheCheckedCountries();
  let min_case_count=parseInt($('#slider12').val());
  //let init_day = parseInt($('#slider11').val());
  let max_day=parseInt($('#slider13').val());
  if(countries.indexOf('Bangladesh') == -1){
    countries.push('Bangladesh');
  }
  let init_day=0;
  console.log(graph_content);
  showGraph(countries, min_case_count, init_day, max_day, content=graph_content, aggregation='cumulative', normalization='none', scale='linear');

}

function genericSlider(value_span_id,slider_id){
  const $valueSpan = $('.'+value_span_id);
  const $value = $('#'+slider_id);
  $valueSpan.html($value.val());
  $value.on('input change', () => {
  $valueSpan.html($value.val());
  InitTheVariablesAndGenerateGraph();
  });
}

function getTheCheckedCountries(){
  let list=[],id="";
  for(let i=0;i<countries_to_compare.length;i++){
    id='country-name-'+i.toString();
    if($('#'+id).prop('checked') == true){
      list.push(countries_to_compare[i]);
    }
  }
  return list;
}

function countrySelector(){
  let list=[];
  $('input[type="checkbox"]').click(function(){
    if($(this).prop("checked") == true){
        console.log("Checkbox is checked.");

    }
    else if($(this).prop("checked") == false){
        console.log("Checkbox is unchecked.");
    }
    InitTheVariablesAndGenerateGraph();
});
}

$('#dropdown-menu-aggregation a').click(function(){
    $('#selected-aggregation').text($(this).text());
  });

  
$(document).ready(function(){
    //genericSlider('valueSpan','slider11');
    genericSlider('valueSpan2','slider12');
    genericSlider('valueSpan3','slider13');
    showCountryOptions();
    showGraphOptions();
    countrySelector();
    colorChanger("0");



    var data;
    urls = ["https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
            "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
            "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"]
    
    for (let i=0; i<urls.length; i++) {
        data_url = urls[i];
        $.ajax({
            type: "GET",
            url: data_url,
            dataType: "text",
            success: function(response)
            {
                data = $.csv.toArrays(response);
                allCountriesData[content_actual_name[i]] = csvJSON(data);
                var bd_data = getCountryData('Bangladesh');
                if (i==0) {
                    showGraph([], min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative', normalization='none', scale='linear');
                }
                }
            });    
    }
    });
