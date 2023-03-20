function(instance, properties, context) {

          
	if(properties.expand){
        $('.quillEditor:hidden').toggle('fast', 'swing');
        $('.expandEditor').html("expand_less");
    }else{
        $('.quillEditor:visible').toggle('fast', 'swing');
        $('.expandEditor').html("expand_more");
    }



}