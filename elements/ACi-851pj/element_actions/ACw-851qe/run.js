function(instance, properties, context) {

    var mychild2 = instance.canvas.find(`.highlightable.highlight-${properties.element}`).parent()[0];
    if (mychild2) {
        var parent2 = mychild2.parentElement;
        instance.data.logging ? console.log('Scrollto mychild2,parent2', mychild2, parent2) : null;
        while (parent2) {
            if (parent2.classList.contains('bubble-element') &&
                parent2.classList.contains('Group') &&
                parent2.classList.contains('bubble-r-container') &&
                parent2.classList.contains('relative') &&
                parent2.scrollHeight > parent2.clientHeight) {
                break;
            }
            if (parent2.parentElement) {
                parent2 = parent2.parentElement;
            }
        }

        var distanceFromParentTop = mychild2.parentElement.offsetTop + properties.pad;
        var distanceFromParentBottom = distanceFromParentTop + mychild2.parentElement.clientHeight;
        var parentTop = parent2.scrollTop;
        var parentBottom = parent2.scrollTop + parent2.clientHeight;

        instance.data.logging ? console.log('Scrollto distanceFromParentBottom,distanceFromParentTop,parentTop,parentBottom', distanceFromParentBottom, distanceFromParentTop, parentTop, parentBottom) : null;
        if (parent2) {
            if (distanceFromParentTop < parentTop || distanceFromParentBottom > parentBottom) {
                var scrollToPosition = distanceFromParentTop - (parent2.clientHeight / 2);

                setTimeout(() => {
                    parent2.scrollTo({
                        top: scrollToPosition,
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 100);


            }
        }
    }

}