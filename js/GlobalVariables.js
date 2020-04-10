var allCountriesData = Object();

var countries_to_compare = ["Bangladesh", "France", "Germany", "Greece", "India", "Italy", "Malaysia", "Mexico", "Pakistan", "Saudi Arabia", "Singapore", "Spain", "US",
                            "Iran", "Turkey", "United Kingdom", "United Arab Emirates", "Sri Lanka", "Maldives", "Japan", "Iraq", "Indonesia",
                        "Finland", "Sweden", "Norway", "Denmark", "Thailand", "Nepal", "Bhutan", "Afghanistan", "Korea, South", "Kuwait", "Oman", "Qatar",
                    "South Africa", "Egypt"];

var content_list=['Cases',"Death","Recovered"];
var content_actual_name=['cases','death','recovered'];
var content_actual_name_ids=['content-cases','content-death','content-recovery'];

var graph_content='cases';
var chart_aggregation_over = 'cumulative';
var chart_aggregation_type = 'none';

chart_aggregation_over_variables = Object()
chart_aggregation_type_variables = Object()
chart_aggregation_over_variables['Total Cases'] = 'cumulative';
chart_aggregation_over_variables['New Cases'] = 'new_cases';
chart_aggregation_type_variables['None'] = 'none'
chart_aggregation_type_variables['3-day Moving Average'] = '3_day_moving_average';
chart_aggregation_type_variables['7-day Moving Average'] = '7_day_moving_average';

var chart_type='linear';
var chart_type_ids=['scale-linear','scale-logarithmic'];


var chart_primary_country = 'Bangladesh';
var chart_type_primary_country = 'bar';
var chart_type_comparing_countries = 'line';

var bd_press_briefing_data = Object()
bd_press_briefing_data['Date'] = ""
bd_press_briefing_data['cases'] = ""
bd_press_briefing_data['death'] = ""
bd_press_briefing_data['recovered'] = ""

var country_current_init_dates = Object();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var content_name_map = {
    'cases': 'Confirmed Cases',
    'death': 'Reported Deaths',
    'recovered': 'Recovered Cases'
}
