function(instance, properties, context) {
let replace = properties.removeid;

// Load any data

let cardStackInnerHtml = $('ol.sortable#' + instance.data.plan_unique_id);
const replaceElement = replace ? cardStackInnerHtml.find('#' + replace + '.fromList') : null;

if (replaceElement) {
  // Remove the replaceElement if it's found
  replaceElement.remove();
}

  //Do the operation

}