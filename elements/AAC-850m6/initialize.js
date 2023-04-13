function(instance, context) {
  instance.data.listcount = 0;
  instance.data.halted = false;
  instance.data.data_source_length = 0;
  instance.data.hierarchycontent = "null";
  instance.data.removeFocusEventListenerFunctions = [];

  instance.data.handleTypingChange = (id) => {
    // When the typing has stopped, trigger the "stopped_typing" event and update the Quill contents
    instance.triggerEvent('stopped_typing');
    instance.data.typingTimeout = null;
    var htc = $("#" + id).find(".quillEditor").html();
    console.log('htc', id, htc);
    // Expose Delta as state
    //instance.publishState('delta', content);
    instance.publishState('editedcard_id', id);
    //instance.publishState('htmlobject', instance.canvas.html());
    instance.publishState('quill_editor_content', htc);
    instance.triggerEvent('relocated');
  };

  instance.data.handleStopTyping = (id) => {
    // Clear the timeout and set a new one to handle the typing change
    clearTimeout(instance.data.typingTimeout);
      console.log('hst', id);
    instance.data.typingTimeout = setTimeout(() => instance.data.handleTypingChange(id), 250);
    console.log('HandleTypingChange');
  };

  $(".quillEditor").bind('DOMSubtreeModified', function () {
    console.log('changed');
  });
}