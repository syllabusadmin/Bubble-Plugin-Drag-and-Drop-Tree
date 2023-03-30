function(instance, properties, context) {
    //start update
    instance.data.logging = properties.logging;
    instance.data.sliderEnabled = properties.slider_enabled;

    function buildHierarchyHtml(hierarchy1) {
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
            console.log('cardListHtml B4', cardListHtml, 'item', hierarchyItemId, 'hierarchy.children', hierarchyItem.children);
            let childCardHtml = '';
            if (hierarchyItem.children) {
                childCardHtml += '<ol>'
                childCardHtml += buildHierarchyHtml(JSON.stringify(hierarchyItem.children));
                childCardHtml += '</ol>';
            }
            cardListHtml += childCardHtml;
        }
        cardListHtml += '</li>';
        instance.data.start = false;
        return cardListHtml;
    }
    instance.data.callNestedSortable();
    if (!instance.data.halt) {


        //triggers selection of snippet
        instance.data.selectSnippet = (evt) => {
            instance.data.logging ? console.log('selectSnippet', evt.currentTarget.id) : null;
            instance.publishState('selectedsnippet', `${evt.currentTarget.id}|||${evt.currentTarget.type}`);
            instance.triggerEvent('select_snippet');
        }

        ///add stragglers 

        if (!instance.data.start) {

            instance.data.DASAdd = properties.das.get(0, properties.das.length());
            instance.data.TOASAdd = properties.toas.get(0, properties.toas.length());

            instance.data.DASAdd.forEach((das) => {
                instance.data.logging ? console.log("checking das", das) : null;
                let id = das.get('_id');
                let found = $(`.crop-das-${id}`).length;
                if (!found && instance.data.APS.length) {
                    let apsID = das.get('attribute_custom_attribute').get('_id');
                    const aps1 = instance.data.APS.filter((aps2) => aps2.attribute_id_text === apsID);

                    instance.data.logging ? console.log("das Add", das, aps1[0]) : null;
                    instance.data.singleDas = das;
                    instance.data.singleAPS = aps1;
                    if (aps1[0] && das) {
                        if (instance.data.sliderEnabled) {instance.data.addSingleDAS(das, aps1[0]);}
                    }
                } else {
                    instance.data.logging ? console.log("das Found") : null;
                }
            });

            instance.data.TOASAdd.forEach((toas) => {
                instance.data.logging ? console.log("checking toas", toas) : null;
                let id = toas.get('_id');
                let found = $(`.crop-das-${id}`).length;
                if (!found) {
                    instance.data.logging ? console.log("toas Add", toas) : null;
                    let apsID = toas.get('attribute_custom_attribute').get('_id');
                    const aps1 = instance.data.APS.filter((aps2) => aps2.attribute_id_text === apsID);
                    if (aps1[0] && toas) {
                        if (instance.data.sliderEnabled) {instance.data.addSingleTOAS(toas, aps1[0]);}
                    }
                } else {
                    instance.data.logging ? console.log("das Found") : null;
                }
            });

        }


        //CSP add for data purposes,bubble
        instance.data.logging ? console.log("instance.data.isBubble instance.data.start", instance.data.isBubble, instance.data.start) : null;
        if (instance.data.isBubble && instance.data.start) {
            instance.data.plan_unique_id = properties.plan_unique_id;
            instance.data.hierarchyInitial = properties.hierarchycontent;
            instance.data.html_field = properties.html_field;
            let DAS = properties.das.get(0, properties.das.length());
            let TOAS = properties.toas.get(0, properties.toas.length());

            instance.data.DASTOASCount = DAS.length + TOAS.length;
            let DASProperties = ['account_webpage_custom_account_webpage', 'attribute_custom_attribute',
                'box_height_number', 'box_width_number', 'corner_roundness_number', 'initial_drawn_scale_number',
                'mobile_screenshot_custom_webpage_screenshot', 'stroke_width_number', 'syllabus_box_side_number',
                'syllabus_box_width_number', 'webpage_screenshot_custom_webpage_screenshot', 'x_coordinate_number',
                'y_coordinate_number', 'Created By', 'Slug', 'Created Date', 'Modified Date', '_id'
            ];
            let TOASProperties = ['attribute_custom_attribute',
                'highlighted_text_detail_api_1644871875958x568208585554657300_plugin_api_ABO',
                'rangy_highlight_data_api_1665429109854x993084194572730400_plugin_api_ACp', 'text_snippet__text',
                'webpage_custom_account_webpage', 'Created By', 'Slug', 'Created Date', 'Modified Date', '_id'
            ];
            let APSProperties = ['attribute_custom_attribute', 'attribute_id_text', 'attribute_name_text',
                'description_text', 'parent_plan_snippet_custom_attribute_plan_snippet', 'plan_custom_zplan',
                'quill_description_text', 'rank_in_plan_number', 'Created By', 'Slug', 'Created Date',
                'Modified Date', '_id'
            ];
            instance.data.DASProperties = DASProperties;
            instance.data.TOASProperties = TOASProperties;
            instance.data.APSProperties = APSProperties;
            const keyListDataSource = properties.data_source.get(0, properties.data_source.length())[0];
            let dSList = properties.data_source.get(0, properties.data_source.length());
            let DASV = properties.drawn_attribute_snippets_volume.get(0, properties.drawn_attribute_snippets_volume
                .length());
            let TOASV = properties.text_only_attribute_snippets_volume.get(0, properties
                .text_only_attribute_snippets_volume.length());
            let APS = properties.aps.get(0, properties.aps.length());
            ///add new arrays and processs
            instance.data.DAS = [];
            instance.data.TOAS = [];
            instance.data.APS = [];
            instance.data.addDASTOAS(DAS, TOAS, instance.data.DAS, instance.data.TOAS, DASV, TOASV, APS, instance.data
                .APS);
            instance.data.logging ? console.log("starting isBubble main") : null;
            instance.data.logging ? console.log("APS modified", instance.data.APS) : null;
            instance.data.data_source_length = instance.data.APS.length;
            instance.data.data_source_initial = instance.data.APS.length;
            main();
        }
        //////////Experimental Data grab from API
        if (!instance.data.isBubble) {
            instance.data.logging ? console.log("!isBubble") : null;
            var planId = '1676060419773x473669207853629400';
            //
            instance.data.getAPS = function(plan) {
                // Create a form data object
                let bodyContent = new FormData();
                bodyContent.append("plan_id", plan);
                let headersList = {
                    "Accept": "*\/*",
                };
                // Fetch the data from the API endpoint using POST method
                instance.data.logging ? console.log("fetchstarting") : null;
                fetch(`https://d110.bubble.is/site/proresults/version-chris-sprint-38-feb-23/api/1.1/wf/get_aps`, {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList
                }).then((response) => response.json()).then((result) => {
                    instance.data.logging ? console.log("response", result.response) : null;
                    instance.data.result = result.response;
                    instance.data.APS_result = result.response.APS;
                    onDataLoaded();
                    return result;
                }).catch((error) => {
                    instance.data.logging ? console.log("error", error) : null;
                    throw error
                });
            }
            //
            instance.data.properties = properties;
            instance.data.getAPS(planId);
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
            //instance.data.hierarchyInitial = instance.data.result.Plan['JQTree HTML'];
            instance.data.hierarchyInitial = `[{"id":"1678400741256x961039459617341400","foo":"bar"},{"id":"1678398093386x413274195503349760","foo":"bar"},{"id":"1678400899822x568186102965862400","foo":"bar"},{"id":"1678415192492x736722261622652900","foo":"bar"},{"id":"1678415203749x380697560508006400","foo":"bar"}]`;
            instance.data.html_field = instance.data.hierarchyInitial;
            let DAS = instance.data.result['DAS'];
            let TOAS = instance.data.result['TOAS'];
            let DASV = instance.data.result['DASV'];
            let TOASV = instance.data.result['TOASV'];
            let APS = instance.data.result['APS'];
            let DASProperties = ['Desktop Screenshot', 'Modified Date', 'Created Date', 'Created By', 'Y Coordinate', 'X Coordinate', 'Box Width', 'Box Height', 'Attribute', 'Account Webpage', 'Initial drawn scale', '_id'];
            let TOASProperties = ['Created Date', 'Attribute', 'Webpage', 'Text Snippet ', 'Created By', 'Modified Date', '_id'];
            let APSProperties = ['Plan', 'Modified Date', 'Created By', 'Created Date', 'Attribute', 'Attribute Name', 'Attribute ID', '_id'];
            instance.data.logging ? console.log("props", DASProperties, TOASProperties, APSProperties) : null;
            instance.data.DASProperties = DASProperties;
            instance.data.TOASProperties = TOASProperties;
            instance.data.APSProperties = APSProperties;


            ///add new arrays and processs
            instance.data.DAS = [];
            instance.data.TOAS = [];
            instance.data.APS = [];
            instance.data.addDASTOASAPI(DAS, TOAS, instance.data.DAS, instance.data.TOAS, DASV, TOASV, APS, instance.data
                .APS);
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
            console.log("main called");
            window.CSP = instance;
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
                    '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' +
                    cardsListHtml + "</ol>";
                //instance.data.logging ? console.log(cardStackHtml):null;
                instance.canvas.html(cardStackHtml)
            } else if (instance.data.hierarchyInitial && instance.data.start) {
                let cardStackHtml = '<ol id="' + instance.data.plan_unique_id +
                    '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' +
                    buildHierarchyHtml(instance.data.hierarchyInitial) + "</ol>";
                instance.data.logging ? console.log('hierarchyContent present. BuildHierarchy HTML Called') : null;
                instance.canvas.html(cardStackHtml);
            }


            //CSP Add create sliders
            instance.data.logging ? console.log("sliderpoint", instance.data.APS) : null;
            if (instance.data.sliderEnabled) {instance.data.addSlider(instance.data.APS);}

            //After generating the html, we call Nested Sortable and Quill on it
            instance.data.callNestedSortable();
            instance.data.logging ? console.log('NestedSortable Called') : null;
            //$(".ql-toolbar").remove() ***NOTE*** - Check if needed or not
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
                    instance.data.allcards = $('ol.sortable#' + properties.plan_unique_id + " li")
                    for (let i = 0; i < instance.data.allcards.length; i++) {
                        if (instance.data.allcards[i].id) {
                            instance.data.editor_contents.push({
                                id: instance.data.allcards[i].id,
                                content: $("#" + instance.data.allcards[i].id).find(".ql-editor").html()
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


        }
        instance.data.halt = false;
        //Calling DeleteFoldCollapse listeners
        instance.data.logging ? console.log('Delete,Fold and Collapse Functions Called - Update') : null;



        instance.data.start = false;
    }
    setTimeout(instance.data.deleteFoldCollapse, 200);

    //end update
}