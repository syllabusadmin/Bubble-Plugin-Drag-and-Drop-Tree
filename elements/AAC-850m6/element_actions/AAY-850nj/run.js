function(instance, properties, context) {

    
      
	//check if the data exists
    if(properties.attribute_plan_snippet){
    
        
     // Declaring newListElement function to create markup of a newly added card
        var generateListItemHtml = (attributeplansnippet) => {
     	let newListElement = '<li id="menuItem_' + attributeplansnippet.get("_id") + '" style="display: list-item;" class="mjs-nestedSortable-leaf" data-foo="bar"><div class = "parentContainer highlightable highlight-' + attributeplansnippet.get("attribute_id_text") + '" id="' + attributeplansnippet.get("attribute_id_text") + '"><div class = "dragContainer"><span class="dragHandle material-icons">drag_indicator</span></div><div class="contentContainer"><div class ="menuContainer"><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide description" data-id="' + attributeplansnippet.get("_id") + '" class = "expandEditor material-icons" >expand_more</span><input  type="text" class = "itemTitle" data-id="' + attributeplansnippet.get("_id") + '"value="' + attributeplansnippet.get("attribute_name_text") + '"><span class="deleteMenu material-icons" title="Click to delete item." data-id="' + attributeplansnippet.get("_id") + '">close</span></div><div class = "quillContainer" id="' + attributeplansnippet.get("_id") + '"><div class="quillEditor" id="' + attributeplansnippet.get("_id") + '"></div></div></div></div></li>';
            return newListElement;
        }
              
        

            //instance.data.quillinstances.push(quill)    
        
        
         console.log(properties.attribute_plan_snippet.listProperties());
         console.log(properties.attribute_plan_snippet.get('attribute_custom_attribute'));
	
    	//pass the attribute_plan_snippet to a function to generate it's li item
        let itemHtml = generateListItemHtml(properties.attribute_plan_snippet)
        
		//Select the existing cardstack element
        let cardStackElement = $('#' + instance.data.plan_unique_id)
    
    	//Append the new li item to the existing cardstack
        cardStackElement.append(itemHtml)
        
        //Call nestedSortable again(as in update)
        instance.data.ns=$('#' + instance.data.plan_unique_id).nestedSortable({
				forcePlaceholderSize: true,
				handle: '.dragHandle',
				helper:	'clone',
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
				change: function() {
					//console.log('Relocated item')
                },
        		relocate: function(){
        			//console.log('add New');
					setTimeout(function(){
       		 		instance.publishState("htmlobject", instance.canvas.html());
                    instance.triggerEvent("relocated");},100);
                }
		});
        
        $(".ql-toolbar").remove()
        document.querySelectorAll(".quillEditor").forEach(editor => {
            
            
           // console.log("loopadd");
            //adding the quill editor to a container
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
                //put the element of where you want to display the editor
                debug: 'warn',
                bounds: editor
            });

            // Access the toolbar after the Quill editor is initialized
            const toolbar = quill.root.parentElement.previousSibling

            // Set the toolbar to be hidden by default
            toolbar.setAttribute('hidden', true)
            //console.log(quill.root)
            quill.root.parentElement.style.borderTop = `1px`;

            // Show the toolbar when the Quill editor is focused
            quill.root.addEventListener('focus', e => {
            //console.log('focused')
              instance.data.focused = true
              toolbar.removeAttribute('hidden', false)
            })

            quill.root.addEventListener('click', e => {
              //console.log("it's clicked")
            })

            // Hide the toolbar when the Quill editor loses focus,
            // but only if the element that was clicked is not a child of the toolbar - courtesy of chatGPT
            quill.root.addEventListener('blur', e => {
              //console.log('unfocused')
              instance.data.focused = false

              if (!toolbar.contains(e.relatedTarget)) {
                toolbar.setAttribute('hidden', true)
              }
            })

           // console.log(toolbar)

            

            quill.on('editor-change', (eventName, ...args) => {
                // Listen for changes to the editor
                //eventName options =
                //console.log('editor-change');
                if (eventName === 'text-change') {
                    // If the text has changed, set a timeout to handle the change for performance
                    instance.data.handleStopTyping(quill.getContents(), editor.id);


                    //console.log(quill.getContents());

                } else if (eventName === 'selection-change') {
                    // Handle selection change

                }
            });

        })
        // Delete, Fold and Expand/Colapse functions 

		$('.disclose').on('click', function() {
		    $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
			$(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
			});
			
            	$('.deleteMenu').unbind();
				$('.deleteMenu').click(function(){
                    let uniqueId = $(this).attr('data-id');
                    if($('#' + uniqueId).length == 0){return;}
                    if(window.confirm("Are you sure you want to delete this card ?")){
                let childCardsIdList = $('#' + uniqueId).find('li');//.attr('id');
                        var idArray = [];
                        childCardsIdList.each(function(index) {
                        var id = $(this).attr('id');
                        idArray.push(id);
                        });
                //console.log('list' + idArray.toString());
       		 	instance.publishState("htmlobject", instance.canvas.html());
				$('#' + uniqueId).remove();
                setTimeout(function(){
       		 		instance.publishState("htmlobject", instance.canvas.html());
                    instance.triggerEvent("relocated");},10);
                setTimeout(function(){
                    instance.publishState("deletedcard_id", uniqueId);
                    instance.publishState("deletedchildren_id_list", idArray.toString());
                    instance.triggerEvent("deleted");},10);
                }
			});
				
			$('#serialize').click(function(){
				serialized = $('ol.sortable').nestedSortable('serialize');
				$('#serializeOutput').text(serialized+'\n\n');
			})
	
			$('#toHierarchy').click(function(e){
				hiered = $('ol.sortable').nestedSortable('toHierarchy', {startDepthCount: 0});
				hiered = dump(hiered);
				(typeof($('#toHierarchyOutput')[0].textContent) != 'undefined') ?
				$('#toHierarchyOutput')[0].textContent = hiered : $('#toHierarchyOutput')[0].innerText = hiered;
			})
	
			$('#toArray').click(function(e){
				arraied = $('ol.sortable').nestedSortable('toArray', {startDepthCount: 0});
				arraied = dump(arraied);
				(typeof($('#toArrayOutput')[0].textContent) != 'undefined') ?
				$('#toArrayOutput')[0].textContent = arraied : $('#toArrayOutput')[0].innerText = arraied;
			});
    
        	$('.expandEditor').unbind();
    		$('.expandEditor').click(function(){
				var uniqueId = $(this).attr('data-id');
				$('#' + uniqueId + '.quillEditor').toggle('fast', 'swing');
				if ($('.expandEditor[data-id=' + uniqueId + ']').html() === 'expand_more') {
					  $('.expandEditor[data-id=' + uniqueId + ']').html('expand_less');
			   } else {
					  $('.expandEditor[data-id=' + uniqueId + ']').html('expand_more');
         }
            });
        
        //console.log('add new');
		setTimeout(function(){
            instance.publishState("htmlobject", instance.canvas.html());
            instance.triggerEvent("relocated");},100);
        }
     $(".itemTitle").on("input", function(){
      let editedCardId = $(this).attr('data-id');
      instance.publishState("changedname", $(this).val());
      instance.triggerEvent("namechange");
      instance.publishState("editedcard_id", editedCardId);
   });
    
    var hiered = $('ol.sortable').nestedSortable('toHierarchy', { startDepthCount: 0 });
    console.log(hiered);
    }

