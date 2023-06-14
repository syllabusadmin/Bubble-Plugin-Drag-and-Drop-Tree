function(instance, context) {
    
    //start initialize
      
    var isBubble = true;
    var randomElementID =
        `ddt-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
    if (!isBubble) {
        var instance = {};
        instance.data = {};
        instance.data.start = true;
        instance.data.halt = false;
        instance.data.listcount = 0;
        instance.data.logging = true;
        instance.triggerEvent = (a) => {
            console.log("triggerevent", a);
        };;
        instance.publishState = (a, b) => {
            console.log("publishState", a, b);
        };
        instance.data.isBubble = false;
        instance.data.randomElementID = randomElementID;
        var properties = {};
        properties.data_source = [];
        instance.data.mainElement = $('#cardstack');
        instance.data.mainElement.append(`<div id="temp" class="invisible"></div>`);
        instance.data.temp = $('#temp');
        instance.canvas = $('#cardstack');
        instance.data.logging ? console.log("instance canvas", instance.data.mainElement) : null;
        instance.data.sliderEnabled = true;
        instance.data.disabled = false;
        instance.data.initialize = true;
        instance.data.expander = false;
        instance.data.ellipsis_length = instance.canvas.width() / 16;
        instance.data.ellipsis_modifier = 1.25;
        instance.data.cardTitleCollapseRows = 2;
    } else {
        instance.data.start = true;
        instance.data.halt = false;
        instance.data.logging = true;
        instance.canvas.html('');
        instance.canvas.append(
            `<div id="cardstack${instance.data.randomElementID}"></div> <div id="temp${instance.data.randomElementID}" class="invisible"></div>`
        );
        instance.data.mainElement = $(`#cardstack${instance.data.randomElementID}`);
        instance.data.temp = $(`#temp${instance.data.randomElementID}`);
        instance.data.isBubble = true;
        instance.data.initialize = true;
        instance.data.expander = false;
        instance.data.ellipsis_length = instance.canvas.width() / 16;
        instance.data.cardTitleCollapseRows = 3;
        instance.data.ellipsis_modifier = 1;
    }
    
    ///end CSP initialize
    instance.data.listcount = 0;
        
    instance.data.handleTypingChange = (editor) => {
        // When the typing has stopped, trigger the "stopped_typing" event and update the Quill contents
        let content = editor.innerHTML;
        instance.data.logging ? console.log('stopped_typing', content, editor.id) : null;
        instance.triggerEvent('stopped_typing');
        instance.data.typingTimeout = null;
        // Expose Delta as state
        instance.publishState('delta', content);
        instance.publishState('editedcard_id', editor.id);
        //instance.publishState('htmlobject', instance.canvas.html());
        //instance.publishState('quill_editor_content', content);
        //instance.triggerEvent('relocated');
        //setTimeout(() => instance.publishState('quill_editor_content', null), 500);
    };
    instance.data.handleStopTyping = (editor) => {
        // Clear the timeout and set a new one to handle the typing change
        //console.log('handle stopped_typing',editor.innerHTML,editor.id);
        clearTimeout(instance.data.typingTimeout);
        instance.data.typingTimeout = setTimeout(() => instance.data.handleTypingChange(editor), 1000);
    };
    instance.data.generateListItemHtml = (attributeplansnippet) => {
    let aps = attributeplansnippet._id;
        let aps_att_id_text = attributeplansnippet.attribute_id_text;
        let aps_name_text = attributeplansnippet.attribute_name_text;
        let aps_card_name_text = attributeplansnippet.attribute_card_name_text;
        if (instance.data.isBubble) {aps_card_name_text = attributeplansnippet.card_name_text};
        if (!aps_card_name_text) {aps_card_name_text = attributeplansnippet.attribute_name_text};
        instance.data.logging ? console.log("apscard",attributeplansnippet) : null;
        instance.data.apscard = attributeplansnippet;
        //QUESTION HERE
        let aps_quill_text = attributeplansnippet.quill_description_text ? attributeplansnippet
            .quill_description_text : "";
        if (aps_quill_text === "null") {
            aps_quill_text = "";
        }
        var disabled = '';
        var deleteDisabled = '<span class="deleteMenu material-icons" title="Click to delete item." data-id="' +
            aps + '">close</span>';
        var inputDisabled = '';
        if (instance.data.disabled) {
            deleteDisabled = '';
            disabled = ' disabled';
        }
        //let aps_quill_text = "quill_description_text Placeholder";
        instance.data.logging ? console.log(
            'GenerateListItem Declared,aps, aps_id_text, aps_name_text, aps_quill_text,aps_card_name_text', aps, aps_att_id_text,
            aps_name_text, aps_quill_text, aps_card_name_text) : null;
        let cardItemHtml = `<li id="menuItem_${aps}" style="display: list-item;" class="mjs-nestedSortable-leaf leaf1" data-foo="bar">
     <div class = "parentContainer" id="${aps_att_id_text}"><div class = "dragContainer">
     <span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer">
     <div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span>
     </span><span title="Click to show/hide description" data-id="${aps}" class = "expandEditor material-icons" >expand_more</span>
     <textarea class = "cardTitle" rows = "1" data-id="${aps}" ${disabled}>${aps_card_name_text}</textarea>${deleteDisabled}</div><div class="quillContainer quillTitleContainer" id="${aps}"><div class="quillEditor quillBorder" id="${aps}">${aps_quill_text}</div></div>
    
    
     <div id="labelTitle-${aps}" style="padding-top: 10px !important;">
     <input  style="margin-top: 10px !important; padding-bottom: 5px !important;" type="text" class="labelTitleHeader" data-id="${aps}" value="Associated label:" disabled>
     <div data-id="${aps_att_id_text}" class="labelTitleContainer highlightable highlight-${aps_att_id_text}"><p class="labelTitle highlightable" data-id="${aps_att_id_text}" value=>${aps_name_text}</p>
     <div id="slider-aps-${aps}"></div></div></div></div></div>`;
        //console.log("Quill Description Text" + attributeplansnippet.get("description_text"));
        //console.log(cardItemHtml);
        instance.data.attributeplansnippet
        return cardItemHtml;
    }
    instance.data.buildHierarchyHtml = (hierarchy1) => {
        instance.data.logging ? console.log("heirBuild", hierarchy1) : null;
        let hierarchy = JSON.parse(hierarchy1);
        instance.data.logging ? console.log('buildHierarchyHtml Declared', hierarchy.length) : null;
        let cardListHtml = '';
        for (let i = 0; i < hierarchy.length; i++) {
            let hierarchyItem = hierarchy[i];
            let hierarchyItemId = hierarchyItem.id;
            instance.data.logging ? console.log('hierarchyitem and id' + hierarchy[i] + hierarchyItem.id) : null;
            //Get the snippet that corresponds to this item
            let thesnippet = instance.data.APS.filter((snippet) => {
                if (hierarchyItemId == snippet._id) {
                    return snippet;
                }
            })[0];
            //Pass thesnippet to html generator
            instance.data.logging ? console.log("theSnippet", thesnippet) : null;
            if (thesnippet) {
                cardListHtml += instance.data.generateListItemHtml(thesnippet);
            }
            //console.log('cardListHtml B4', cardListHtml, 'item', hierarchyItemId, 'hierarchy.children', hierarchyItem.children);
            let childCardHtml = '';
            if (hierarchyItem.children) {
                childCardHtml += '<ol>'
                childCardHtml += instance.data.buildHierarchyHtml(JSON.stringify(hierarchyItem.children));
                childCardHtml += '</ol>';
            }
            cardListHtml += childCardHtml;
        }
        cardListHtml += '</li>';
        instance.data.start = false;
        return cardListHtml;
    }
    instance.data.callNestedSortable = () => {
        instance.data.logging ? console.log('ANLI NestedSortable Declared') : null;
        //super dumb but seems to require it to be added first
        //instance.canvas.find('ol.sortable#' + instance.data.plan_unique_id).nestedSortable();
        //CSP End
        instance.data.ns = instance.canvas.find('ol.sortable#' + instance.data.plan_unique_id).nestedSortable({
            disabled: instance.data.disabled,
            forcePlaceholderSize: true,
            handle: '.dragHandle',
            helper: 'clone',
            items: 'li',
            opacity: 0.6,
            placeholder: 'placeholder',
            revert: 250,
            tabSize: 25,
            tolerance: 'pointer',
            toleranceElement: '> div',
            maxLevels: 4,
            isTree: true,
            expandOnHover: 700,
            startCollapsed: false,
            isAllowed: function(currentItem, parentItem, levels) {
                // Allow nesting as long as the parent is the root element or a leaf element
                instance.data.logging ? console.log("leaf",currentItem, parentItem, levels):null;
                if (!parentItem) {
                    var list = currentItem.closest('ol');
                    var isTopLevel = list.hasClass('sortable');
                    instance.data.logging ? console.log("leaf parentItem",list, isTopLevel):null;
                    if (isTopLevel) {
                        // Allow drop on first level
                        return true;
                    } else {
                        // Prevent drop on all other levels
                        return false;
                    }
                }
                var isLeaf = parentItem.hasClass('leaf1');
                return isLeaf;
            },
            change: function () {
                instance.data.logging ? console.log('Relocated item') : null;
            },
            relocate: function () {
                instance.data.logging ? console.log('relocate') : null;
                instance.publishState("htmlobject", instance.canvas.html());
                instance.triggerEvent("relocated");
                setTimeout(instance.data.hierarchy, 100);
            }
        });
    }
    instance.data.hierarchy = () => {
        instance.data.logging ? console.log('toHierarchy Declared') : null;
        //CSP Add
        //super dumb but seems to require it to be added first
        instance.data.callNestedSortable();
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
    instance.data.dataPrepper = (typeArray, propArray, finishArray, volume) => {
        typeArray.forEach(function (item, index) {
            var newItem = {};
            propArray.forEach((value) => {
                var keyNew = value.replace('_api_c2_', '');
                newItem[keyNew] = item.get(value);
            });
            if (volume) {
                newItem['volume'] = volume[index];
            }
            finishArray.push(newItem);
        });
        //console.log("FA",JSON.stringify(finishArray));
    }
    instance.data.addDASTOAS = (DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray) => {
        instance.data.logging ? console.log("Begin-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS,
            TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray) : null;
        if (DAS.length != 0) {
            instance.data.dataPrepper(DAS, instance.data.DASProperties, DASArray, DASV);
        }
        if (TOAS.length != 0) {
            instance.data.dataPrepper(TOAS, instance.data.TOASProperties, TOASArray, TOASV);
        }
        instance.data.dataPrepper(APS, instance.data.APSProperties, APSArray);
        //combine TOAS and DAS
        instance.data.DASTOAS = [];
        instance.data.logging ? console.log("After Prep -DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS,
            TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray) : null;
        const DASprops = ['box_height_number', 'box_width_number', 'initial_drawn_scale_number',
            'snapshot_image', 'mobile_screenshot_custom_webpage_screenshot', 'x_coordinate_number', 'y_coordinate_number', '_id'
        ];
        const TOASprops = ['text_snippet__text', '_id'];
        if (DAS.length != 0) {
            DASArray.forEach((value) => {
                var newItem = {};
                newItem['type'] = 'image';
                DASprops.forEach((att) => {
                    newItem[att] = value[att];
                });
                //required as looping function just wouldn't work
                newItem['webpage'] = value['account_webpage_custom_account_webpage'].get('_id');
                newItem['attribute_id'] = value['attribute_custom_attribute'].get('_id');
                newItem['attribute_name'] = value['attribute_custom_attribute'].get('name_text');
                newItem['snapshot'] = value['attribute_custom_attribute'].get('snapshot_image');
                //newItem['webpage_screenshot_custom_webpage_screenshot'] = value['attribute_custom_attribute'].get('webpage_screenshot_custom_webpage_screenshot');
                //newItem['webpage_screenshot_custom_webpage_screenshot'] = 'https://via.placeholder.com/150';
                instance.data.DASTOAS.push(newItem);
            });
        }
        instance.data.logging ? console.log("DAS -instance.data.DASTOAS", instance.data.DASTOAS) : null;
        //could be combined with above
        if (TOAS.length != 0) {
            TOASArray.forEach((value) => {
                var newItem = {};
                newItem['type'] = 'text';
                TOASprops.forEach((att) => {
                    newItem[att] = value[att];
                });
                //required as looping function just wouldn't work
                newItem['webpage'] = value['attribute_custom_attribute'].get('_id');
                newItem['attribute_id'] = value['attribute_custom_attribute'].get('_id');
                newItem['attribute_name'] = value['attribute_custom_attribute'].get('name_text');
                instance.data.DASTOAS.push(newItem);
            });
        }
        instance.data.logging ? console.log("TOAS-instance.data.DASTOAS", instance.data.DASTOAS) : null;
        //add dastoas to APS data    
        APSArray.forEach((aps) => {
            //console.log("Start array filter");
            const matchingObjs = instance.data.DASTOAS.filter((dastoas) => dastoas.attribute_id === aps
                .attribute_id_text);
            if (matchingObjs.length > 0) {
                aps.DASTOAS = matchingObjs;
            }
        });
        instance.data.logging ? console.log("End-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS,
            TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray) : null;
    }
    instance.data.dataPrepperAPI = (typeArray, propArray, finishArray, volume) => {
        typeArray.forEach(function (item, index) {
            var newItem = {};
            propArray.forEach((value) => {
                var keyNew = value.replace('_api_c2_', '');
                newItem[keyNew] = item[value];
            });
            if (volume) {
                newItem['volume'] = volume[index];
            }
            finishArray.push(newItem);
        });
        //console.log("FA",JSON.stringify(finishArray));
    }
    instance.data.addDASTOASAPI = (DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray, screenshots) => {
        instance.data.logging ? console.log("Begin-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS,
            TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray) : null;
        if (DAS.length != 0) {
            instance.data.dataPrepperAPI(DAS, instance.data.DASProperties, DASArray, DASV);
    
        }
        if (TOAS.length != 0) {
            instance.data.dataPrepperAPI(TOAS, instance.data.TOASProperties, TOASArray, TOASV);
        }
        instance.data.dataPrepperAPI(APS, instance.data.APSProperties, APSArray);
        instance.data.logging ? console.log("After prepper", DASArray,TOASArray) : null;
        //combine TOAS and DAS
        instance.data.DASTOAS = [];
        if (DAS.length != 0) {
            DASArray.forEach((value, index) => {
                var newItem = {};
                newItem['type'] = 'image';
                instance.data.DASProperties.forEach((att) => {
                    newItem[att] = value[att];
                });
                //required as looping function just wouldn't work
                newItem['webpage'] = value['Account Webpage'];
                newItem['box_height_number'] = value['Box Height'];
                newItem['box_width_number'] = value['Box Width'];
                newItem['x_coordinate_number'] = value['X Coordinate'];
                newItem['y_coordinate_number'] = value['Y Coordinate'];
                newItem['attribute_id'] = value['Attribute'];
                newItem['initial_drawn_scale_number'] = value['Initial drawn scale'];
                //!instance.data.isBubble ? newItem['snapshot'] = value['snapshot'] : newItem['snapshot'] = value['snapshot_image'];
                //newItem['attribute_name'] = value['attribute_custom_attribute'].get('name_text');
                //newItem['webpage_screenshot_custom_webpage_screenshot'] = value['attribute_custom_attribute'].get('webpage_screenshot_custom_webpage_screenshot');
                //newItem['webpage_screenshot_custom_webpage_screenshot'] = 'https:' + screenshots[index].split(",")[0];
                instance.data.DASTOAS.push(newItem);
                instance.data.logging ? console.log("newItemDAS", newItem) : null;
            });
        }
        instance.data.logging ? console.log("DAS -instance.data.DASTOAS", instance.data.DASTOAS) : null;
        //could be combined with above
        if (TOAS.length != 0) {
            TOASArray.forEach((value) => {
                var newItem = {};
                newItem['type'] = 'text';
                instance.data.TOASProperties.forEach((att) => {
                    newItem[att] = value[att];
                });
                //required as looping function just wouldn't work
                newItem['webpage'] = value['Account Webpage'];
                newItem['attribute_id'] = value['Attribute'];
                newItem['text_snippet__text'] = value['Text Snippet '];
                instance.data.DASTOAS.push(newItem);
                instance.data.logging ? console.log("newItemTOAS", newItem) : null;
            });
        }
        instance.data.logging ? console.log("TOAS-instance.data.DASTOAS", instance.data.DASTOAS) : null;
        APSArray.forEach((value) => {
            console.log('value', value);
            value.attribute_id_text = value['Attribute'];
            value.attribute_name_text = value['Attribute Name'];
            value.attribute_card_name_text = value['Card Name'];
        });
        //add dastoas to APS data    
        APSArray.forEach((aps) => {
            //console.log("Start array filter");
            const matchingObjs = instance.data.DASTOAS.filter((dastoas) => dastoas.attribute_id === aps
                .attribute_id_text);
            if (matchingObjs.length > 0) {
                aps.DASTOAS = matchingObjs;
            }
        });
        instance.data.logging ? console.log("End-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS,
            TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray) : null;
    }
    //Add slider function
    instance.data.addSlider = (aps) => {
        if (instance.data.isBubble || !instance.data.isBubble) {
            instance.data.logging ? console.log("start addslider", aps) : null;
            aps.forEach((aps) => {
                instance.data.logging ? console.log("slider-create", aps._id) : null;
                var mainElement = instance.canvas.find(`#slider-aps-${aps._id}`);
                //instance.data.mainElement = mainElement;
                console.log("mainELement", mainElement, mainElement.length);
                if (mainElement.length != 0) {
                    mainElement.addClass('carousel');
                    instance.data.logging ? console.log("mainElementL", mainElement):null;
                    //   slider.classList.add('carousel', `slider-buttons-aps-${aps._id}`);
                    ///new
                    var carousel = document.createElement('div');
                    carousel.id = aps._id;
                    carousel.classList.add('carousel');
                    instance.data.logging ? console.log("carousel", carousel):null;
                    mainElement.append(carousel);
                    //instance.data.logging ? console.log("mainElement-after carousel", mainElement):null;
                    let textDastoas = [];
                    let imageDastoas = [];
                    if (aps.DASTOAS) {
    
                        textDastoas = aps.DASTOAS.filter((dastoas) => dastoas.type === 'text');
                        imageDastoas = aps.DASTOAS.filter((dastoas) => dastoas.type === 'image');
                    var slider = new Flickity(`#slider-aps-${aps._id}`, {
                        wrapAround: true,
                        prevNextButtons: true,
                        pageDots: false
                    });
                    instance.data.logging ? console.log("filter dastoas",textDastoas,imageDastoas):null;
                    // iterate through textDastoas
                    if (textDastoas) {
                        textDastoas.forEach((dastoas) => {
                            var newElement = document.createElement('div');
                            newElement.classList.add('carousel-cell-text');
                            newElement.innerHTML =
                                `<div class="div-text crop-das-${dastoas._id} carousel-text">${dastoas.text_snippet__text}</div>`;
                            newElement.id = dastoas._id;
                            newElement.type = 'Text';
                            //instance.data.logging ? console.log("newElement text", newElement):null;
                            newElement.addEventListener("click", instance.data.selectSnippet);
                            if (slider) {
                                slider.append(newElement);
                            }
                            /* OLD
                    const newElement = document.createElement('div');
                    newElement.innerHTML =
                        `<div class="div-text" width="100px">${dastoas.text_snippet__text}</div>`;
                    slider.appendChild(newElement);
                    */
                        });
                    }
                    // iterate through imageDastoas
                    if (imageDastoas) {
                        imageDastoas.forEach((dastoas) => {
                            if (dastoas.snapshot || dastoas.snapshot_image) {
                            var newElement = document.createElement('div');
                            newElement.classList.add('carousel-cell-image');
                            //newElement.innerHTML = `<div class="image crop-das-${dastoas._id}"><img class="carousel-img image"/></div>`;
                            instance.data.logging ? console.log('addind Das', dastoas, dastoas.snapshot):null;
                            dastoas.snapshot_image ? dastoas.snapshot = dastoas.snapshot_image : null;
                            newElement.innerHTML = `<div><img class="image carousel-img image" src="https:${dastoas.snapshot}"/></div>`;
                            newElement.id = dastoas._id;
                            newElement.type = 'Image';
                            //instance.data.logging ? console.log("newElement img", newElement):null;
                            newElement.addEventListener("click", instance.data.selectSnippet);
                            if (slider) {
                                slider.append(newElement);
                            }
                        }
                        });
                    }
                    //mainElement.append(slider);
                    //instance.data.logging ? console.log("mainElement-after,slider ", mainElement, slider);
                }
            }
            })
        }
    }
    //addQuill
    instance.data.addQuillEditor = (editor) => {
        instance.data.logging ? console.log('AddQuillEditor Declared',editor) : null;
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
            bounds: editor
        });

    
        instance.data.logging ? window.quill = quill : null;
        instance.data.logging ? window.toolbar = quill.getModule('toolbar').container : null;
        const toolbar = quill.getModule('toolbar').container;
        console.log("Toolbar selected Succesfully " + toolbar);
        quill.getModule('toolbar').container.style.display = 'none';
        quill.root.parentElement.style.borderTop = `1px`;
        instance.data.toolbar = toolbar;
        /*old
        const toolbar = quill.getModule('toolbar');
        console.log("Toolbar selected Succesfully " + toolbar)
        toolbar.setAttribute('hidden', true);
        quill.root.parentElement.style.borderTop = `1px`;
        instance.data.toolbar = toolbar;
    new */
        //disable toolbar if disabled
        if (instance.data.disabled) {
    
            quill.disable();
            var toolbar1 = quill.getModule('toolbar').container;
            quill.getModule('toolbar').container.style.display = 'none';
        } /*
             else {
                 quill.enable();
                 var toolbar2 = quill.getModule('toolbar');
                 toolbar2.container.style.display = 'block';
             }
            */ 
    
        quill.root.addEventListener('focus', (e) => {
            instance.data.focused = true
            quill.getModule('toolbar').container.style.display = 'block';
        })
        const handleClick = (e) => {
            instance.data.logging ? console.log(`editor`, editor.parentElement.id) : null;
            if (!e.target.closest(`[id="${editor.parentElement.id}"]`)) {
                //instance.data.logging ? console.log(`hiding toolbar: the target is`, e.target,`and the toolbar is`, toolbar, `and the preview is`, e.target.classList.contains('ql-preview')) : null;
                quill.getModule('toolbar').container.style.display = 'none';
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
              instance.data.logging ? console.log('blur'):null;   
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
                instance.data.handleStopTyping(editor);
                instance.data.logging ? console.log("editor", editor) : null;
                instance.publishState('quill_editor_content', editor.innerHTML);
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
    };
    //deletefold
    instance.data.deleteFoldCollapse = () => {
        instance.data.logging ? console.log("deleteFoldInitiated") : null;
        waitForElm('.disclose').then((elm) => {
            instance.canvas.find('.disclose').unbind();
            instance.canvas.find('.disclose').on('click', function () {
                instance.data.logging ? console.log("disclose onclick") : null;
                instance.canvas.find(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass(
                    'mjs-nestedSortable-expanded');
                instance.canvas.find(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
            });
        });
        waitForElm('.deleteMenu').then((elm) => {
            instance.canvas.find('.deleteMenu').unbind();
            if (!instance.data.disabled) {
                instance.canvas.find('.deleteMenu').click(function () {
                    let uniqueId = instance.canvas.find(this).attr('data-id');
                    let card_id = "#menuItem_" + uniqueId;
                    if (instance.canvas.find(card_id).length == 0) {
                        return;
                    }
                    if (window.confirm("Are you sure you want to delete this card ?")) {
                        let childCardsIdList = instance.canvas.find(card_id).find('li');
                        let idArray = [];
                        childCardsIdList.each(function (index) {
                            idArray.push(instance.canvas.find(this).attr('id'));
                        });
                        instance.canvas.find(card_id).remove();
                        setTimeout(function () {
                            instance.publishState("htmlobject", instance.canvas.html());
                            instance.data.hierarchy();
                        }, 10);
                        setTimeout(function () {
                            instance.publishState("deletedcard_id", uniqueId);
                            instance.publishState("deletedchildren_id_list", idArray
                                .toString());
                            instance.triggerEvent("deleted");
                        }, 10);
                    }
                });
            }
        });
        waitForElm('.expandEditor').then((elm) => {
            instance.canvas.find('.expandEditor').unbind();
            instance.canvas.find('.expandEditor').click(function () {
                instance.data.logging ? console.log("expand onclick") : null;
                let uniqueId = instance.canvas.find(this).attr('data-id');
                instance.canvas.find('#' + uniqueId + '.quillEditor').toggle('fast', 'swing');
                if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
                    instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');
                } else {
                    instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');
                }
                //CSP Add for Slider
                if (instance.data.sliderEnabled) {
                    if (instance.canvas.find(`#slider-aps-${uniqueId}`).hasClass('slider_invisible')) {
                        instance.canvas.find(`#slider-aps-${uniqueId}`).removeClass('slider_invisible');
                    } else {
                        instance.canvas.find(`#slider-aps-${uniqueId}`).addClass('slider_invisible');
                    }
                }
                //CSP Add for new Label Title
    
                if (instance.canvas.find(`#labelTitle-${uniqueId}`).hasClass('slider_invisible')) {
                    instance.canvas.find(`#labelTitle-${uniqueId}`).removeClass('slider_invisible');
                } else {
                    instance.canvas.find(`#labelTitle-${uniqueId}`).addClass('slider_invisible');
                }
            });
            waitForElm('.cardTitle').then((elm) => {
                instance.canvas.find('.cardTitle').unbind();
                if (!instance.data.disabled) {
                    instance.canvas.find(".cardTitle").on("input", function () {
                        let editedCardId = instance.canvas.find(this).attr('data-id');
                        console.log('Input cardtitle fired ' + editedCardId + ' ' + instance.canvas.find(this).val());
                        instance.publishState("changedcard", instance.canvas.find(this).val());
                        instance.publishState("editedcard_id", editedCardId);
                        instance.triggerEvent("changedcard");
                        let thesnippet = instance.data.APS.find((snippet) => snippet._id === editedCardId);
                        thesnippet.card_name_text = instance.canvas.find(this).val();
                    });
                } 
    
            }); 
            waitForElm('.labelTitle').then((elm) => {
                instance.canvas.find('.labelTitle').unbind();
                if (!instance.data.disabled) {
                    instance.canvas.find(".labelTitle").on("input", function () {
                        let editedCardId = instance.canvas.find(this).attr('data-id');
                        console.log('Input label title fired ' + editedCardId);
                        instance.publishState("changedname", instance.canvas.find(this).val());
                        instance.publishState("editedcard_id", editedCardId);
                        instance.triggerEvent("namechange");
                        
                        //CSP add to update cards
						const matchingItems = instance.data.APS.filter((snippet) => snippet.attribute_id_text === editedCardId);

						matchingItems.forEach((snippet) => {
						  snippet.attribute_name_text = instance.canvas.find(this).val();
						});

						const inputElements = document.querySelectorAll(`input.labelTitle[data-id="${editedCardId}"]`);

						inputElements.forEach((inputElement, index) => {
						  inputElement.value = matchingItems[index].attribute_name_text;
						});

                        
                    });
                }
            });
        });
    }
    //add single items
    instance.data.addSingleDAS = (das, aps1) => {
        /*
        instance.data.logging ? console.log("addSingleDas", das, aps1) : null;
        let newDAS = das;
        let aps2 = aps1;
        let id = newDAS.get('_id');
        let apsId = aps2._id;
        var newElement = document.createElement('div');
        newElement.classList.add('carousel-cell');
        newElement.innerHTML = `<div class="image crop-das-${id}"><img class="carousel-img image"/></div>`;
        newElement.id = id;
        newElement.type = 'Image';
        //instance.data.logging ? console.log("newElement img", newElement):null;
        newElement.addEventListener("click", instance.data.selectSnippet);
        var carousel = instance.canvas.find(`#slider-aps-${apsId}`).flickity({
            initialIndex: 1
        });
        carousel.flickity('append', newElement);
        */
        instance.data.logging ? console.log("addSingleDas", das, aps1) : null;
        let newDAS = das;
        let aps2 = aps1;
        let id = newDAS.get('_id');
        let apsId = aps2._id;
        var newElement = document.createElement('div');
        newElement.classList.add('carousel-cell-image');
        //newElement.innerHTML = `<div class="image crop-das-${dastoas._id}"><img class="carousel-img image"/></div>`;
        instance.data.logging ? console.log('addind Das', newDAS, newDAS.snapshot):null;
        newDAS.snapshot_image ? newDAS.snapshot = newDAS.snapshot_image : null;
        newElement.innerHTML = `<div><img class="image carousel-img image" src="https:${newDAS.snapshot}"/></div>`;
        newElement.id = id;
        newElement.type = 'Image';
        //instance.data.logging ? console.log("newElement img", newElement):null;
        newElement.addEventListener("click", instance.data.selectSnippet);
        var carousel = instance.canvas.find(`#slider-aps-${apsId}`).flickity({
            initialIndex: 1
        });
        carousel.flickity('append', newElement);
    }
    instance.data.addSingleTOAS = (toas, aps1) => {
        let newTOAS = toas;
        let aps = aps1;
        let id = newTOAS.get('_id');
        let text = newTOAS.get('text_snippet__text');
        let apsId = aps._id;
        var newElement = document.createElement('div');
        newElement.classList.add('carousel-cell');
        newElement.innerHTML = `<div class="div-text crop-das-${id} carousel-text">${text}</div>`;
        newElement.id = id;
        newElement.type = 'Text';
        //instance.data.logging ? console.log("newElement text", newElement):null;
        newElement.addEventListener("click", instance.data.selectSnippet);
        var carousel = instance.canvas.find(`#slider-aps-${apsId}`).flickity({
            initialIndex: 1
        });
        carousel.flickity('append', newElement);
    }
    instance.data.savecard = (card, index) => {
        instance.publishState('editedcard_id', card.id);
        //instance.publishState('htmlobject', instance.canvas.html());
        instance.publishState('quill_editor_content', card.content);
        setTimeout(() => {
            instance.triggerEvent('stopped_typing')
        }, 100 * index);
    }
    instance.data.saveAllCards = (editors_array) => {
        for (let i = 0; i < editors_array.length; i++) {
            instance.data.savecard(editors_array[i], i);
        }
    }
    
    function waitForElm(selector) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    instance.data.logging ? window.CSP = instance:null;
    if (!instance.data.isBubble) {
        var button = document.getElementById('processButton');
        button.addEventListener('click', function () {
            instance.canvas.innerHTML = '';
            instance.data.start = true;
            instance.data.halt = false;
            instance.data.resetPlan();
            console.log('Process started!');
        });
        var input = document.querySelector('#myInput');
        var sliderButton = document.getElementById('sliderButton');
        sliderButton.addEventListener('click', function () {
            instance.canvas.innerHTML = '';
            instance.data.sliderEnabled = !instance.data.sliderEnabled;
            instance.data.start = true;
            instance.data.halt = false;
            instance.data.resetPlan();
            console.log('Process started!');
        });
        const expandButton = document.getElementById('expandButton'); 
    expandButton.addEventListener('click', () => {
        instance.data.logging ? console.log("expand expander", instance.data.expander) : null;
        if (instance.data.expander) {
            instance.data.APS.forEach((aps) => {
                const uniqueId = aps._id;
                instance.canvas.find('#' + uniqueId + '.quillEditor').slideDown('fast', 'swing');
                if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
                    instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');
                } 
                //CSP Add for Slider
                if (instance.data.sliderEnabled) {
                    instance.canvas.find(`#slider-aps-${uniqueId}`).removeClass('slider_invisible');
                } 
                //CSP Add for new Label Title
                if (instance.canvas.find(`#labelTitle-${uniqueId}`).hasClass('slider_invisible')) {
                    instance.canvas.find(`#labelTitle-${uniqueId}`).removeClass('slider_invisible');
                } 
            })
        } else {
            instance.data.APS.forEach((aps) => {
                const uniqueId = aps._id;
                instance.canvas.find('#' + uniqueId + '.quillEditor').slideUp('fast', 'swing');
                if (instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_less') {   
                    instance.canvas.find('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');
                }
                if (instance.data.sliderEnabled) {
                    instance.canvas.find(`#slider-aps-${uniqueId}`).addClass('slider_invisible');
                }
                instance.canvas.find(`#labelTitle-${uniqueId}`).addClass('slider_invisible');
            })
        }
        instance.data.expander = !instance.data.expander;
    });
    
    }
    // Observe for css changes
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the added nodes include an <ol> or <li> element
                const addedNodes = mutation.addedNodes;
                for (let node of addedNodes) {
                    if (node.nodeName === 'OL' || node.nodeName === 'LI') {
                        // Set the margin-bottom of <li> elements as necessary
                        $('ol > li').css('margin-bottom', '10px');
                        $('ol > li > ol > li').css('margin-bottom', '0');
                    }
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    
    /*instance.data.ellipsis = () => {   
         //Function for ellipsis
               // When the textarea is focussed, it's content will be whatever the description of that APS is. When it is not, it will show everything till the third line and then finish it with ellipsis
            //Steps - Add event listeners for focus and unfocus evenents.
        //console.log(properties.type_of_items_type.listProperties());
        //console.log(instance.data.APS[0]);
                let titleTextAreas = document.querySelectorAll(".cardTitle")
            titleTextAreas.forEach ((textarea) => {
                if (textarea.value.length > (instance.data.ellipsis_length * instance.data.ellipsis_modifier)) {textarea.value = textarea.value.slice(0,(instance.data.ellipsis_length * instance.data.ellipsis_modifier)) + "...."};
                let id = textarea.getAttribute("data-id");
                let attplansnippet = instance.data.APS.find((item) => item._id === id);
                let titleText = (attplansnippet.card_name_text && attplansnippet.card_name_text.trim() !== '') ? attplansnippet.card_name_text : '';

               
                
                textarea.addEventListener("focus", (event) => {
                    
                    id = event.target.getAttribute("data-id");
                    attplansnippet = instance.data.APS.find((item) => item._id === id);
                    titleText = (attplansnippet.card_name_text && attplansnippet.card_name_text.trim() !== '') ? attplansnippet.card_name_text : '';
                    instance.data.isBubble ? textarea.value = titleText: textarea.value = attplansnippet.attribute_card_name_text; 
                    textarea.rows = 3; 
                    console.log('CardNameText=',titleText,'AttCardNameText',attplansnippet.attribute_card_name_text);
                    console.log('Value set from db',event.target.value);
                });
    
                textarea.addEventListener("blur", (event) => {
                    if (textarea.value.length > (instance.data.ellipsis_length * instance.data.ellipsis_modifier)){
                    //instance.data.ellipsis_length = (textarea.offsetWidth / 11) - 20;
                    //console.log('Trimmed Value',textarea.value.length,instance.data.ellipsis_length,instance.data.ellipsis_modifier,(instance.data.ellipsis_length * instance.data.ellipsis_modifier)); 
                    textarea.value = textarea.value.slice(0,(instance.data.ellipsis_length * instance.data.ellipsis_modifier)) + "....";
                    textarea.rows = 1;
                        console.log('Trimmed Value', textarea.value);
                    }
                    else {                    
                        //let id = textarea.getAttribute("data-id");
                        //let titleText
                        //let attplansnippet = instance.data.APS.find((item) => item._id === id);
                        instance.data.isBubble ? titleText = attplansnippet.card_name_text: titleText = attplansnippet.attribute_card_name_text; 
                     textarea.value = titleText;  
                     textarea.rows = 1;
                     console.log('Untrimmed Value',textarea.value);   
                    }
                });
    
            });        
        } */
      
    //end initialize
    }