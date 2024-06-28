function(instance, properties, context) {
let id = properties.aps_id;
let timeoutboost = properties.timeoutboost;

try {
  setTimeout(function() {
    let quillContainer = $('.quillContainer' + "#" + id);
    if (quillContainer.find('.ql-toolbar').length === 0) {
      let newCardEditor = quillContainer.children()[0];
      instance.data.addQuillEditor(newCardEditor);
      console.log('newCardEditor success');
    } else {
      console.log('A child container with class "ql-toolbar" already exists.');
    }
  }, 200 + timeoutboost);
} catch (error) {
  // Handle the error or simply ignore it
  console.error('newCardEditor error:', error);
}

}