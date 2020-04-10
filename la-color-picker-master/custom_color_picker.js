function chooseColor(e, colorInput, colorPalette) {
    let color = rgbToHex(e.target.style.backgroundColor);
    //colorInput.value = color;
    colorInput.style.borderRight = `10px solid ${color}`;
    colorPalette.style.display = 'none'
}

function colorOptionHook(){
    $('.color-option').on('click',function(){
    let id = $(this).attr('id');
    let country_id = id.split('_')[1];
    let color_code = id.split('_')[0];
    document.getElementById('colorPalette-'+country_id).style.display='none';
    let country_name = countries_to_compare[parseInt(country_id)];
    country_objects[country_name]['color'] = color_code;
    $('#colorPicker-'+country_id).css('color',color_code);
    if($('#country-name-'+country_id).prop('checked')==true){
      initTheVariablesAndGenerateGraph();
    }
  });
}

function customColorPicker(colorPicker_id, colorPalette_id){
      let country_id = colorPicker_id.split('-')[1];

      var colorInput = document.getElementById(colorPicker_id);
      var colorPalette = document.getElementById(colorPalette_id);
      colorInput.addEventListener("click", showColorPalette);
      colorInput.addEventListener("focusout", hideColorPalette);
      colorPalette.mouseIsOver = !1;
      colorInput.style.borderRight = `10px solid ${colorInput.value}`;
      colorPalette.onmouseover = () => {
          colorPalette.mouseIsOver = !0
      };
      colorPalette.onmouseout = () => {
          colorPalette.mouseIsOver = !1
      }

      function hideColorPalette() {
          if (colorPalette.mouseIsOver === !1) {
              colorPalette.style.display = 'none';
              colorInput.style.borderRight = `10px solid ${colorInput.value}`
          }
      }

      function showColorPalette() {
          colorPalette.style.display = 'block';
          var newDiv = '<div style="overflow-y: auto; height:300px;">';
          for(let i=0;i<country_colors.length;i++){
            newDiv += '<div class="color-option" style="background-color:'+country_colors[i]+'" id="'+country_colors[i]+'_'+country_id+'"></div>';
          }
          newDiv += '</div>';
          colorPalette.innerHTML = newDiv;
          colorOptionHook();
      }
}
