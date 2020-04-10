function updateColorPickerBackground(){
  for(let i=0;i<countries_to_compare.length;i++){
      if(countries_to_compare[i] == chart_primary_country) continue;
      try{
        $('#colorPicker-'+i.toString()).css('background-color',country_objects[countries_to_compare[i]]['color']);
      }
      catch(error){
        //console.log(error);
        $('#colorPicker-'+i.toString()).css('background-color','black');
      }
  }
}

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
    string = string + '<div class="custom-control custom-checkbox" id="country-option-div-'+i.toString()+'">';
    if(idx == -1) {
        string += '<input type="checkbox" class="custom-control-input" id="country-name-'+i.toString()+'" name="'+i.toString()+'" value="'+i.toString()+'" style="vertical-align:middle;">';
    }
    else {
      string += '<input type="checkbox" class="custom-control-input"  id="country-name-'+i.toString()+'" name="'+i.toString()+'" value="'+i.toString()+'" style="vertical-align:middle;" checked>';
    }
    string += '<label class="custom-control-label country-name-text"  for="country-name-'+i.toString()+'" ><span>'+countries[i]+'</span></label>';
    string += '<div><i class="fa fa-square" aria-hidden="true" id="colorPicker-'+i.toString()+'"></i><div id="colorPalette-'+i.toString()+'"></div></div>';
    string += '</div>';
    string_pr_country += ('<a class="dropdown-item option-control-text" href="#">' +  countries[i] + '</a> ');
  }

  $("#dropdown_menu_pr_country").html(string_pr_country);
  $("#checkBoxContainer").html(string);
  addOnClickFunctions();
  countrySelector();
  updateColorPickerBackground();
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
      string = string + '<div class="custom-control custom-checkbox" id="country-option-div-'+i.toString()+'">'; //form-check
      string += '<input type="checkbox" class="custom-control-input" id="country-name-'+i.toString()+'" name="'+i.toString()+'" value="'+i.toString()+'" style="vertical-align:middle;">'; //form-check-input
      string += '<label class="custom-control-label country-name-text"  for="country-name-'+i.toString()+'" ><span>'+countries[i]+'</span></label>'; //form-check-label
        string += '<div><i class="fa fa-square" aria-hidden="true" id="colorPicker-'+i.toString()+'"></i><div id="colorPalette-'+i.toString()+'"></div></div>';
      string += '</div>';
      string_pr_country += ('<a class="dropdown-item option-control-text" href="#">' +  countries[i] + '</a> ')
  }
  $("#dropdown_menu_pr_country").html(string_pr_country);
  $("#checkBoxContainer").html(string);
  updateColorPickerBackground();
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


function initTheVariablesAndGenerateGraph(){
  let countries=getTheCheckedCountries();
  let min_case_count=parseInt($('#min_case_count_value').text());
  //let init_day = parseInt($('#slider11').val());
  let max_day=parseInt($('#maximum_days_span').text());
  let init_day=0;
  rerenderCountryOptions();
  showGraph(chart_primary_country, countries, min_case_count, init_day, max_day, content=graph_content,
    aggregation_over = chart_aggregation_over, aggregation_type=chart_aggregation_type, normalization='none', scale=chart_type);
  MakeDescription();
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
    initTheVariablesAndGenerateGraph();
  });
}
$('#dropdown-menu-aggregation-over a').click(function(){
    chart_aggregation_over = chart_aggregation_over_variables[$(this).text()];
    $('#selected-aggregation-over').text($(this).text());
    initTheVariablesAndGenerateGraph();
  });

$('#dropdown-menu-aggregation-type a').click(function(){
    chart_aggregation_type = chart_aggregation_type_variables[$(this).text()];
    $('#selected-aggregation-type').text($(this).text());
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


function changeCountryColor (country_name, color_code) {
  country_objects[country_name]['color'] = color_code;
}

function enablingToolip(){
   $("body").tooltip({
    trigger : 'hover',
    selector: '[data-toggle=tooltip]' });
   $('.my-tooltip').tooltip({
    trigger : 'hover'
   });

   $("slider-hover").hover(function(){
     $(this).tooltip('show');
  }, function(){
    $(this).tooltip('hide');
  });
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function MakeDescription(){
  $('#content-list-span').text(content_name_map[graph_content]);
  $('#chart-type-span').text(capitalizeFirstLetter(chart_type));

  let min_case_count=parseInt($('#min_case_count_value').text());
  let minimum_cases_text = '';
  if (min_case_count == 1) {
    minimum_cases_text = min_case_count + ' case was';
  }
  else {
    minimum_cases_text = min_case_count + ' cases were';
  }
  $('#minimum-case-span').text(minimum_cases_text);
  let chart_aggregation_over_text = '';
  if (chart_aggregation_over == 'cumulative') {
    chart_aggregation_over_text = 'total number of ' + content_name_map[graph_content] + ' up to that day ';
  }
  else if (chart_aggregation_over == 'new_cases') {
    chart_aggregation_over_text = 'new ' + content_name_map[graph_content] + ' in that particular day ';
  }
  $('#aggregation-over-span').text(chart_aggregation_over_text);


  let chart_aggregation_type_text = '';
  if (chart_aggregation_type == '3_day_moving_average') {
    chart_aggregation_type_text = '3-day moving average';
    $('#aggregation-type-div').show();
  }
  else if (chart_aggregation_type == '7_day_moving_average') {
    chart_aggregation_type_text = '7-day moving average';
    $('#aggregation-type-div').show();
  }
  else {
    $('#aggregation-type-div').hide();
  }
  $('#aggregation-type-span').text(chart_aggregation_type_text);
}
