function(instance, properties, context) {

//When a new card is dropped, it has to become part of the hierarchy object 
//1. Pass that Attribute Plan Snippet to the Plugin 
//2. Render its html
//3. Append that to the bottom of the list
//4. Call hierarchy function
    
    console.log('Add New List Item Ran');
//Declare all the functions again
            
    function generateListItemHtml(attributeplansnippet) {
    console.log('ANLI GenerateListItem Declared');
    let cardItemHtml = '<li id="menuItem_' + attributeplansnippet.get("_id") + '" style="display: list-item;" class="mjs-nestedSortable-leaf" data-foo="bar"><div class = "parentContainer highlightable highlight-' + attributeplansnippet.get("attribute_id_text") + '" id="' + attributeplansnippet.get("attribute_id_text") + '"><div class = "dragContainer"><span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer"><div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide description" data-id="' + attributeplansnippet.get("_id") + '" class = "expandEditor material-icons" >expand_more</span><input  type="text" class = "itemTitle" data-id="' + attributeplansnippet.get("_id") + '"value="' + attributeplansnippet.get("attribute_name_text") + '"><span class="deleteMenu material-icons" title="Click to delete item." data-id="' + attributeplansnippet.get("_id") + '">close</span></div><div class = "quillContainer" id="' + attributeplansnippet.get("_id") + '"><div class="quillEditor" id="' + attributeplansnippet.get("_id") + '">' + attributeplansnippet.get("quill_description_text") + '</div></div></div></div>';
    //console.log("Quill Description Text" + attributeplansnippet.get("description_text"));
	//console.log(cardItemHtml);
    return cardItemHtml;
	}
            
function callNestedSortable() {
    console.log('ANLI NestedSortable Declared');
    instance.data.ns = $('ol.sortable#' + properties.plan_unique_id).nestedSortable({
        forcePlaceholderSize: true,
        handle: '.dragHandle',
        helper: 'clone',
        items: 'li',
        opacity: .6,
        placeholder: 'placeholder',
        revert: 250,
        tabSize: 25,
        tolerance: 'pointer',
        toleranceElement: '> div',
        maxLevels: 4,
        isTree: true,
        expandOnHover: 700,
        startCollapsed: false,
        change: function () {
            //console.log('Relocated item')
        },
        relocate: function () {
            //console.log('relocate');
                //instance.publishState("htmlobject", instance.canvas.html());
                //instance.triggerEvent("relocated");
                //hierarchy();
                   }
    });
}
    
    
   function hierarchy() {
    console.log('ANLI toHierarchy Declared');        
	let hierarchyContent = $('ol.sortable#' + properties.plan_unique_id).nestedSortable('toHierarchy', { startDepthCount: 0 });
	if(!hierarchyContent.prevObject){ 
        setTimeout(function () {
        instance.publishState("hierarchycontent", JSON.stringify(hierarchyContent));
        instance.triggerEvent("relocated");
        }, 100);
	  }
   }            
            
            
            

//Call generatelist item on newly dropped card

	let newlyDroppedCardHtml = generateListItemHtml(properties.attribute_plan_snippet);
    
//Append that to the innerhtml of the ol.sortable list
   
    let cardStackInnerHtml = $('ol.sortable#' + properties.plan_unique_id);
            
//Append the new li item to the existing cardstack
    cardStackInnerHtml.prepend(newlyDroppedCardHtml);
       
//Call hierarchy
    hierarchy();
                    
}