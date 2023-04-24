function(instance, properties, context) {


  //checks to insure that function is initialized
if(typeof instance.data.resetPlan === 'function') {


instance.canvas.html('');
instance.data.start = true;
//instance.data.halt = false;
instance.data.sliderEnabled = properties.carousels_disabled;
instance.data.disabled = properties.read_only;
instance.data.resetPlan();
instance.data.logging ? console.log('Process started!') : null;

}

}