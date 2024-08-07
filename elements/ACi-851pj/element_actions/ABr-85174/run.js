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
    instance.data.logging ? console.log(`running the expander function`):null;

    instance.data.expander = properties.expand;
    instance.data.logging ? console.log("expand expander", instance.data.expander) : null;
    if (instance.data.expander) {
        instance.data.APS.forEach((aps) => {
            const uniqueId = aps._id;
            instance.canvas.find('#' + uniqueId + '.quillEditor').slideDown('fast', 'swing');
            let element = instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']')[0]?.parentElement.nextSibling;
            instance.data.logging ? console.log(`element expander`, element):null;

            if (element?.style) {
                element.style.paddingTop = '16px';
            }


            if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
                instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');


            }
            //CSP Add for Slider
            if (instance.data.sliderEnabled) {;
            }
        })
    } else {
        instance.data.APS.forEach((aps) => {
            const uniqueId = aps._id;
            instance.canvas.find('#' + uniqueId + '.quillEditor').slideUp('fast', 'swing');
            let element = instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']')[0]?.parentElement.nextSibling;
            instance.data.logging ? console.log(`element expander`, element):null;

            if (element?.style) {
                element.style.paddingTop = '0px';
            }

            if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_less') {
                instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');

            }

        })
    }


}