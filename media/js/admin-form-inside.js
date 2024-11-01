var adminFormOnSelect = function(form_id){
	
	var shortcode_html = '[tidio-form id="' + form_id + '" /]';
	
	//
	
	if(jQuery("#wp-content-wrap").hasClass('tmce-active')){
	
		var html_content = tinymce.editors.content.getContent();
		
		html_content += "\n\n" + shortcode_html;
		
		tinymce.editors.content.setContent(html_content);
	
	} else {
		
		var $textarea = jQuery("#content");
		
		var html_content = $textarea.val();
		
		if(html_content!=''){
			
			html_content += "\n";
		}
		
		html_content += shortcode_html;
		
		$textarea.val(html_content);
		
	}
	
};

window.adminFormOnSelect = adminFormOnSelect;

//

var adminFormInside = {
	
	plugin_url: null,

	admin_url: null,
	
	create: function(data){
		
		if(data.plugin_url){
			this.plugin_url = data.plugin_url;
		}

		if(data.admin_url){
			this.admin_url = data.admin_url;
		}
		
		if(jQuery('#wp-content-media-buttons').length){
			adminFormInside.initInjectButton();
		}
				
	},
	
	initInjectButton: function(){
		
		jQuery("#wp-content-media-buttons").append(
			'<a href="#" id="insert-form-button" class="button insert-media add_media" data-editor="content" title="Add Form"><span class="wp-media-buttons-icon"></span> Add Form</a>'
		);
		
		jQuery('#insert-form-button').on('click', function(){
			
			adminFormInside.showInjectPopUp();
			
			return false;
			
		});
		
	},
	
	showInjectPopUp: function(){
				
		var popup = window.open(this.admin_url + 'admin-ajax.php?action=tidio_form_popup_insert_post', "popup-inject", "status=1,width=800,height=450");
				
		popup.focus();
		
	}
	
};