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
     instance.triggerEvent = (a) => {console.log("triggerevent",a)};;
     instance.publishState = (a,b) => {console.log(a,b)};
     instance.data.isBubble = isBubble;
     instance.data.randomElementID = randomElementID;
     var properties = {};
     properties.data_source = [];
     instance.data.mainElement = $('#cardstack');
     instance.data.mainElement.append(`<div id="temp" class="invisible"></div>`);
     instance.data.temp = $('#temp');
     instance.canvas = $('#cardstack');
     console.log("instance canvas", instance.data.mainElement);
 } else {
     instance.data.start = true;
     instance.data.halt = false;
     instance.canvas.append(
         `<div id="cardstack${instance.data.randomElementID}"></div> <div id="temp${instance.data.randomElementID}" class="invisible"></div>`
         );
     instance.data.mainElement = $(`#cardstack${instance.data.randomElementID}`);
     instance.data.temp = $(`#temp${instance.data.randomElementID}`);
     instance.data.isBubble = isBubble;
 }
 ///end CSP initialize
 instance.data.listcount = 0;
 instance.data.handleTypingChange = (content, id) => {
     // When the typing has stopped, trigger the "stopped_typing" event and update the Quill contents
     instance.triggerEvent('stopped_typing');
     instance.data.typingTimeout = null;
     // Expose Delta as state
     instance.publishState('delta', content);
     instance.publishState('editedcard_id', id);
     instance.publishState('htmlobject', instance.canvas.html());
     instance.triggerEvent('relocated');
 };
 instance.data.handleStopTyping = (content, id) => {
     // Clear the timeout and set a new one to handle the typing change
     clearTimeout(instance.data.typingTimeout);
     instance.data.typingTimeout = setTimeout(() => instance.data.handleTypingChange(JSON.stringify(content),
         id), 250);
 };
 instance.data.generateListItemHtml = (attributeplansnippet) => {
     let aps = attributeplansnippet._id;
     let aps_att_id_text = attributeplansnippet.attribute_id_text;
     let aps_name_text = attributeplansnippet.attribute_name_text;
     //QUESTION HERE
     let aps_quill_text = attributeplansnippet.quill_description_text ? attributeplansnippet
         .quill_description_text : "";
     //let aps_quill_text = "quill_description_text Placeholder";
     console.log('GenerateListItem Declared,aps, aps_id_text, aps_name_text, aps_quill_text', aps,
         aps_att_id_text, aps_name_text, aps_quill_text);
     let cardItemHtml = `<li id="menuItem_${aps}" style="display: list-item;" class="mjs-nestedSortable-leaf" data-foo="bar">
<div class = "parentContainer highlightable highlight-${aps_att_id_text}" id="${aps_att_id_text}"><div class = "dragContainer">
<span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer">
<div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span>
</span><span title="Click to show/hide description" data-id="${aps}" class = "expandEditor material-icons" >expand_more</span>
<input  type="text" class = "itemTitle" data-id="${aps}"value="${aps_name_text}"><span class="deleteMenu material-icons" title="Click to delete item." 
data-id="${aps}">close</span></div><div class = "quillContainer" id="${aps}"><div class="quillEditor" id="${aps}">${aps_quill_text}</div></div>
<div id="slider-aps-${aps}"></div></div></div></li>`;
     //console.log("Quill Description Text" + attributeplansnippet.get("description_text"));
     //console.log(cardItemHtml);
     return cardItemHtml;
 }
 instance.data.callNestedSortable = () => {
     //console.log('ANLI NestedSortable Declared');   
     instance.data.ns = $('ol.sortable#' + instance.data.plan_unique_id).nestedSortable({
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
         change: function() {
             console.log('Relocated item')
         },
         relocate: function() {
             console.log('relocate');
             instance.publishState("htmlobject", instance.canvas.html());
             instance.triggerEvent("relocated");
             setTimeout(instance.data.hierarchy, 100);
         }
     });
 }
 instance.data.hierarchy = () => {
     console.log('toHierarchy Declared');
     //super dumb but seems to require it to be added first
     $('ol.sortable#' + instance.data.plan_unique_id).nestedSortable();
     let hierarchyContent = $('ol.sortable#' + instance.data.plan_unique_id).nestedSortable('toHierarchy', {
         startDepthCount: 0
     });
     console.log("hierarchyContent,hierarchyContent.prevObject", hierarchyContent, hierarchyContent.prevObject);
     if (!hierarchyContent.prevObject) {
         setTimeout(function() {
             instance.publishState("hierarchycontent", JSON.stringify(hierarchyContent));
             instance.triggerEvent("relocated");
         }, 100);
     }
     //save hierarchyContent object to the Plan
 }
 instance.data.dataPrepper = (typeArray, propArray, finishArray, volume) => {
     typeArray.forEach(function(item, index) {
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
     console.log("Begin-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS, TOAS, DASArray,
         TOASArray, DASV, TOASV, APS, APSArray);
     if (DAS.length != 0) {
         instance.data.dataPrepper(DAS, instance.data.DASProperties, DASArray, DASV);
     }
     if (TOAS.length != 0) {
         instance.data.dataPrepper(TOAS, instance.data.TOASProperties, TOASArray, TOASV);
     }
     instance.data.dataPrepper(APS, instance.data.APSProperties, APSArray);
     //combine TOAS and DAS
     instance.data.DASTOAS = [];
     const DASprops = ['box_height_number', 'box_width_number', 'initial_drawn_scale_number',
         'mobile_screenshot_custom_webpage_screenshot', 'x_coordinate_number', 'y_coordinate_number', '_id'
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
             //newItem['webpage_screenshot_custom_webpage_screenshot'] = value['attribute_custom_attribute'].get('webpage_screenshot_custom_webpage_screenshot');
             newItem['webpage_screenshot_custom_webpage_screenshot'] = 'https://via.placeholder.com/150';
             instance.data.DASTOAS.push(newItem);
         });
     }
     console.log("DAS -instance.data.DASTOAS", instance.data.DASTOAS);
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
     console.log("TOAS-instance.data.DASTOAS", instance.data.DASTOAS);
     //add dastoas to APS data    
     APSArray.forEach((aps) => {
         //console.log("Start array filter");
         const matchingObjs = instance.data.DASTOAS.filter((dastoas) => dastoas.attribute_id === aps
             .attribute_id_text);
         if (matchingObjs.length > 0) {
             aps.DASTOAS = matchingObjs;
         }
     });
     console.log("End-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS, TOAS, DASArray,
         TOASArray, DASV, TOASV, APS, APSArray);
 }
 instance.data.dataPrepperAPI = (typeArray, propArray, finishArray, volume) => {
     typeArray.forEach(function(item, index) {
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
 instance.data.addDASTOASAPI = (DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray) => {
     console.log("Begin-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS, TOAS, DASArray,
         TOASArray, DASV, TOASV, APS, APSArray);
     if (DAS.length != 0) {
         instance.data.dataPrepperAPI(DAS, instance.data.DASProperties, DASArray, DASV);
     }
     if (TOAS.length != 0) {
         instance.data.dataPrepperAPI(TOAS, instance.data.TOASProperties, TOASArray, TOASV);
     }
     instance.data.dataPrepperAPI(APS, instance.data.APSProperties, APSArray);
     //combine TOAS and DAS
     instance.data.DASTOAS = [];
     if (DAS.length != 0) {
         DASArray.forEach((value) => {
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
             
             //newItem['attribute_name'] = value['attribute_custom_attribute'].get('name_text');
             //newItem['webpage_screenshot_custom_webpage_screenshot'] = value['attribute_custom_attribute'].get('webpage_screenshot_custom_webpage_screenshot');
             newItem['webpage_screenshot_custom_webpage_screenshot'] = 'https://via.placeholder.com/150';
             instance.data.DASTOAS.push(newItem);
             console.log("newItemDAS",newItem);
         });
     }
     console.log("DAS -instance.data.DASTOAS", instance.data.DASTOAS);
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
             console.log("newItemTOAS",newItem);
         });
     }
     console.log("TOAS-instance.data.DASTOAS", instance.data.DASTOAS);
     APSArray.forEach((value) => {
         value.attribute_id_text = value['Attribute'];
         value.attribute_name_text = value['Attribute Name'];
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
     console.log("End-DAS, TOAS, DASArray, TOASArray, DASV, TOASV, APS, APSArray", DAS, TOAS, DASArray,
         TOASArray, DASV, TOASV, APS, APSArray);
 }
 //Add slider function
 instance.data.addSlider = (aps) => {
     if (instance.data.isBubble || !instance.data.isBubble) {
         console.log("start addslider", aps);
         aps.forEach((aps) => {
             console.log("slider-create", aps._id);
             var mainElement = $(`#slider-aps-${aps._id}`);
             mainElement.addClass('carousel');
             //console.log("mainElement", mainElement);
             //   slider.classList.add('carousel', `slider-buttons-aps-${aps._id}`);
             ///new
             var carousel = document.createElement('div');
             carousel.id = aps._id;
             carousel.classList.add('carousel');
             //console.log("carousel", carousel);
             mainElement.append(carousel);
             //console.log("mainElement-after carousel", mainElement);
             var slider = new Flickity(`#slider-aps-${aps._id}`, {
                 wrapAround: true,
                 prevNextButtons: true,
                 pageDots: false
             });
             let textDastoas = [];
             let imageDastoas = [];
             if (aps.DASTOAS) {
                 textDastoas = aps.DASTOAS.filter((dastoas) => dastoas.type === 'text');
                 imageDastoas = aps.DASTOAS.filter((dastoas) => dastoas.type === 'image');
             }
             // iterate through textDastoas
             if (textDastoas) {
                 textDastoas.forEach((dastoas) => {
                     var newElement = document.createElement('div');
                     newElement.classList.add('carousel-cell');
                     newElement.innerHTML =
                         `<div class="div-text crop-das-${dastoas._id} carousel-text">${dastoas.text_snippet__text}</div>`;
                     newElement.id = dastoas._id;
                     newElement.type = 'Text';
                     //console.log("newElement text", newElement);
                     newElement.addEventListener("click", instance.data.selectSnippet);
                     slider.append(newElement);
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
                     var newElement = document.createElement('div');
                     newElement.classList.add('carousel-cell');
                     newElement.innerHTML =
                         `<div class="image crop-das-${dastoas._id}"><img class="carousel-img image"/></div>`;
                     newElement.id = dastoas._id;
                     newElement.type = 'Image';
                     //console.log("newElement img", newElement);
                     newElement.addEventListener("click", instance.data.selectSnippet);
                     slider.append(newElement);
                     /* OLD
                 const newElement = document.createElement('div');
                 //newElement.innerHTML = `<div class="image screenshot-${dastoas.webpage}" width="100px"><img src="${dastoas.webpage_screenshot_custom_webpage_screenshot}" class=""/></div>`;
     newElement.innerHTML = `<div class="image" width="100px"><img class="image screenshot-container-${dastoas.webpage} crop-das-${dastoas._id}"/></div>`;
                 slider.appendChild(newElement);
                 */
                     ///add to css NEEDED
                 });
             }
             //mainElement.append(slider);
             //console.log("mainElement-after,slider ", mainElement, slider);
         })
     }
 }
 //addQuill
 instance.data.addQuillEditor = (editor) => {
  
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
 //deletefold
 instance.data.deleteFoldCollapse = () => {
     console.log("deleteFoldInitiated");
     $('.disclose').on('click', function() {
         console.log("disclose onclick");
         $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass(
             'mjs-nestedSortable-expanded');
         $(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
     });
     $('.deleteMenu').unbind();
     $('.deleteMenu').click(function () {
         let uniqueId = $(this).attr('data-id');
         let card_id = "#menuItem_"+uniqueId;
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
                 instance.data.hierarchy();
             }, 10);
             setTimeout(function () {
                 instance.publishState("deletedcard_id", uniqueId);
 
                 instance.publishState("deletedchildren_id_list", idArray.toString());
                 instance.triggerEvent("deleted");
             }, 10);
         }
     });
     $('.expandEditor').click(function() {
         console.log("expand onclick");
         let uniqueId = $(this).attr('data-id');
         $('#' + uniqueId + '.quillEditor').toggle('fast', 'swing');
         if ($('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
             $('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');
         } else {
             $('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');
         }
         //CSP Add for Slider
         if ($(`#slider-aps-${uniqueId}`).hasClass('slider_invisible')) {
             $(`#slider-aps-${uniqueId}`).removeClass('slider_invisible');
         } else {
             $(`#slider-aps-${uniqueId}`).addClass('slider_invisible');
         }
         //end CSP Add
     });
 }
 //add single items
 instance.data.addSingleDAS = (das,aps1) => {
 let newDAS = das;
 let aps2 = aps1;
 let id = newDAS.get('_id');
 let apsId = aps2._id;
 
 var newElement = document.createElement('div');

 newElement.classList.add('carousel-cell');
 newElement.innerHTML = `<div class="image crop-das-${id}"><img class="carousel-img image"/></div>`;
 newElement.id = id;
 newElement.type = 'Image';
 //console.log("newElement img", newElement);
 //newElement.addEventListener("click", instance.data.selectSnippet);

 var carousel = $(`#slider-aps-${apsId}`).flickity({
     initialIndex: 1
 });

 carousel.flickity('append', newElement);
}
instance.data.addSingleTOAS = (toas,aps1) => {
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
 //console.log("newElement text", newElement);
 newElement.addEventListener("click", instance.data.selectSnippet);
 var carousel = $(`#slider-aps-${apsId}`).flickity({
     initialIndex: 1
 });
 carousel.flickity('append', newElement);
}
 //end initialize
}