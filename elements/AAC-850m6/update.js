function(instance, properties, context) {
    //CSP add for data purposes
    const keyListDataSource = properties.data_source.get(0, properties.data_source.length())[0];
    console.log("DS",keyListDataSource.listProperties());
    
    if (properties.logging) {
    let dSList = properties.data_source.get(0, properties.data_source.length());
    let DAS = properties.das.get(0, properties.das.length());
    let TOAS = properties.toas.get(0, properties.toas.length());
    let DASV = properties.drawn_attribute_snippets_volume.get(0, properties.drawn_attribute_snippets_volume.length());
    let TOASV = properties.text_only_attribute_snippets_volume.get(0, properties.text_only_attribute_snippets_volume.length());
        
    console.log("properties.data_source",properties.data_source, dSList, JSON.stringify(dSList), "stringifyied",JSON.stringify(properties.data_source),"properties.type_of_items",properties.type_of_items_type.listProperties(),
     "properties.plan_unique_id: String",properties.plan_unique_id, "properties.html_field: String", properties.html_field,"properties.type_of_items_type: Object",properties.type_of_items_type,"stringified",JSON.stringify(properties.type_of_items_type),"DAS",DAS,DASV,"TOAS",TOAS,TOASV);
}
    //end CSP add
   
//To create the html of a single card from data source. Keeping the loop outside the function so that this can be used for new added cards also.
function generateListItemHtml(attributeplansnippet) {
    let newListElement = '<li style="display: list-item;" class="mjs-nestedSortable-leaf" id="' + attributeplansnippet.get("_id") +
        '" data-foo="bar"><div class = "parentContainer highlightable highlight-' + attributeplansnippet.get("attribute_id_text") +
        '" id="' + attributeplansnippet.get("attribute_id_text") +
        '"><div class = "dragContainer"><span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer"><div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide description" data-id="' +
        attributeplansnippet.get("_id") + '" class = "expandEditor material-icons" >expand_more</span><input  type="text" class = "itemTitle" data-id="' +
        attributeplansnippet.get("_id") + '"value="' + attributeplansnippet.get("attribute_name_text") +
        '"><span class="deleteMenu material-icons" title="Click to delete item." data-id="' + attributeplansnippet.get("_id") +
        '">close</span></div><div class = "quillContainer" id="' + attributeplansnippet.get("_id") + '"><div class="quillEditor" id="' +
        attributeplansnippet.get("_id") + '"></div></div></div></div></li>';

    return newListElement;

}


function addQuillEditor(editor) {
    const quill = new Quill(editor, {
        modules: {
            toolbar: [
                [{ font: [] }, { size: [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'super' }, { script: 'sub' }],
                [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'video'],
                ['clean']
            ]
        },
        theme: 'snow',
        debug: 'warn',
        bounds: editor
    });

    const toolbar = quill.root.parentElement.previousSibling;
    toolbar.setAttribute('hidden', true);
    quill.root.parentElement.style.borderTop = `1px`;

    quill.root.addEventListener('focus', e => {
        instance.data.focused = true
        toolbar.removeAttribute('hidden', false)
    })

    quill.root.addEventListener('blur', e => {
        instance.data.focused = false;
        const tooltip = e.find('.ql-tooltip');
        const tooltipStyle = window.getComputedStyle(tooltip);
        if (!toolbar.contains(e.relatedTarget) && tooltipStyle.display === 'none') {
            toolbar.setAttribute('hidden', true);
            const toolbars = document.querySelectorAll('.toolbar');
            toolbars.forEach(toolbar => {
                toolbar.setAttribute('hidden', true);
            });
        }
    });

    quill.on('editor-change', (eventName, ...args) => {
        if (eventName === 'text-change') {
            instance.data.handleStopTyping(editor.id);
        } else if (eventName === 'selection-change') {
            // Handle selection change
        }
    });
};


instance.data.handleStopTyping = (id) => {
    // Clear the timeout and set a new one to handle the typing change
    clearTimeout(instance.data.typingTimeout);
    instance.data.typingTimeout = setTimeout(() => instance.data.handleTypingChange(id), 250);
};

instance.data.handleTypingChange = (id) => {
    // When the typing has stopped, trigger the "stopped_typing" event and update the Quill contents
    instance.triggerEvent('stopped_typing');
    instance.data.typingTimeout = null;

    // Expose html of edtitor as state
    instance.publishState('editedcard_id', id);
    instance.publishState('htmlobject', instance.canvas.html());
    instance.publishState('html', $("#" + editedcard_id).find(".quilleditor").innerhtml());
    instance.triggerEvent('relocated');
};



function callNestedSortable() {
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
        startCollapsed: true,
        change: function () {
            //console.log('Relocated item')
        },
        relocate: function () {
            //console.log('relocate');
            setTimeout(function () {
                instance.publishState("htmlobject", instance.canvas.html());
                instance.triggerEvent("relocated");
            }, 10);
        }
    });
}


