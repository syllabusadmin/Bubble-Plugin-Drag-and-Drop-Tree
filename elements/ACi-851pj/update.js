function(instance, properties, context) {
    //start update
       
    instance.data.version = properties.version || '';
    instance.data.resetPlan = () => {
        instance.data.logging ? console.log('reset start',instance.data.start,instance.data.isBubble,instance.data.halt):null;
    if (instance.data.isBubble) {
        instance.data.logging = properties.logging;
        instance.data.ellipsis_modifier = properties.ellipsis_modifier;
        instance.data.cardTitleCollapseRows = properties.cardTitleCollapseRows;
        instance.data.commentsVisible = properties.comments_visible;
        instance.data.delayMilliseconds = properties.delay;
        //instance.data.sliderEnabled = properties.slider_enabled;
        //instance.data.disabled = properties.disabled;
        //adds custom indents to child elements
        if (properties.custom_indents) {
            var newCss = `.sortable > li { margin-left: ${properties.level1}px; }` +
                `.sortable > li > ul > li { margin-left: ${properties.level2}px; }` +
                `.sortable > li > ul > li > ul > li { margin-left: ${properties.level3}px; }` +
                // `.ql-container.ql-snow {border: none}` +
                '';
            // Add to stylesheet
    
            instance.canvas.find('head').append('<style>' + newCss + '</style>');
        }
    }
    if (!instance.data.isBubble) {
    }
    
    instance.data.callNestedSortable();
    if (!instance.data.halt) {
    
    
        //triggers selection of snippet
        instance.data.selectSnippet = (evt) => {
            instance.data.logging ? console.log('selectSnippet', evt.currentTarget.id) : null;
            instance.publishState('selectedsnippet', `${evt.currentTarget.id}|||${evt.currentTarget.type}`);
            instance.triggerEvent('select_snippet');
        }
     
        //CSP add for data purposes,bubble
        instance.data.logging ? console.log("instance.data.isBubble instance.data.start", instance.data.isBubble, instance.data.start) : null;
        if (instance.data.isBubble && instance.data.start) {
            instance.data.plan_unique_id = properties.plan_unique_id;
            instance.data.hierarchyInitial = properties.hierarchycontent;
            instance.data.html_field = properties.html_field;
            let DAS = [];
            let TOAS = [];
    
            instance.data.DASTOASCount = 0;
            let DASProperties = ['account_webpage_custom_account_webpage', 'attribute_custom_attribute',
                'box_height_number', 'box_width_number', 'corner_roundness_number', 'initial_drawn_scale_number',
                'mobile_screenshot_custom_webpage_screenshot', 'stroke_width_number', 'syllabus_box_side_number',
                'syllabus_box_width_number', 'snapshot_image', 'webpage_screenshot_custom_webpage_screenshot', 'x_coordinate_number',
                'y_coordinate_number', 'Created By', 'Slug', 'Created Date', 'Modified Date', '_id'
            ];
            let TOASProperties = ['attribute_custom_attribute',
                'highlighted_text_detail_api_1644871875958x568208585554657300_plugin_api_ABO',
                'rangy_highlight_data_api_1665429109854x993084194572730400_plugin_api_ACp', 'text_snippet__text',
                'webpage_custom_account_webpage', 'Created By', 'Slug', 'Created Date', 'Modified Date', '_id'
            ];
            let APSProperties = ['attribute_custom_attribute', 'attribute_id_text', 'attribute_name_text', 'card_name_text',
                'description_text', 'parent_plan_snippet_custom_attribute_plan_snippet', 'plan_custom_zplan',
                'quill_description_text', 'rank_in_plan_number', 'Created By', 'Slug', 'Created Date',
                'Modified Date', '_id'
            ];
            instance.data.DASProperties = DASProperties;
            instance.data.TOASProperties = TOASProperties;
            instance.data.APSProperties = APSProperties;
            const keyListDataSource = properties.data_source.get(0, properties.data_source.length())[0];
            console.log('DATA SOURCE LOADED ' + keyListDataSource)
            let dSList = properties.data_source.get(0, properties.data_source.length());
            let DASV = [];
            let TOASV = [];
            let APS = properties.aps.get(0, properties.aps.length());
            let screenshots = [];
            ///add new arrays and processs
            instance.data.DAS = [];
            instance.data.TOAS = [];
            instance.data.APS = [];
            instance.data.addDASTOAS(DAS, TOAS, instance.data.DAS, instance.data.TOAS, DASV, TOASV, APS, instance.data
                .APS, screenshots);
            instance.data.logging ? console.log("starting isBubble main") : null;
            instance.data.logging ? console.log("APS modified", instance.data.APS) : null;
            instance.data.data_source_length = instance.data.APS.length;
            instance.data.data_source_initial = instance.data.APS.length;
            main();
        }
        
        ///load function
        function onDataLoaded() {
            instance.data.logging ? console.log("results", instance.data.result, "instance.data.APS_result", instance.data.APS_result) : null;
            ///update variables
            properties.data_source = instance.data.APS_result;
            instance.data.logging ? console.log("log results", instance.data.result['APS'], instance.data.result.APS, properties.data_source) : null;
            /* properties.type_of_items = '';
     
                 properties.html_field = 
                 properties.type_of_items_type = {};
                 instance.data.data_source_length = instance.data.APS_result.length;
                 instance.data.snippetsTransform = instance.data.result['APS'];
                 let snippetsData = ["Attribute", "Attribute ID", "Attribute Name", "Created By", "Created Date",
                     "Modified Date", "Plan", "_id"
                 ];
                 */
    
            ///
            instance.data.data_source_length = instance.data.APS_result.length;
            instance.data.plan_unique_id = instance.data.result.Plan['_id'];
            instance.data.hierarchyInitial = instance.data.result.Plan['Hierarchy Content'];
            instance.data.logging ? console.log('Hier content', instance.data.hierarchyInitial) : null;
            // instance.data.hierarchyInitial = `[{"id":"1678400741256x961039459617341400","foo":"bar"},{"id":"1678398093386x413274195503349760","foo":"bar"},{"id":"1678400899822x568186102965862400","foo":"bar"},{"id":"1678415192492x736722261622652900","foo":"bar"},{"id":"1678415203749x380697560508006400","foo":"bar"}]`;
            //instance.data.html_field = instance.data.hierarchyInitial;
            let DAS = instance.data.result['DAS'];
            let TOAS = instance.data.result['TOAS'];
            let DASV = instance.data.result['DASV'];
            let TOASV = instance.data.result['TOASV'];
            let APS = instance.data.result['APS'];
            let screenshots = instance.data.result['Screenshots'];
            let DASProperties = ['Desktop Screenshot', 'Modified Date', 'Created Date', 'Created By', 'Y Coordinate', 'X Coordinate', 'Box Width', 'Box Height', 'Attribute', 'snapshot', 'Account Webpage', 'Initial drawn scale', '_id'];
            let TOASProperties = ['Created Date', 'Attribute', 'Webpage', 'Text Snippet ', 'Created By', 'Modified Date', '_id'];
            let APSProperties = ['Plan', 'Modified Date', 'Created By', 'Created Date', 'Attribute', 'Attribute Name', 'Attribute ID', 'Card Name', '_id'];
            instance.data.logging ? console.log("props", DASProperties, TOASProperties, APSProperties) : null;
            instance.data.DASProperties = DASProperties;
            instance.data.TOASProperties = TOASProperties;
            instance.data.APSProperties = APSProperties;
    
    
            ///add new arrays and processs
            instance.data.DAS = [];
            instance.data.TOAS = [];
            instance.data.APS = [];
            instance.data.addDASTOASAPI(DAS, TOAS, instance.data.DAS, instance.data.TOAS, DASV, TOASV, APS, instance.data
                .APS, screenshots);
            instance.data.logging ? console.log("starting isBubble main") : null;
            instance.data.logging ? console.log("APS modified", instance.data.APS) : null;
            instance.data.data_source_length = instance.data.APS.length;
            instance.data.data_source_initial = instance.data.APS.length;
    
            main();
            setTimeout(instance.data.deleteFoldCollapse, 200);
        }
        //get data
    
        //end experimental
        //end CSP data add
    
        //We create the html from the attribute plan snippets only in the first render, for all subsequent renders, we use the hierarchy object (hierarchyContent)
        //used to allow for data processing before startup
        function main() {
            instance.data.halt = true;
            instance.data.logging ? console.log("main called"):null;
            instance.data.logging ? window.CSP = instance:null;
            // Looping through all the attribute plan snippets and creating their markup the first time when its loaded when theres no hierarchy data
            if (!instance.data.hierarchyInitial && instance.data.start) {
                instance.data.logging ? console.log('hierarchyContent not present. Rendering from data_source') : null;
                let cardsListHtml = '';
                for (let i = 0; i < instance.data.APS.length; i++) {
                    //instance.data.logging ? console.log("attsnipgen", instance.data.APS[i]);
                    cardsListHtml += instance.data.generateListItemHtml(instance.data.APS[i]) + '</li>';
                    //instance.data.logging ? console.log('GenrateListHtml Called'):null;
                    //instance.data.logging ? console.log(cardsListHtml):null;
                };
                let cardStackHtml = '<ol id="' + instance.data.plan_unique_id +
                    '" class="outline sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded leaf1">' +
                    cardsListHtml + "</ol>";
                //instance.data.logging ? console.log(cardStackHtml):null;
                instance.canvas.html(cardStackHtml)
            } else if (instance.data.hierarchyInitial && instance.data.start) {
                let cardStackHtml = '<ol id="' + instance.data.plan_unique_id +
                    '" class="outline sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded leaf1">' +
                    instance.data.buildHierarchyHtml(instance.data.hierarchyInitial) + "</ol>";
                instance.data.logging ? console.log('hierarchyContent present. BuildHierarchy HTML Called') : null;
                instance.canvas.html(cardStackHtml);
            }
    
    
            //CSP Add create sliders
            instance.data.logging ? console.log("sliderpoint", instance.data.APS, instance.data.sliderEnabled) : null;
            if (instance.data.sliderEnabled) {
            }
    
            //After generating the html, we call Nested Sortable and Quill on it
            instance.data.callNestedSortable();
            instance.data.logging ? console.log('NestedSortable Called') : null;
            //instance.canvas.find(".ql-toolbar").remove() ***NOTE*** - Check if needed or not
            document.querySelectorAll(".quillEditor").forEach((editor) => {
                instance.data.logging ? console.log('AddQuillEditor Called') : null;
                instance.data.addQuillEditor(editor);
            });
            //Call toHierarchy function to update the hierarchy object
            //CSP needs to be at end of main()
            if (instance.data.start) {
                instance.data.halt = true;
                if (instance.data.html_field && !instance.data.hierarchyInitial) {
                    instance.data.logging ? console.log('Checking for JQuery Html') : null;
                    instance.canvas.html(instance.data.html_field);
                    instance.data.editor_contents = new Array();
                    instance.data.allcards = instance.canvas.find('ol.sortable#' + properties.plan_unique_id + " li")
                    for (let i = 0; i < instance.data.allcards.length; i++) {
                        if (instance.data.allcards[i].id) {
                            instance.data.editor_contents.push({
                                id: instance.data.allcards[i].id,
                                content: instance.canvas.find("#" + instance.data.allcards[i].id).find(".ql-editor").html()
                            })
                            instance.data.allcards[i].id = "menuItem_" + instance.data.allcards[i].id;
                        }
                    }
                    instance.data.saveAllCards(instance.data.editor_contents);
                    instance.data.callNestedSortable();
                    setTimeout(instance.data.hierarchy, 3000);
                    setTimeout(instance.data.deleteFoldCollapse, 1000);
                }
                if (instance.data.data_source_initial == instance.data.data_source_length && instance.data
                    .hierarchyInitial == instance.data.hierarchycontent && instance.canvas.innerHtml !=
                    "" && instance.data.hierarchyInitial != "") {
                    setTimeout(instance.data.deleteFoldCollapse, 1000);
                    return;
                }
    
            }
    
            instance.data.start = false;
	    instance.publishState('ready', true);		
            instance.data.reset = () => {
                instance.canvas.innerHTML = '';
		instance.publishState('ready', false);
                instance.data.start = true;
                main();
            }
        instance.data.ellipsis();
        }
        instance.data.halt = false;
        //Calling DeleteFoldCollapse listeners
        instance.data.logging ? console.log('Delete,Fold and Collapse Functions Called - Update') : null;
    
    
    
        // 
    }
    setTimeout(instance.data.deleteFoldCollapse, 200);
    
    
    
    //instance.data.ns.data().mjsNestedSortable.options['disabled'] = instance.data.disabled;
    }
    if (instance.data.initialize) {
        instance.data.initialize = false;
        instance.data.resetPlan();
    }
    if (!instance.data.start) {

    }
    instance.data.logging ? console.log(properties.type_of_items_type.listProperties()): null;
                
            //To take care of randomly appearing URLs used in hyperlinks (APP-2160)
               document.querySelectorAll(".quillEditor").forEach((editor) => {
                const anchorTags = editor.querySelectorAll("a:not(.ql-preview)");
                anchorTags.forEach((anchor) => {
                const href = anchor.href;
                if (anchor.innerHTML === href) {
             // Select the parent <p> tag and delete it if it's a <p> element
               const parentPTag = anchor.parentNode;
                 if (parentPTag.nodeName === 'P') {
                   parentPTag.remove();
                  }
                 }
             });
         });
    //end update
    }