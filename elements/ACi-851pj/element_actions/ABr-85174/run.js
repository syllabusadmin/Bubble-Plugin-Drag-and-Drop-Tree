function(instance, properties, context) {

         /*old 
	if(properties.expand){
        $('.quillEditor:hidden').toggle('fast', 'swing');
        $('.expandEditor').html("expand_less");
    }else{
        $('.quillEditor:visible').toggle('fast', 'swing');
        $('.expandEditor').html("expand_more");
    }
*/
instance.data.expander = properties.expand;
    instance.data.logging ? console.log("expand expander", instance.data.expander) : null;
    if (instance.data.expander) {
        instance.data.APS.forEach((aps) => {
            const uniqueId = aps._id;
            instance.canvas.find('#' + uniqueId + '.quillEditor').slideDown('fast', 'swing');
            if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
                instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');
            } 
            //CSP Add for Slider
            if (instance.data.sliderEnabled) {
                instance.canvas.find(`#slider-aps-${uniqueId}`).removeClass('slider_invisible');
            } 
            //CSP Add for new Label Title
            if (instance.canvas.find(`#labelTitle-${uniqueId}`).hasClass('slider_invisible')) {
                instance.canvas.find(`#labelTitle-${uniqueId}`).removeClass('slider_invisible');
            } 
        })
    } else {
        instance.data.APS.forEach((aps) => {
            const uniqueId = aps._id;
            instance.canvas.find('#' + uniqueId + '.quillEditor').slideUp('fast', 'swing');
            if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_less') {   
                instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');
            }
            if (instance.data.sliderEnabled) {
                instance.canvas.find(`#slider-aps-${uniqueId}`).addClass('slider_invisible');
            }
            instance.canvas.find(`#labelTitle-${uniqueId}`).addClass('slider_invisible');
        })
    }

}