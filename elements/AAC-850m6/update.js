function(instance, properties, context) {
    console.log(properties.data_source);
    instance.data.disabled = properties.disabled;
    //start update
    //triggers selection of snippet
    if (!instance.data.halted) {
        //CSP Add for actions
        instance.data.plan_unique_id = properties.plan_unique_id;
        //CSP end
        const keyListDataSource = properties.data_source.get(0, properties.data_source.length())[0];
        console.log("DS", keyListDataSource.listProperties());

        function callNestedSortable() {
            console.log('NestedSortable Declared');
            //CSP Add
            //super dumb but seems to require it to be added first
            $('ol.sortable#' + instance.data.plan_unique_id).nestedSortable();
            //CSP End
            instance.data.ns = $('ol.sortable#' + properties.plan_unique_id).nestedSortable({
                disabled: instance.data.disabled,
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
                    setTimeout(hierarchy, 100);
                }
            });
        }

        function hierarchy() {
            console.log('toHierarchy Declared');
            //CSP Add
            //super dumb but seems to require it to be added first
            callNestedSortable()
            //CSP End
            let hierarchyContent = instance.canvas.find('ol.sortable').nestedSortable('toHierarchy', {
                startDepthCount: 0
            });
            setTimeout(function () {
                instance.publishState("hierarchycontent", JSON.stringify(hierarchyContent));
                instance.triggerEvent("relocated");
            }, 100);
            //save hierarchyContent object to the Plan
        }
        instance.data.saveCardFetch = (card) => {
            let ver = "";
            if (properties.bubbleversion) {
                ver = properties.bubbleversion + "/"
            }
            let url = 'https://app.syllabus.io/version-' + ver + 'api/1.1/obj/attributeplansnippet/' + card.id;
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 0bffa103a989ac77a1c75b4e0d6f7e40");
            var formdata = new FormData();
            formdata.append("Quill Description", card.content);
            var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };
            fetch(url, requestOptions).then(response => response.text()).then(result => console.log(result)).catch(
                error => console.log('error', error));
        }
        instance.data.savecard = (card, index) => {
            instance.data.saveCardFetch(card);
            /*
            instance.publishState('editedcard_id', card.id);
            //instance.publishState('htmlobject', instance.canvas.html());
            instance.publishState('quill_editor_content', card.content);
            setTimeout(()=>{instance.triggerEvent('stopped_typing')},100*index);
            */
        }
        instance.data.saveAllCards = (editors_array) => {
            for (let i = 0; i < editors_array.length; i++) {
                instance.data.savecard(editors_array[i], i);
            }
        }
        if (properties.html_field && !properties.hierarchycontent) {
            instance.data.halted = true
            console.log('Checking for JQuery Html');
            instance.canvas.html(properties.html_field);
            instance.data.editor_contents = new Array();
            instance.data.allcards = instance.canvas.find('ol.sortable li')
            for (let i = 0; i < instance.data.allcards.length; i++) {
                if (instance.data.allcards[i].id) {
                    instance.data.editor_contents.push({
                        id: instance.data.allcards[i].id.includes("menuItem_") ? instance.data.allcards[i].id.split("_")[1] : instance.data.allcards[i].id,
                        content: $("#" + instance.data.allcards[i].id).find(".ql-editor").html()
                    })
                    if (!instance.data.allcards[i].id.includes("menuItem_")) {
                        instance.data.allcards[i].id = "menuItem_" + instance.data.allcards[i].id;
                    }
                }
            }
            setTimeout(hierarchy, 100);
            instance.data.halted = false;
            return;
        }
        if (properties.data_source.length() == instance.data.data_source_length && properties.hierarchycontent ==
            instance.data.hierarchycontent && instance.canvas.innerHtml != "" && properties.hierarchycontent != "") {
            return;
        }
        instance.data.data_source_length = properties.data_source.length();
        instance.data.hierarchycontent = properties.hierarchycontent;
        instance.data.attplansnippets = properties.data_source.get(0, properties.data_source.length());
        //To create the html of a single card from data source. Keeping the loop outside the function so that this can be used for new added cards also.
        //Add </li> in the end for add new card
