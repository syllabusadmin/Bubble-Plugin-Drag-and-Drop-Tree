function(instance, properties, context) {

    //initialize variables
    let timeoutboost = properties.timeoutboost;
    let DAS = properties.das.get(0, properties.das.length());
    let TOAS = properties.toas.get(0, properties.toas.length());
    //console.log("DAS,TOAS", DAS, TOAS);
    let DASV = properties.drawn_attribute_snippets_volume.get(0, properties.drawn_attribute_snippets_volume.length());
    let TOASV = properties.text_only_attribute_snippets_volume.get(0, properties.text_only_attribute_snippets_volume
        .length());
    let APS = properties.aps.get(0, properties.aps.length());
    let replace = properties.replace;

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
    /*/old
    let cardStackInnerHtml = $('ol.sortable#' + instance.data.plan_unique_id);
    //Append the new li item to the existing cardstack
    cardStackInnerHtml.prepend(newlyDroppedCardHtml);
    console.log("prepended");
    */
    ///new
let cardStackInnerHtml = $('ol.sortable#' + instance.data.plan_unique_id);
const replaceElement = replace ? cardStackInnerHtml.find('#' + replace + '.fromList') : null;


if (replaceElement) {
  const replaceParentOl = replaceElement;
  
  if (replaceParentOl.length > 0) {
    // Replace the whole object with 'newlyDroppedCardHtml'
    replaceParentOl.replaceWith(newlyDroppedCardHtml);
    console.log("Replaced with newlyDroppedCardHtml");
  }
} else {
  // Check the 'prepend' property and either prepend or append accordingly
  if (properties.prepend) {
    cardStackInnerHtml.prepend(newlyDroppedCardHtml);
    console.log("Prepended");
  } else {
    cardStackInnerHtml.append(newlyDroppedCardHtml);
    console.log("Appended");
  }
}
///
    instance.data.sliderEnabled ? instance.data.addSlider(instance.data.APSnew):null;
    instance.data.APS = instance.data.APSnew.concat(instance.data.APS);
    instance.data.cardstack = cardStackInnerHtml;
try {
    setTimeout(function() {
    let newCardEditor = $('.quillContainer' + "#" + instance.data.APSnew[0]._id).children()[0];
        instance.data.addQuillEditor(newCardEditor);
    }, 200 + timeoutboost);
} catch (error) {
    // Handle the error or simply ignore it
    console.error('newCardEditor error:', error);
}

    window.CS = instance;
    //Call hierarchy
    setTimeout(instance.data.hierarchy, 100);
    setTimeout(instance.data.deleteFoldCollapse, 200);   
    setTimeout(instance.data.ellipsis(),100); 
    instance.publishState('ready', true);

}