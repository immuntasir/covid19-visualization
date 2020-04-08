var allCountriesData = Object();

var countries_to_compare = ['Italy', 'France', 'Spain', 'US', 'Malaysia', 'India', 'Saudi Arabia', 'Mexico', 'Germany', 'Greece', 'Pakistan', 'Singapore'];

var content_list=['Cases',"Death","Recovered"];
var content_actual_name=['cases','death','recovered'];
var content_actual_name_ids=['content-cases','content-death','content-recovery'];

var graph_content='cases';
var chart_aggregation = 'cumulative';

chart_aggregation_types = Object()
chart_aggregation_types['Total Cases'] = 'cumulative';
chart_aggregation_types['New Cases'] = 'new_cases';
chart_aggregation_types['3-day Moving Average'] = '3_day_moving_average';
chart_aggregation_types['7-day Moving Average'] = '7_day_moving_average';
