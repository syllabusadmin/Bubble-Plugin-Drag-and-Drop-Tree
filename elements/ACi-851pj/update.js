function(instance, properties, context) {
    //start update
    if (!instance.data.halt) {

        function buildHierarchyHtml(hierarchy) {
            console.log("heirBuild", hierarchy);
            hierarchy = JSON.parse(hierarchy);
            console.log('buildHierarchyHtml Declared');
            let cardListHtml = '';
            for (let i = 0; i < hierarchy.length; i++) {
                let hierarchyItem = hierarchy[i];
                let hierarchyItemId = hierarchyItem.id;
                console.log('hierarchyitem and id' + hierarchy[i] + hierarchyItem.id);
                //Get the snippet that corresponds to this item
                let thesnippet = instance.data.APS.filter((snippet) => {
                    if (hierarchyItemId == snippet._id) return snippet;
                })[0];
                //Pass thesnippet to html generator
                console.log("theSnippet", thesnippet);
                if (thesnippet) {
                    cardListHtml += instance.data.generateListItemHtml(thesnippet);
                }
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
        //triggers selection of snippet
        instance.data.selectSnippet = (evt) => {
            console.log('selectSnippet', evt.currentTarget.id);
            instance.publishState('selectedsnippet', `${evt.currentTarget.id}|||${evt.currentTarget.type}`);
            instance.triggerEvent('select_snippet');
        }

        ///add stragglers 

        if (!instance.data.start) {

            instance.data.DASAdd = properties.das.get(0, properties.das.length());
            instance.data.TOASAdd = properties.toas.get(0, properties.toas.length());

            instance.data.DASAdd.forEach((das) => {
                console.log("checking das", das);
                let id = das.get('_id');
                let found = $(`.crop-das-${id}`).length;
                if (!found) {
                    let apsID = das.get('attribute_custom_attribute').get('_id');
                    const aps1 = instance.data.APS.filter((aps2) => aps2.attribute_id_text === apsID);
                    
                    console.log("das Add", das,aps1[0]);
                    instance.data.singleDas = das;
                    instance.data.singleAPS = aps1;
                    if (aps1[0] && das) {instance.data.addSingleDAS(das, aps1[0]);}
                } else {
                    console.log("das Found");
                }
            });

            instance.data.TOASAdd.forEach((toas) => {
                console.log("checking toas", toas);
                let id = toas.get('_id');
                let found = $(`.crop-das-${id}`).length;
                if (!found) {
                    console.log("toas Add", toas);
                    let apsID = toas.get('attribute_custom_attribute').get('_id');
                    const aps1 = instance.data.APS.filter((aps2) => aps2.attribute_id_text === apsID);
                    if (aps1[0] && toas) {instance.data.addSingleTOAS(toas, aps1[0]);}
                } else {
                    console.log("das Found");
                }
            });

        }


        //CSP add for data purposes,bubble
        console.log("instance.data.isBubble instance.data.start", instance.data.isBubble, instance.data.start);
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
            console.log("starting isBubble main");
            console.log("APS modified", instance.data.APS);
            instance.data.data_source_length = instance.data.APS.length;
            instance.data.data_source_initial = instance.data.APS.length;
            main();
        }
        //////////Experimental Data grab from API
        if (!instance.data.isBubble) {
            console.log("!isBubble");
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
                console.log("fetchstarting");
                fetch(`https://d110.bubble.is/site/proresults/version-chris-sprint-38-feb-23/api/1.1/wf/get_aps`, {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList
                }).then(response => response.json()).then(result => {
                    console.log("response", result.response);
                    instance.data.result = result.response;
                    instance.data.APS_result = result.response.APS;
                    onDataLoaded();
                    return result
                }).catch(error => {
                    console.log("error", error);
                    throw error
                });
            }
            //
            instance.data.properties = properties;
            instance.data.getAPS(planId);
        }
        ///load function
        function onDataLoaded() {
            console.log("results", instance.data.result, "instance.data.APS_result", instance.data.APS_result);
            ///update variables
            properties.data_source = instance.data.APS_result;
            console.log("log results", instance.data.result['APS'], instance.data.result.APS, properties.data_source);
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
            instance.data.hierarchyInitial = "";
            instance.data.html_field = instance.data.hierarchyInitial;
            let DAS = instance.data.result['DAS'];
            let TOAS = instance.data.result['TOAS'];
            let DASV = instance.data.result['DASV'];
            let TOASV = instance.data.result['TOASV'];
            let APS = instance.data.result['APS'];
            let DASProperties = ['Desktop Screenshot', 'Modified Date', 'Created Date', 'Created By', 'Y Coordinate', 'X Coordinate', 'Box Width', 'Box Height', 'Attribute', 'Account Webpage', 'Initial drawn scale', '_id'];
            let TOASProperties = ['Created Date', 'Attribute', 'Webpage', 'Text Snippet ', 'Created By', 'Modified Date', '_id'];
            let APSProperties = ['Plan', 'Modified Date', 'Created By', 'Created Date', 'Attribute', 'Attribute Name', 'Attribute ID', '_id'];
            console.log("props", DASProperties, TOASProperties, APSProperties);
            instance.data.DASProperties = DASProperties;
            instance.data.TOASProperties = TOASProperties;
            instance.data.APSProperties = APSProperties;


            ///add new arrays and processs
            instance.data.DAS = [];
            instance.data.TOAS = [];
            instance.data.APS = [];
            instance.data.addDASTOASAPI(DAS, TOAS, instance.data.DAS, instance.data.TOAS, DASV, TOASV, APS, instance.data
                .APS);
            console.log("starting isBubble main");
            console.log("APS modified", instance.data.APS);
            instance.data.data_source_length = instance.data.APS.length;
            instance.data.data_source_initial = instance.data.APS.length;

            main();
            setTimeout(instance.data.deleteFoldCollapse, 200);
        };
        //get data

        //end experimental
        //end CSP data add

        //We create the html from the attribute plan snippets only in the first render, for all subsequent renders, we use the hierarchy object (hierarchyContent)
        //used to allow for data processing before startup
        function main() {
            window.CSP = instance;
            // Looping through all the attribute plan snippets and creating their markup the first time when its loaded when theres no hierarchy data
            if (!instance.data.hierarchyInitial) {
                console.log('hierarchyContent not present. Rendering from data_source');
                let cardsListHtml = '';
                for (let i = 0; i < instance.data.APS.length; i++) {
                    //console.log("attsnipgen", instance.data.APS[i]);
                    cardsListHtml += instance.data.generateListItemHtml(instance.data.APS[i]) + '</li>';
                    //console.log('GenrateListHtml Called');
                    //console.log(cardsListHtml);
                };
                let cardStackHtml = '<ol id="' + instance.data.plan_unique_id +
                    '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' +
                    cardsListHtml + "</ol>";
                //console.log(cardStackHtml);
                instance.canvas.html(cardStackHtml)
            } else if (instance.data.hierarchyInitial) {
                let cardStackHtml = '<ol id="' + instance.data.plan_unique_id +
                    '" class="sortable ui-sortable mjs-nestedSortable-branch mjs-nestedSortable-expanded">' +
                    buildHierarchyHtml(instance.data.hierarchyInitial) + "</ol>";
                console.log('hierarchyContent present. BuildHierarchy HTML Called');
                instance.canvas.html(cardStackHtml);
            }


            //CSP Add create sliders
            console.log("sliderpoint", instance.data.APS);
            instance.data.addSlider(instance.data.APS);

            //After generating the html, we call Nested Sortable and Quill on it
            instance.data.callNestedSortable();
            console.log('NestedSortable Called');
            //$(".ql-toolbar").remove() ***NOTE*** - Check if needed or not
            document.querySelectorAll(".quillEditor").forEach(editor => {
                console.log('AddQuillEditor Called');
                instance.data.addQuillEditor(editor);
            });
            //Call toHierarchy function to update the hierarchy object
            //CSP needs to be at end of main()
            if (instance.data.start) {
if (instance.data.html_field && !instance.data.hierarchyInitial) {
                    console.log('Checking for JQuery Html');
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
                    setTimeout(hierarchy, 3000);
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

        //Calling DeleteFoldCollapse listeners
        console.log('Delete,Fold and Collapse Functions Called - Update');



        instance.data.start = false;
    }
   setTimeout(instance.data.deleteFoldCollapse, 200);

    //end update
}