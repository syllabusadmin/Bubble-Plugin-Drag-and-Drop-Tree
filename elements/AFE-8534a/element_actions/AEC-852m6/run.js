function(instance, properties, context) {

let enabled = properties.enabled;
let uid = properties.unique;
  //Load any data 

function toggleSortReceiveHandler(enable) {
  if (enable) {
    $('.sortable').on('sortreceive', sortReceiveHandler);
  } else {
    $('.sortable').off('sortreceive', sortReceiveHandler);
  }
}

function sortReceiveHandler(event, ui) {
  if (ui.item.hasClass('fromList')) {
    var itemId = ui.item.attr('id');
    const labelElements = document.querySelectorAll("#draggedElement");
    labelElements.forEach((labelElement) => {
      labelElement.remove();
    });
if (typeof window["bubble_fn_createCard" + uid] === "function") {
  window["bubble_fn_createCard" + uid](itemId);
} else {
  console.error("Function not found: bubble_fn_createCard" + uid);
}
  }
}
// Enable the event handler
toggleSortReceiveHandler(enabled);

  //Do the operation



}