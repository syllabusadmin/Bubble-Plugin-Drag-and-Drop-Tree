function(instance, properties, context) {
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
                    console.log('relocate');
                    instance.publishState("hierarchycontent", instance.canvas.html());
                    instance.triggerEvent("relocated");
                    hierarchy();
                }
            });
        }


        function hierarchy() {
            console.log('toHierarchy Declared');
            //CSP Add
            //super dumb but seems to require it to be added first
            $('ol.sortable#' + instance.data.plan_unique_id).nestedSortable();
            //CSP End
            let hierarchyContent = $('ol.sortable#' + properties.plan_unique_id).nestedSortable('toHierarchy', { startDepthCount: 0 });
            setTimeout(function () {
                instance.publishState("hierarchycontent", JSON.stringify(hierarchyContent));
                instance.triggerEvent("relocated");
            }, 100);
            //save hierarchyContent object to the Plan
        }

        if (properties.html_field && !properties.hierarchycontent) {
            console.log('Checking for JQuery Html');
            instance.canvas.html(properties.html_field);
            hierarchy();
        }

        if (properties.data_source.length() == instance.data.data_source_length && properties.hierarchycontent == instance.data.hierarchycontent && instance.canvas.innerHtml != "" && properties.hierarchycontent != "") {

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
            if (attributeplansnippet.get("quill_description_text")) { quilltext = attributeplansnippet.get("quill_description_text") }
            let cardItemHtml = '<li id="menuItem_' + attributeplansnippet.get("_id") + '" style="display: list-item;" class="mjs-nestedSortable-leaf" data-foo="bar"><div class = "parentContainer highlightable highlight-' + attributeplansnippet.get("attribute_id_text") + '" id="' + attributeplansnippet.get("attribute_id_text") + '"><div class = "dragContainer"><span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer"><div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide description" data-id="' + attributeplansnippet.get("_id") + '" class = "expandEditor material-icons" >expand_more</span><input  type="text" class = "itemTitle" data-id="' + attributeplansnippet.get("_id") + '"value="' + attributeplansnippet.get("attribute_name_text") + '"><span class="deleteMenu material-icons" title="Click to delete item." data-id="' + attributeplansnippet.get("_id") + '">close</span></div><div class = "quillContainer" id="' + attributeplansnippet.get("_id") + '"><div class="quillEditor" id="' + attributeplansnippet.get("_id") + '">' + quilltext + '</div></div></div></div>';
            //console.log("Quill Description Text" + attributeplansnippet.get("description_text"));
            //console.log(cardItemHtml);
            return cardItemHtml;
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


            const handleClick = (e) => {
                console.log(`editor`, editor.parentElement.id)

                if (!e.target.closest(`[id="${editor.parentElement.id}"]`)) {
                    console.log(`hiding toolbar: the target is`, e.target, `and the toolbar is`, toolbar, `and the preview is`, e.target.classList.contains('ql-preview'))
                    toolbar.setAttribute('hidden', true)
                }
            }
            window.addEventListener('click', handleClick)




            quill.root.addEventListener('blur', e => {


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
                if (eventName === 'text-change') {
                    instance.data.handleStopTyping(editor.id);
                } else if (eventName === 'selection-change') {
                    // Handle selection change
                }
            });

            const removeEventListener = window[`removeEventListener_${editor.parentElement.id}`] = () => {
                window.removeEventListener('click', handleClick);
            }

            return { removeEventListener };
        };


        instance.data.handleStopTyping = (id) => {
            // Clear the timeout and set a new one to handle the typing change
            clearTimeout(instance.data.typingTimeout);
            instance.data.typingTimeout = setTimeout(() => instance.data.handleTypingChange(id), 100);
        };

        instance.data.handleTypingChange = (id) => {
            // When the typing has stopped, trigger the "stopped_typing" event and update the Quill contents
            console.log('typingchange');

            instance.data.typingTimeout = null;
            // Expose html of edtitor as state
            instance.publishState('editedcard_id', id);
            //instance.publishState('htmlobject', instance.canvas.html());
            instance.publishState('quill_editor_content', $("#menuItem_" + id).find(".quillEditor").html());
            instance.triggerEvent('stopped_typing');
            instance.triggerEvent('relocated');
        };


        function deleteFoldCollapse() {
            $('.disclose').on('click', function () {
                $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
                $(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
            });


            //$('.deleteMenu').unbind();
            $('.deleteMenu').click(function () {
                let uniqueId = $(this).attr('data-id');
                let card_id = "#menuItem_" + uniqueId;
                if ($(card_id).length == 0) { return; }
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
                    if (hierarchyItemId == snippet.get("_id"))
                        return snippet;
                })[0];

                //Pass thesnippet to html generator
                cardListHtml += generateListItemHtml(thesnippet);
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

            let cardStackHtml = '<ol id="' + properties.plan_unique_id + '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' + cardsListHtml + "</ol>";
            //console.log(cardStackHtml);
            instance.canvas.html(cardStackHtml)

        } else if (instance.data.hierarchycontent) {
            let cardStackHtml = '<ol id="' + properties.plan_unique_id + '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' + buildHierarchyHtml(instance.data.hierarchycontent) + "</ol>";
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
            const { removeEventListener } = addQuillEditor(editor);
            instance.data.removeFocusEventListenerFunctions.push(removeEventListener)
        });

        //Call toHierarchy function to update the hierarchy object
        console.log('toHierarchy Called');
        setTimeout(hierarchy, 100);

        //Calling DeleteFoldCollapse
        console.log('Delete,Fold and Collapse Functions Called');
        deleteFoldCollapse();
    }
}