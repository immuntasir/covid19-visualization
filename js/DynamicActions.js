function initiateColorPickerPortion(){
  for(let i=0;i<countries_to_compare.length;i++){
    if(countries_to_compare[i] == chart_primary_country) continue;
      customColorPicker('colorPicker-'+i.toString(),'colorPalette-'+i.toString());
  }
}

function updateColorPickerBackground(){
  for(let i=0;i<countries_to_compare.length;i++){
      if(countries_to_compare[i] == chart_primary_country) continue;
      try{
        $('#colorPicker-'+i.toString()).css('color',country_objects[countries_to_compare[i]]['color']);
      }
      catch(error){
        //console.log(error);
        $('#colorPicker-'+i.toString()).css('color','black');
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
    string += '<label class="custom-control-label country-name-text"  for="country-name-'+i.toString()+'" ><span>'+countries[i]+'</span></label><i class="fa fa-square font-awesome-square" style="display: inline: float: right;" aria-hidden="true" id="colorPicker-'+i.toString()+'"></i>';
    string += '<div><div style="display:none;" id="colorPalette-'+i.toString()+'"></div></div>';
    string += '</div>';
    string_pr_country += ('<a class="dropdown-item option-control-text" href="#">' +  countries[i] + '</a> ');
  }

  $("#dropdown_menu_pr_country").html(string_pr_country);
  $("#checkBoxContainer").html(string);
  addOnClickFunctions();
  countrySelector();
  updateColorPickerBackground();
  initiateColorPickerPortion();
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
      string += '<label class="custom-control-label country-name-text"  for="country-name-'+i.toString()+'" ><span>'+countries[i]+'</span></label><i class="fa fa-square font-awesome-square" style="display: inline: float: right;" aria-hidden="true" id="colorPicker-'+i.toString()+'"></i>'; //form-check-label
        string += '<div><div style="display:none;" id="colorPalette-'+i.toString()+'"></div></div>';
      string += '</div>';
      string_pr_country += ('<a class="dropdown-item option-control-text" href="#">' +  countries[i] + '</a> ')
  }
  $("#dropdown_menu_pr_country").html(string_pr_country);
  $("#checkBoxContainer").html(string);
  updateColorPickerBackground();
  initiateColorPickerPortion();
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
  if (content_actual_name[idx] == graph_content) {
    return;
  }
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
  if (value==chart_type) {
    return;
  }
  idx=parseInt(idx);
  chart_type = value;
  let id=chart_type_ids[idx];
  changeColorChartTypeButton(id);
  initTheVariablesAndGenerateGraph();

}

function changeColorAggregationOver(aggregation_over) {
  for (let i=0; i<aggregation_over_options.length; i++) {
    if($('#aggregation_over_'+aggregation_over_options[i]).hasClass('btn-secondary') ==true){
        $('#aggregation_over_'+aggregation_over_options[i]).removeClass('btn-secondary');
        $('#aggregation_over_'+aggregation_over_options[i]).addClass('btn-light');
    }
  }
  if ($('#aggregation_over_'+aggregation_over).hasClass('btn-light') == true) {
    $('#aggregation_over_'+aggregation_over).removeClass('btn-light');
    $('#aggregation_over_'+aggregation_over).addClass('btn-secondary');
  }
};

function selectAggregationOver(aggregation_over){
  if (aggregation_over == chart_aggregation_over) {
    return;
  }
  chart_aggregation_over = aggregation_over;
  changeColorAggregationOver(aggregation_over);
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

$('#dropdown-menu-aggregation-type a').click(function(){
    if (chart_aggregation_type == chart_aggregation_type_variables[$(this).text()]) {
      return;
    }
    chart_aggregation_type = chart_aggregation_type_variables[$(this).text()];
    $('#selected-aggregation-type').text($(this).text());
    initTheVariablesAndGenerateGraph();
  });

function addOnClickFunctions() {
  $('#dropdown_menu_pr_country a').click(function(){
    if (chart_primary_country == $(this).text()) {
      return;
    }
    chart_primary_country = $(this).text();
    $('#selected_pr_country').text($(this).text());
    initTheVariablesAndGenerateGraph();
  });

  $('#dropdown_menu_pr_country_chart_type a').click(function(){
    if (chart_type_primary_country == $(this).text().toLowerCase()) {
      return;
    }
    chart_type_primary_country = $(this).text().toLowerCase();
    $('#selected_pr_country_chart_type').text($(this).text());
    initTheVariablesAndGenerateGraph();
  });

  $("a[href='#nav-distribution']").on('shown.bs.tab', function(e) {
    loadDataAndShowDistributionMap();
    console.log('shown - after the tab has been shown');
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

//map maker section
function showLastUpdateDate(){
    $('#distribution-last-updated-span').text(last_update);
}

function sortDictionaryOnKey(dict, index,key_name){
  // Create items array
  var items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });
  //console.log(items);
  // Sort the array based on the index
  items.sort(function(first, second) {
    return parseInt(second[index][key_name]) - parseInt(first[index][key_name]);
  });
  return items;
}

function showBangladeshDistrictWiseTable(){
  let sorted_data = sortDictionaryOnKey(district_data,1,last_update);
  let string = '<table class="table">';
  string += '<thead>';
  string += '<tr>';
  string += '<th scope="col">#</th>';
  //string += '<th scope="col">Division</th>';
  string += '<th scope="col">District</th>';
  string += '<th scope="col">Count</th>';
  string += '</tr>';
  string += '</thead>';
  string += '<tbody>';
  for(let i=0;i<sorted_data.length;i++){
    console.log(sorted_data[i]);
    string += '<tr>';
      string += '<th scope="row">'+(i+1).toString()+'</th>';
      //string += '<td>'+sorted_data[i][1]['Division']+'</td>';
      string += '<td>'+sorted_data[i][1]['District']+'</td>';
      string += '<td>'+sorted_data[i][1][last_update]+'</td>';
    string += '</tr>';
  }
  string += '</tbody>';
  string += '</table>';
  $('#district-wise-table').html(string);
}
