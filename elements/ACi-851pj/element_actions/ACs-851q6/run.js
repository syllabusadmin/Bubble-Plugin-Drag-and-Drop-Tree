function(instance, properties, context) {


  //Load any data 

instance.canvas.innerHTML = '';
instance.data.start = true;
instance.data.halt = false;
instance.data.sliderEnabled = properties.carousels_disabled;
instance.data.disabled = properties.read_only;
instance.data.resetPlan();
instance.data.logging ? console.log('Process started!') : null;

  //Do the operation



}