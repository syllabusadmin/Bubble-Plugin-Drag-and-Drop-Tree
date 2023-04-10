function(instance, properties, context) {

    console.log('Add New List Item Ran', instance.data.plan_unique_id);
    //Declare all the functions again

    function generateListItemHtml(attributeplansnippet) {
        console.log('ANLI GenerateListItem Declared');
        let quilltext = "";
        if (attributeplansnippet.get("quill_description_text")) { quilltext = attributeplansnippet.get("quill_description_text") }
        let cardItemHtml = '<li id="menuItem_' + attributeplansnippet.get("_id") +
                '" style="display: list-item;" class="mjs-nestedSortable-leaf" data-foo="bar"><div class = "parentContainer highlightable highlight-' +        attributeplansnippet.get("attribute_id_text") + '" id="' + attributeplansnippet.get("attribute_id_text") + '"><div class = "dragContainer"><span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer"><div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide description" data-id="' + attributeplansnippet.get("_id") + '" class = "expandEditor material-icons" >expand_more</span><textarea class = "itemTitle" rows = "3" data-id="' + attributeplansnippet.get("_id") + '">' + attributeplansnippet.get("attribute_name_text") + '</textarea><span class="deleteMenu material-icons" title="Click to delete item." data-id="' + attributeplansnippet.get("_id") + '">close</span></div><div class = "quillContainer" id="' + attributeplansnippet.get("_id") + '"><div class="quillEditor" id="' + attributeplansnippet.get("_id") + '">' + quilltext + '</div></div></div></div>';
        //console.log("Quill Description Text" + attributeplansnippet.get("description_text"));
        //console.log(cardItemHtml);
        return cardItemHtml;
    }

    function callNestedSortable() {
        console.log('ANLI NestedSortable Declared');
        instance.data.ns = $('ol.sortable#' + instance.data.plan_unique_id).nestedSortable({
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
                console.log('Relocated item')
            },
            relocate: function () {
                setTimeout(hierarchy, 100);
            }
        });
    }

    function addQuillEditor(editor) {
        console.log('AddQuillEditor Declared');
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


    function hierarchy() {
        console.log('ANLI toHierarchy Declared', $('ol.sortable#' + instance.data.plan_unique_id));
        let hierarchyContent = $('ol.sortable#' + instance.data.plan_unique_id).nestedSortable('toHierarchy', { startDepthCount: 0 });
        setTimeout(function () {
            instance.publishState("hierarchycontent", JSON.stringify(hierarchyContent));
            console.log(hierarchyContent);
            instance.triggerEvent("relocated");
        }, 100);

    }


    //Call generatelist item on newly dropped card

    let newlyDroppedCardHtml = generateListItemHtml(properties.attribute_plan_snippet) + "</li>";
    console.log("newlyDroppedCardHtml", newlyDroppedCardHtml);
    //Append that to the innerhtml of the ol.sortable list

    let cardStackInnerHtml = instance.canvas.find("ol.sortable");

    //Append the new li item to the existing cardstack
    cardStackInnerHtml.prepend(newlyDroppedCardHtml);
    console.log("prepended");
    console.log(properties.data_source);
    let id = properties.attribute_plan_snippet.get("_id")
    let newEditor = $(`#${id} .quillEditor`)[0];
    addQuillEditor(newEditor);
    //Call hierarchy
    
    let newCardTextArea = $(`textarea.itemTitle[data-id="${id}"]`);
    console.log(newCardTextArea);
    let cardTitle = properties.attribute_plan_snippet.get("attribute_name_text");
    console.log(cardTitle);
            
    newCardTextArea.on("focus", () => {
        console.log('Focus - Value set from db');
       newCardTextArea.value = properties.attribute_plan_snippet.get("attribute_name_text");  
    });
    newCardTextArea.on("blur", () => {
       if (cardTitle.length > 150){
           console.log(' Blur - Trimmed Value');
            newCardTextArea.value = properties.attribute_plan_snippet.get("attribute_name_text").slice(0,150) + "....";
        }
       else {
           console.log('Blur - Untrimmed Value');
             newCardTextArea.value = properties.attribute_plan_snippet.get("attribute_name_text");  
        }
    });
	setTimeout(hierarchy, 100);
}