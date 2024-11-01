<?php

wp_register_style('tidio-form-css', plugins_url('media/css/app-options.css', __FILE__) );

wp_enqueue_style('tidio-form-css' );

//

TidioFormOptions::register();

//

$formSettings = TidioFormOptions::getOptions();

$formData = TidioFormOptions::getFormData();

//

wp_enqueue_script('tidio-form-jquery-ui', TFORM_PLUGIN_URL.'media/js/jquery-ui.js', array( 'jquery' ));
wp_enqueue_script('tidio-form-minicolors', TFORM_PLUGIN_URL.'media/js/plugin-minicolors.js', array( 'jquery' ));
wp_enqueue_script('tidio-form-admin-form', TFORM_PLUGIN_URL.'media/js/admin-form.js', array( 'jquery' ));
wp_enqueue_script('tidio-form-mustache', TFORM_PLUGIN_URL.'media/js/mustache.js', array( 'jquery' ));

?>

<div class="wrap" id="wrap">
	
   
    
    <div id="powered-by">
        <a href="http://www.tidioelements.com/?utm_source=wordpress_gallery&utm_medium=inside_form&utm_campaign=wordpress_plugin" target="_blank"></a>
        <div class="left">
            See how <strong>better your website</strong> could <strong>look</strong> like!
        </div>
        <div id="tidio-top-logo"></div>
        <div class="clearfix"></div>
        <form action="http://www.tidioelements.com/editor-test" method="get" target="_blank">
            <input type="text" name="url" placeholder="http:/www.yourwebsite.com" value="<?php echo site_url(); ?>">
            <input type="hidden" name="utm_source" value="wordpress_form">
            <input type="hidden" name="utm_medium" value="inside_form">
            <input type="hidden" name="utm_campaign" value="wordpress_plugin">
            <input type="submit" name="submit" value="OK">
        </form>
    </div>    
    
     <h2 id="wrap-header"></h2>
    
    <!-- Form Settings -->
    
    <form id="form-settings">
    	
        <div class="e">
        	<label for="settings-email">Email:</label>
            <input type="text" id="settings-email" />
        </div>

        <div class="e">
        	<label for="settings-send-method">Send method:</label>
            <select id="settings-send-method">
            	<option value="server">This Server</option>
            	<option value="tidio-api">Tidio Elements API</option>
            </select>
        </div>
        
		<div class="e-submit">
         	<button type="submit" class="btn primary" id="form-settings-submit">save</button>
		</div>
        
    </form>
    
    <!-- List -->
    
    <div id="section-list" class="section-content active">
    	
        <div id="form-list" class="elements-list clearfix"></div>
        
        <div id="form-list-empty">
        	<div class="alert alert-info">No elements have been added yet.</div>
        </div>
        	
        <hr />
        
        <a href="#" class="btn primary" id="form-btn-add">add form</a>
        
    </div>
    
    <!-- Details -->
    
    <div id="section-details" class="section-content">

        <div id="elements-list" class="plugin-form-fields clearfix"></div>
        
        <div id="elements-list-empty">
        	<div class="alert alert-info">No elements have been added yet.</div>
        </div>
        	
        <hr />
        
        <a href="#" class="btn primary" id="elements-btn-add">add element</a>
        <a href="#" class="btn" id="elements-btn-add-on-page">add on page</a>
        <a href="#" class="btn" id="elements-btn-back">back</a>

    </div>
    
    
</div>

<!-- Fixed Loading Bottom -->

<div id="fixed-loading-bottom">
	<img src="<?php echo TFORM_PLUGIN_URL ?>/media/img/ajax-loader.gif">
    <span class="text">loading...</span>
    <div style="clear: both;"></div>
</div>

<!-- Script -->

<script type="text/template" id="template-form-element">
<div class="e" id="e-field-{{id}}" data-id="{{id}}" style="">
	<div class="e-type">
		<select class="field-type-select">
			<option value="text">Text</option>
			<option value="dropdown" style="display: none;">Dropdown</option>
			<option value="long-text">Textarea</option>
			<option value="email">Email</option>
			<option value="phone-number">Phone number</option>
			<option value="number">Number</option>
		</select>
	</div>
	<div class="e-name">
		<input type="text" placeholder="Type name..." value="{{name}}" class="field-name-input">
	</div>
	<div class="e-manage">
		<label class="field-required-label">
		<input type="checkbox" class="field-required-status">
		<span class="text">*</span>
		</label>
		<i class="icon-move"></i>
		<i class="icon-delete field-link-remove"></i>
	</div>
	<div class="clear"></div>
	<div class="e-children">
		<textarea class="field-children-textarea"></textarea>
	</div>
</div>
</script>

<script>

var app = {
	plugin_url: '<?php echo TFORM_PLUGIN_URL ?>',
	admin_url: '<?php echo admin_url();?>'
};

jQuery(document).ready(function(){

	adminForm.create({settings_data: <?php echo json_encode($formSettings) ?>,replay_data: <?php echo json_encode($formData) ?>});

});

</script>
