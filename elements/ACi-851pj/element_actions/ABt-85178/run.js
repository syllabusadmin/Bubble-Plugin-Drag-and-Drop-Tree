function(instance, properties, context) {

    //initialize variables
    let DAS = properties.das.get(0, properties.das.length());
    let TOAS = properties.toas.get(0, properties.toas.length());
    //console.log("DAS,TOAS", DAS, TOAS);
    let DASV = properties.drawn_attribute_snippets_volume.get(0, properties.drawn_attribute_snippets_volume.length());
    let TOASV = properties.text_only_attribute_snippets_volume.get(0, properties.text_only_attribute_snippets_volume
        .length());
    let APS = properties.aps.get(0, properties.aps.length());

    ///add new arrays and processs
    instance.data.DASnew = [];
    instance.data.TOASnew = [];
    instance.data.APSnew = [];
    console.log(`BeforeSend-(DAS, TOAS, instance.data.DASnew, instance.data.TOASnew, DASV, TOASV, APS, instance.data.APSnew)`, DAS, TOAS, instance.data.DASnew, instance.data.TOASnew, DASV, TOASV, APS, instance.data.APSnew);
    instance.data.addDASTOAS(DAS, TOAS, instance.data.DASnew, instance.data.TOASnew, DASV, TOASV, APS, instance.data.APSnew);

    console.log('Add New List Item Ran', instance.data.plan_unique_id);
    //Call generatelist item on newly dropped card
    let newlyDroppedCardHtml = instance.data.generateListItemHtml(instance.data.APSnew[0]) + "</li>";
    console.log("newlyDroppedCardHtml", newlyDroppedCardHtml);
    //Append that to the innerhtml of the ol.sortable list
    let cardStackInnerHtml = $('ol.sortable#' + instance.data.plan_unique_id);
    //Append the new li item to the existing cardstack
    cardStackInnerHtml.prepend(newlyDroppedCardHtml);
    console.log("prepended");
    instance.data.sliderEnabled ? instance.data.addSlider(instance.data.APSnew):null;
    instance.data.APS = instance.data.APSnew.concat(instance.data.APS);
    instance.data.cardstack = cardStackInnerHtml;
    let newCardEditor = $('.quillContainer' + "#" + instance.data.APSnew[0]._id).get(0,1).childNodes[0];
    setTimeout(instance.data.addQuillEditor(newCardEditor),200);
    window.CS = instance;
    //Call hierarchy
    setTimeout(instance.data.hierarchy, 100);
    setTimeout(instance.data.deleteFoldCollapse, 200);   
    setTimeout(instance.data.ellipsis(),100); 
}