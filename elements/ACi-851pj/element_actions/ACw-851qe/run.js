function(instance, properties, context) {


var mychild2 = document.querySelector(`.highlightable.highlight-${properties.element}`).parentElement;

var parent2 = mychild2.parentElement;
while (parent2) {//console.log(parent2.scrollHeight,parent2.clientHeight);
  if (parent2.classList.contains('bubble-element') &&
      parent2.classList.contains('Group') &&
      parent2.classList.contains('bubble-r-container') &&
      parent2.classList.contains('relative') &&
      parent2.scrollHeight > parent2.clientHeight) {
    break;
  }
  if (parent2.parentElement) {parent2 = parent2.parentElement;}
}
var distanceFromParentTop = mychild2.offsetTop + properties.pad;
instance.data.logging ? console.log('mychild',mychild2,'parent2',parent2,distanceFromParentTop ):null;

if (parent2) {parent2.scrollBy({
  top: distanceFromParentTop , // scroll 100 pixels down
  left: 0, // do not scroll horizontally
  behavior: 'smooth'
});
}


}