function rerenderCountryOptions(){
  var countries=countries_to_compare;
  let string='',value='';
  let string_pr_country = '';
  var selected_countries=getTheCheckedCountries();
  //selected_countries.push(prev_primary_country);

  for(let i=0;i<countries.length;i++){
    if(countries[i] == chart_primary_country) continue;
    let idx = selected_countries.indexOf(countries[i]);
    value = countries[i];
    value = value.split(' ').join("_");
    string = string + '<div class="custom-control custom-checkbox form-check" id="country-option-div-'+value+'">';
    if(idx == -1) {
        string += '<input type="checkbox" class="custom-control-input form-check-input" id="country-name-'+value+'" name="'+value+'" value="'+value+'" style="vertical-align:middle;">';
    }
    else {
      string += '<input type="checkbox" class="custom-control-input form-check-input"  id="country-name-'+value+'" name="'+value+'" value="'+value+'" style="vertical-align:middle;" checked>';
    }
    string += '<label class="custom-control-label form-check-label" for="country-name-'+value+'" ><span>'+countries[i]+'</span></label>';
    string += '</div>';
    string_pr_country += ('<a class="dropdown-item option-control-text" href="#">' +  countries[i] + '</a> ');
  }

  $("#dropdown_menu_pr_country").html(string_pr_country);
  $("#checkBoxContainer").html(string);
  addOnClickFunctions();
  countrySelector();
}

function showCountryOptions(){
  var countries=countries_to_compare;
  let string='',value='';
  let string_pr_country = '';
  for(let i=0;i<countries.length;i++){
      value = countries[i];
      value = value.split(' ').join("_");
      if(value == chart_primary_country){
         continue;
      }
      string = string + '<div class="custom-control custom-checkbox form-check" id="country-option-div-'+value+'">';
      string += '<input type="checkbox" class="custom-control-input form-check-input" id="country-name-'+value+'" name="'+value+'" value="'+value+'" style="vertical-align:middle;">';
      string += '<label class="custom-control-label form-check-label" for="country-name-'+value+'" ><span>'+countries[i]+'</span></label>';
      string += '</div>';
      string_pr_country += ('<a class="dropdown-item option-control-text" href="#">' +  countries[i] + '</a> ')
  }
  $("#dropdown_menu_pr_country").html(string_pr_country);
  $("#checkBoxContainer").html(string);
}

function colorChanger(idx){
  for(let i=0;i<content_actual_name_ids.length;i++){
    let element = document.getElementById(content_actual_name_ids[i]);
    if(i==idx){
        if($('#'+content_actual_name_ids[i]).hasClass('btn-secondary') ==false){
            $('#'+content_actual_name_ids[i]).toggleClass('btn-light');
            $('#'+content_actual_name_ids[i]).toggleClass('btn-secondary');
        }
    }
    else{
      if($('#'+content_actual_name_ids[i]).hasClass('btn-secondary') ==true){
          $('#'+content_actual_name_ids[i]).toggleClass('btn-light');
          $('#'+content_actual_name_ids[i]).toggleClass('btn-secondary');
      }
    }
  }
}

function graphContentOptionSelection(idx,id){
  idx=parseInt(idx);
  graph_content =  content_actual_name[idx];
  colorChanger(idx);
  initTheVariablesAndGenerateGraph();
}

function changeColorChartTypeButton(id){
  for(let i=0;i<chart_type_ids.length;i++){
    if(chart_type_ids[i] == id){
      if($('#'+chart_type_ids[i]).hasClass('btn-secondary') ==false){
          $('#'+chart_type_ids[i]).toggleClass('btn-light');
          $('#'+chart_type_ids[i]).toggleClass('btn-secondary');
      }
    }
    else{
      if($('#'+chart_type_ids[i]).hasClass('btn-secondary') ==true){
          $('#'+chart_type_ids[i]).toggleClass('btn-light');
          $('#'+chart_type_ids[i]).toggleClass('btn-secondary');
      }
    }
  }
}

function selectChartType(idx,value){
  idx=parseInt(idx);
  chart_type = value;
  let id=chart_type_ids[idx];
  changeColorChartTypeButton(id);
  initTheVariablesAndGenerateGraph();

}

