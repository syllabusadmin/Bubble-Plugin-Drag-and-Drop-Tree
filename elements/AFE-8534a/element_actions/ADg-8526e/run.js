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
    console.log(`running the expander function`)

    instance.data.expander = properties.expand;
    instance.data.logging ? console.log("expand expander", instance.data.expander) : null;
    if (instance.data.expander) {
        instance.data.APS.forEach((aps) => {
            const uniqueId = aps._id;
            instance.canvas.find('#' + uniqueId + '.quillEditor').slideDown('fast', 'swing');
            let element = instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']')[0]?.parentElement.nextSibling;
            console.log(`element expander`, element)

            if (element?.style) {
                element.style.paddingTop = '16px';
            }


            if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
                instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');


            }
            //CSP Add for Slider
            if (instance.data.sliderEnabled) {
                instance.canvas.find(`#slider-aps-${uniqueId}`).removeClass('slider_invisible');
            }
        })
    } else {
        instance.data.APS.forEach((aps) => {
            const uniqueId = aps._id;
            instance.canvas.find('#' + uniqueId + '.quillEditor').slideUp('fast', 'swing');
            let element = instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']')[0]?.parentElement.nextSibling;
            console.log(`element expander`, element)

            if (element?.style) {
                element.style.paddingTop = '0px';
            }

            if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_less') {
                instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');

            }
            if (instance.data.sliderEnabled) {
                instance.canvas.find(`#slider-aps-${uniqueId}`).addClass('slider_invisible');
            }
        })
    }


}