function(instance, properties, context) {
    //When a new card is dropped, it has to become part of the hierarchy object 
    //1. Pass that Attribute Plan Snippet to the Plugin 
    //2. Render its html
    //3. Append that to the bottom of the list
    //4. Call hierarchy function

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
    //console.log(`BeforeSend-(DAS, TOAS, instance.data.DASnew, instance.data.TOASnew, DASV, TOASV, APS, instance.data.APSnew)`, DAS, TOAS, instance.data.DASnew, instance.data.TOASnew, DASV, TOASV, APS, instance.data.APSnew);
    instance.data.addDASTOAS(DAS, TOAS, instance.data.DASnew, instance.data.TOASnew, DASV, TOASV, APS, instance.data.APSnew);

    console.log('Add New List Item Ran', instance.data.plan_unique_id);
    //Call generatelist item on newly dropped card
    let newlyDroppedCardHtml = instance.data.generateListItemHtml(instance.data.APSnew[0]);
    console.log("newlyDroppedCardHtml", newlyDroppedCardHtml);
    //Append that to the innerhtml of the ol.sortable list
    let cardStackInnerHtml = $('ol.sortable#' + instance.data.plan_unique_id);
    //Append the new li item to the existing cardstack
    cardStackInnerHtml.prepend(newlyDroppedCardHtml);
    console.log("prepended");
    instance.data.addSlider(instance.data.APSnew);
    instance.data.APS = instance.data.APSnew.concat(instance.data.APS);
    instance.data.cardstack = cardStackInnerHtml;
    instance.data.addQuillEditor(instance.data.cardstack.find(".quillEditor")[0]);
    window.CS = instance;
    //Call hierarchy
    setTimeout(instance.data.hierarchy, 100);
    setTimeout(instance.data.deleteFoldCollapse, 200);
}
    