function generateListItemHtml(attributeplansnippet) {
    console.log('ANLI GenerateListItem Declared');
    let quilltext = "";
    if (attributeplansnippet.get("quill_description_text")) {
        quilltext = attributeplansnippet.get("quill_description_text")
    }
    var deleteDisabled = '<span class="deleteMenu material-icons" title="Click to delete item." data-id="' +
        attributeplansnippet.get("_id") + '">close</span>';
    var inputDisabled = '';
    if (instance.data.disabled) {
        deleteDisabled = '';
        inputDisabled = ' disabled';
    }
    let cardItemHtml = '<li id="menuItem_' + attributeplansnippet.get("_id") +
        '" style="display: list-item;" class="mjs-nestedSortable-leaf" data-foo="bar"><div class = "parentContainer highlightable highlight-' +
        attributeplansnippet.get("attribute_id_text") + '" id="' + attributeplansnippet.get("attribute_id_text") +
        '"><div class = "dragContainer"><span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer"><div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide description" data-id="' +
        attributeplansnippet.get("_id") + '" class = "expandEditor material-icons" >expand_more</span>' +
        '<textarea class = "itemTitle" rows = "3" data-id="' + attributeplansnippet.get("_id") + `" ${inputDisabled}>` +
        attributeplansnippet.get("attribute_name_text") + `</textarea> ${deleteDisabled}` +
        '</div><div class = "quillContainer" id="' + attributeplansnippet.get("_id") +
        '"><div class="quillEditor" id="' + attributeplansnippet.get("_id") + '">' + quilltext +
        '</div></div></div></div>';
    //console.log("Quill Description Text" + attributeplansnippet.get("description_text"));
    //console.log(cardItemHtml);
    return cardItemHtml;
}
        function addQuillEditor(editor) {
    console.log('AddQuillEditor Declared');

    const formattingOptions = {
        Standalone: [],
        Inline: [
          'background',
          'bold',
          'color',
          'font',
          'code',
          'italic',
          'link',
          'size',
          'strike',
          'script',
          'underline'
        ],
        Block: [
          'blockquote',
          'header',
          'indent',
          'list',
          'align',
          'direction',
          'code-block'
        ],
        Embeds: [
          'formula', // requires KaTex
          //'image',
          'video',
          'embedResponsive' // our custom iframe embed
        ]
      };
      
      const formats = [].concat(
        formattingOptions.Standalone,
        formattingOptions.Inline,
        formattingOptions.Block,
        formattingOptions.Embeds
      );   
    const quill = new Quill(editor, {
        modules: {
            toolbar: [
                [{
                    font: []
                }, {
                    size: []
                }],
                ['bold', 'italic', 'underline', 'strike'],
                [{
                    color: []
                }, {
                    background: []
                }],
                [{
                    script: 'super'
                }, {
                    script: 'sub'
                }],
                [{
                    header: '1'
                }, {
                    header: '2'
                }, 'blockquote', 'code-block'],
                [{
                    list: 'ordered'
                }, {
                    list: 'bullet'
                }, {
                    indent: '-1'
                }, {
                    indent: '+1'
                }],
                ['link', 'video'],
                ['clean']
            ]
        },
        theme: 'snow',
        debug: 'warn',
        formats: formats,
        bounds: editor
    });
    const toolbar = quill.root.parentElement.previousSibling;
    toolbar.setAttribute('hidden', true);
    quill.root.parentElement.style.borderTop = `1px`;

    if (instance.data.disabled) {

        quill.disable();
        var toolbar1 = quill.getModule('toolbar');
        toolbar1.container.style.display = 'none';
    } else {
        quill.enable();
        var toolbar2 = quill.getModule('toolbar');
        toolbar2.container.style.display = 'block';
    }

    quill.root.addEventListener('focus', (e) => {
        instance.data.focused = true
        toolbar.removeAttribute('hidden', false)
    })
    const handleClick = (e) => {
        console.log(`editor`, editor.parentElement.id)
        if (!e.target.closest(`[id="${editor.parentElement.id}"]`)) {
            console.log(`hiding toolbar: the target is`, e.target, `and the toolbar is`, toolbar,
                `and the preview is`, e.target.classList.contains('ql-preview'))
            toolbar.setAttribute('hidden', true)
        }
    }
    window.addEventListener('click', handleClick)
    quill.root.addEventListener('blur', (e) => {
        // instance.data.focused = false
        // if (e.relatedTarget == null) {
        //     toolbar.setAttribute('hidden', true)
        // }
        // else if (!toolbar.contains(e.relatedTarget) && !e.relatedTarget.classList.contains('ql-preview')) {
        //     toolbar.setAttribute('hidden', true)
        // }
    });
    /* quill.root.addEventListener('blur', e => {
          console.log('blur');   
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
     }); */
    quill.on('editor-change', (eventName, ...args) => {
        if (eventName === 'text-change' && !instance.data.disabled) {
            instance.data.handleStopTyping(editor.id);
        } else if (eventName === 'selection-change') {
            // Handle selection change
        }
    });
    const removeEventListener = window[`removeEventListener_${editor.parentElement.id}`] = () => {
        window.removeEventListener('click', handleClick);
    }
    return {
        removeEventListener
    };
}
        function deleteFoldCollapse() {
            $('.disclose').on('click', function () {
                $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass(
                    'mjs-nestedSortable-expanded');
                $(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
            });
            //$('.deleteMenu').unbind();
            if (!instance.data.disabled) {
            $('.deleteMenu').click(function () {
                let uniqueId = $(this).attr('data-id');
                let card_id = "#menuItem_" + uniqueId;
                if ($(card_id).length == 0) {
                    return;
                }
                if (window.confirm("Are you sure you want to delete this card ?")) {
                    let childCardsIdList = $(card_id).find('li');
                    let idArray = [];
                    childCardsIdList.each(function (index) {
                        idArray.push($(this).attr('id'));
                    });
                    $(card_id).remove();
                    setTimeout(function () {
                        instance.publishState("htmlobject", instance.canvas.html());
                        hierarchy();
                    }, 10);
                    setTimeout(function () {
                        instance.publishState("deletedcard_id", uniqueId);
                        instance.publishState("deletedchildren_id_list", idArray.toString());
                        instance.triggerEvent("deleted");
                    }, 10);
                }
            });
            }
            $('.expandEditor').click(function () {
                let uniqueId = $(this).attr('data-id');
                $('#' + uniqueId + '.quillEditor').toggle('fast', 'swing');
                if ($('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
                    $('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');
                } else {
                    $('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');
                }
            });
            
            $(".itemTitle").on("input", function () {                
                let editedCardId = $(this).attr('data-id');
                console.log('Input fired ' + editedCardId);
                instance.publishState("changedname", $(this).val());
                instance.publishState("editedcard_id", editedCardId);
                instance.triggerEvent("namechange");
            });
            
        }

        function buildHierarchyHtml(hierarchy) {
            console.log(hierarchy)
            hierarchy = JSON.parse(hierarchy);
            console.log('buildHierarchyHtml Declared');
            let cardListHtml = '';
            for (let i = 0; i < hierarchy.length; i++) {
                let hierarchyItem = hierarchy[i];
                let hierarchyItemId = hierarchyItem.id;
                console.log('hierarchyitem and id' + hierarchy[i] + hierarchyItem.id);
                //Get the snippet that corresponds to this item
                let thesnippet = instance.data.attplansnippets.filter((snippet) => {
                    if (hierarchyItemId == snippet.get("_id")) return snippet;
                })[0];
                //Pass thesnippet to html generator
                cardListHtml += thesnippet ? generateListItemHtml(thesnippet) : "";
                //console.log(cardListHtml);     
                let childCardHtml = '';
                if (hierarchyItem.children) {
                    childCardHtml += '<ol>'
                    childCardHtml += buildHierarchyHtml(JSON.stringify(hierarchyItem.children));
                    childCardHtml += '</ol>';
                }
                cardListHtml += childCardHtml;
            }
            cardListHtml += '</li>';
            return cardListHtml;
        }
        //We create the html from the attribute plan snippets only in the first render, for all subsequent renders, we use the hierarchy object (hierarchyContent)
        // Looping through all the attribute plan snippets and creating their markup the first time when its loaded when theres no hierarchy data
        if (!properties.hierarchycontent) {
            console.log('hierarchyContent not present. Rendering from data_source');
            let cardsListHtml = '';
            for (let i = 0; i < properties.data_source.length(); i++) {
                cardsListHtml += generateListItemHtml(instance.data.attplansnippets[i]) + '</li>';
                console.log('GenrateListHtml Called');
                //console.log(cardsListHtml);
            };
            let cardStackHtml = '<ol id="' + properties.plan_unique_id +
                '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' +
                cardsListHtml + "</ol>";
            //console.log(cardStackHtml);
            instance.canvas.html(cardStackHtml)
        } else if (properties.hierarchycontent) {
            let cardStackHtml = '<ol id="' + properties.plan_unique_id +
                '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' +
                buildHierarchyHtml(instance.data.hierarchycontent) + "</ol>";
            console.log('hierarchyContent present. BuildHierarchy HTML Called');
            instance.canvas.html(cardStackHtml);
        }
        //After generating the html, we call Nested Sortable and Quill on it
        callNestedSortable();
        console.log('NestedSortable Called');
        //$(".ql-toolbar").remove() ***NOTE*** - Check if needed or not
        document.querySelectorAll(".quillEditor").forEach(editor => {
            console.log('AddQuillEditor Called');
            //this is a future data type that will be used to remove the event listeners properly. Currently they stick around and cause memory leaks
            const {
                removeEventListener
            } = addQuillEditor(editor);
            instance.data.removeFocusEventListenerFunctions.push(removeEventListener)
        });
        //Call toHierarchy function to update the hierarchy object
        console.log('toHierarchy Called');
        setTimeout(hierarchy, 100);
        //Calling DeleteFoldCollapse
        console.log('Delete,Fold and Collapse Functions Called');
        deleteFoldCollapse();
        
        
        //Function for ellipsis
       	// When the textarea is focussed, it's content will be whatever the description of that APS is. When it is not, it will show everything till the third line and then finish it with ellipsis
        //Steps - Add event listeners for focus and unfocus evenents.
                let cardTitles = document.querySelectorAll(".itemTitle")
        cardTitles.forEach ((textarea) => {
            let id = textarea.getAttribute("data-id");
            let attplansnippet = instance.data.attplansnippets.find((item) => item.get("_id") === id);
            let cardTitle = attplansnippet.get("attribute_name_text");
            textarea.addEventListener("focus", () => {
                console.log('Value set from db');
                textarea.value = attplansnippet.get("attribute_name_text");  
            });

            textarea.addEventListener("blur", () => {
                if (textarea.value.length > 150){
                console.log('Trimmed Value');
                textarea.value = textarea.value.slice(0,150) + "....";
                }
                else {
                    console.log('Untrimmed Value');
                 textarea.value = text;  
                }
            });

        });
        
    }
    
}