function deleteFoldCollapse() {
    $('.disclose').on('click', function () {
        $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
        $(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
    });


    $('.deleteMenu').unbind();
    $('.deleteMenu').click(function () {
        let uniqueId = $(this).attr('data-id');
        if ($('#' + uniqueId).length == 0) { return; }
        if (window.confirm("Are you sure you want to delete this card ?")) {
            let childCardsIdList = $('#' + uniqueId).find('li');
            let idArray = [];
            childCardsIdList.each(function (index) {
                idArray.push($(this).attr('id'));
            });
            instance.publishState("htmlobject", instance.canvas.html());
            $('#' + uniqueId).remove();
            setTimeout(function () {
                instance.publishState("htmlobject", instance.canvas.html());
                instance.triggerEvent("relocated");
            }, 10);
            setTimeout(function () {
                instance.publishState("deletedcard_id", uniqueId);

                instance.publishState("deletedchildren_id_list", idArray.toString());
                instance.triggerEvent("deleted");
            }, 10);
        }
    });


    $('.expandEditor').click(function () {
        var uniqueId = $(this).attr('data-id');
        $('#' + uniqueId + '.quillEditor').toggle('fast', 'swing');
        if ($('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
            $('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');
        } else {
            $('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');
        }
    });
}

function hierarchy() {

    var hierarchyContent = $('ol.sortable').nestedSortable('toHierarchy', { startDepthCount: 0 });

    //save hierarchyContent object to the Plan
}

function buildHierarchyHtml(hierarchy) {
    var result = '';

    for (var i = 0; i < hierarchy.length; i++) {
        var node = hierarchy[i];
        var children = node.children;

        result += '<li>' + node.title;

        if (children && children.length > 0) {
            result += buildNestedList(children);
        }

        result += '</li>';
    }
    return result;

    let resultComplete = `<ol id="` + planId + `" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">` + result + "</ol>";

    instance.canvas.html(resultComplete);
}


//We create the html from the attribute plan snippets only in the first render, for all subsequent renders, we use the hierarchy object (hierarchyContent)

// Looping through all the attribute plan snippets and creating their markup the first time when its loaded when theres no hierarchy data
if (hierarchyContent = null) {
    let cardsList;
    allAttPlanSnippets.foreach((item) => {
        cardslist += generatelistitemhtml(item);
    });
    return cardsList;

    let cardsListComplete = `<ol id="` + planId + `" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">` + cardsList + "</ol>";

    instance.canvas.html(cardsListComplete)
    //***NOTE*** - Check instance stuff above

} else if (instance.data.plan_hierarchyContent) {
    buildHierarchyHtml(instance.data.plan_hierarchyContent)

    //***NOTE*** - clarify with colin arguments passing while declaring function and calling it  
}


//After generating the html, we call Nested Sortable and Quill on it
callNestedSortable();

//$(".ql-toolbar").remove() ***NOTE*** - Check if needed or not
document.querySelectorAll(".quillEditor").forEach(editor => {
    addQuillEditor(editor);
});

//Call toHierarchy function to update the hierarchy object
hierarchy();


}