function showGraphOptions(){
  let string='',value='';
  string += '<div class="tab">';
  for(let i=0;i<content_list.length;i++){
      value = content_list[i];
      string += '<button class="tablinks" class="graph-option" id="graph-option-'+i.toString()+'" onClick="graphContentOptionSelection('+"'"+content_actual_name[i]+"'"+','+i+')" >'+value+'</button>';
  }
  string += '</div>';
  $("#checkBoxContainer2").html(string);
}

function makeFirstLetterCapital(value){
  let result="";
  for(let i=0;i<value.length;i++){
    if(i==0) {
      result=result+value.charAt(i).toUpperCase();
    }
    else{
      result=result+value.charAt(i);
    }
  }
  return result;
}

function returnTheMainChartAggregation(key_value){
  let keys=Object.keys(chart_aggregation_types);
  for(let i=0;i<keys.length;i++){
    let key=keys[i];
    if(chart_aggregation_types[key] == key_value){
      return key;
    }
  }
}

function initTheVariablesAndGenerateGraph(){
  let countries=getTheCheckedCountries();
  let min_case_count=parseInt($('#slider12').val());
  //let init_day = parseInt($('#slider11').val());
  let max_day=parseInt($('#slider13').val());

  let init_day=0;
  showGraph(chart_primary_country, countries, min_case_count, init_day, max_day, content=graph_content, aggregation=chart_aggregation, normalization='none', scale=chart_type);
  rerenderCountryOptions();
  let list=[makeFirstLetterCapital(graph_content),returnTheMainChartAggregation(chart_aggregation),min_case_count,max_day,makeFirstLetterCapital(chart_type)];
  MakeDescription(list);

}

function makeFiveMultipleOrOne(value){
  if(value == 1) return value;
  else {
    value=value-1;
    return value;
  }
}

function genericSlider(value_span_id,slider_id){
  const $valueSpan = $('.'+value_span_id);
  const $value = $('#'+slider_id);
  $valueSpan.html($value.val());
  $value.on('input change', () => {
  let res = parseInt($value.val());
  if(slider_id == 'slider12'){
    res = makeFiveMultipleOrOne(res);
  }
  $valueSpan.html(res);
  initTheVariablesAndGenerateGraph();
  });
}

function initMinimumCaseSlider(value_span_id){
  const $valueSpan = $('.'+value_span_id);
  $valueSpan.html('10');
}

function getTheCheckedCountries(){
  let list=[],id="";
  for(let i=0;i<countries_to_compare.length;i++){
    let value = countries_to_compare[i].split(' ').join("_");
    id='country-name-'+value;
    if($('#'+id).prop('checked') == true){
      list.push(countries_to_compare[i]);
    }
  }
  return list;
}

function countrySelector(){
  let list=[];
  $('input[type="checkbox"]').click(function(){
    initTheVariablesAndGenerateGraph();
  });
}

$('#dropdown-menu-aggregation a').click(function(){
    chart_aggregation = chart_aggregation_types[$(this).text()];
    $('#selected-aggregation').text($(this).text());
    initTheVariablesAndGenerateGraph();
  });

function addOnClickFunctions() {
  $('#dropdown_menu_pr_country a').click(function(){
    chart_primary_country = $(this).text();
    $('#selected_pr_country').text($(this).text());
    initTheVariablesAndGenerateGraph();
  });

  $('#dropdown_menu_pr_country_chart_type a').click(function(){
    chart_type_primary_country = $(this).text().toLowerCase();
    $('#selected_pr_country_chart_type').text($(this).text());
    initTheVariablesAndGenerateGraph();
  });
}


function enablingToolip(){
   $("body").tooltip({ selector: '[data-toggle=tooltip]' });
   $('.my-tooltip').tooltip();

   $("slider-hover").hover(function(){
     $(this).tooltip('show');
  }, function(){
    $(this).tooltip('hide');
  });
}


function MakeDescription(list){
  $('#content-list-span').text(list[0]);
  $('#chart-aggregation-span').text(list[1]);
  $('#minimum-case-span').text(list[2]);
  $('#minimum-days-span').text(list[3]);
  $('#chart-type-span').text(list[4])
}
