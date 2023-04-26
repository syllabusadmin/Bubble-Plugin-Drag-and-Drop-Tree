function(instance, properties, context) {


  //Load any data 

        var element = instance.canvas.find(`.highlightable.highlight-${properties.element}`);
        if (element.length) {
            element.get(0).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        }
  //Do the operation



}