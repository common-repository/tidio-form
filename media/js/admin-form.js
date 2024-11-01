var adminForm = {
	
	container_list: {},
	
	element_list: {},
	
	settings_data: {},
	
	_id: 0,
	
	popup_mode: false,
	
	save_func: null,
	
	//
	
	create: function(data){
		
		if(jQuery('body').hasClass('popup-mode')){
			this.popup_mode = true;
		}
		
		//
		
		this.showSection('list');
		
		//
		
		this.initContainer();

		this.initDetails();
		
		this.initSettings();
		
		//
		
		this.containerController();
		
		//
		
		if(data.replay_data){	
			this.replayData(data.replay_data);
		}
		
		if(data.settings_data){
			this.replaySettingsData(data.settings_data);
		}
		
	},
	
	// Settings
	
	initSettings: function(){
		
		
		//
		
		jQuery(document).delegate('#form-settings-link', 'click', function(){
			
			jQuery("#form-settings").slideToggle('fast');
			
			return false;
			
		});
		
		jQuery("#form-settings").on('submit', function(){
			
			var $form = jQuery(this),
				$submit = jQuery("#form-settings-submit");
			
			$form.addClass('disable');
			
			$submit.text('saving...');
			
			adminForm.saveSettings(function(){
				
				$form.removeClass('disable');
				
				$submit.text('save');
				
			});
			
			return false;
			
		});
		
	},
	
	saveSettings: function(_func){
		
		this.settings_data = this.exportSettings();
		
		//
		
		jQuery.ajax({
			url: app.admin_url + 'admin-ajax.php?action=tidio_form_save_settings',
			data: {
				saveData: encodeURIComponent(JSON.stringify(this.settings_data))
			},
			dataType: 'JSON',
			type: 'POST'
		}).done(function(){
			
			_func();
			
		});
		
		
	},
	
	exportSettings: function(){
		
		var export_data = {
			email: jQuery("#settings-email").val(),
			send_method: jQuery("#settings-send-method").val()
		};
		
		return export_data;
		
	},
	
	replaySettingsData: function(settings_data){
				
		this.settings_data = settings_data;
		
		//
		
		jQuery("#settings-email").val(settings_data['email']);

		jQuery("#settings-send-method option[value='" + settings_data['send_method'] + "']").prop('selected', true);
		
	},
		
	
	// Container List
	
	initContainer: function(){
		
		jQuery("#form-btn-add").on('click', function(){
			
			var id = adminForm.containerAdd();
			
			adminForm.containerAddView(id);
			
			adminForm.saveChangesAuto();
			
			return false;
			
		});
		
		jQuery("#form-list").delegate('.delete-link', 'click', function(){
			
			var container_id = jQuery(this).closest('.e').attr('data-id');
			
			adminForm.containerDeleteService(container_id);
			
			adminForm.saveChangesAuto();
			
			return false;
			
		}).delegate('.edit-link', 'click', function(){
			
			var container_id = jQuery(this).closest('.e').attr('data-id');
			
			adminForm.containerShowDetails(container_id);
			
			return false;
			
		}).delegate('.input-name', 'blur', function(){
			
			var container_id = jQuery(this).closest('.e').attr('data-id');
			
			adminForm.containerUpdate(container_id, {
				name: this.value
			});
						
			return false;
			
		}).delegate('.form-select-link', 'click', function(){

			var container_id = jQuery(this).closest('.e').attr('data-id');
			
			adminForm.selectFormPopUp(container_id);

			return false;
			
		});
		
		
	},
	
	// Element Details
	
	initDetails: function(){
		
		jQuery("#elements-btn-add").on('click', function(){
				
			var element_id = adminForm.elementAdd();
			
			adminForm.elementAddView(element_id, true);		
			
			adminForm.elementUpdatePosition();
			
			return false;
			
		});
		
		jQuery("#elements-btn-back").on('click', function(){
			
			adminForm.showSection('list');
			
			return false;
			
		});
		
		jQuery("#elements-btn-add-on-page").on('click', function(){
			
			adminForm.selectFormPopUp();
			
			return false;
			
		});
		
		//
		
		jQuery("#elements-list").delegate('.icon-delete', 'click', function(){
			
			return false;
			
		}).delegate('.field-required-status', 'click', function(){

			var element_id = jQuery(this).closest('.e').attr('data-id');
			
			adminForm.elementUpdate(element_id, {
				required: this.checked
			});
			
			adminForm.saveChangesAuto();
			
		}).delegate('.field-type-select', 'change', function(){

			var $this = jQuery(this),
				element_id = $this.closest('.e').attr('data-id');
			
			adminForm.elementUpdate(element_id, {
				type: this.value
			});
			
			//
			
			if(this.value=='dropdown'){
				
				$this.closest('.e').addClass('type-dropdown');
				
			} else {
				
				$this.closest('.e').removeClass('type-dropdown');
								
			}
			
			//
			
			adminForm.saveChangesAuto();
			

		}).delegate('.field-name-input', 'blur', function(){
			
			var element_id = jQuery(this).closest('.e').attr('data-id');
			
			adminForm.elementUpdate(element_id, {
				name: this.value
			});
			
			adminForm.saveChangesAuto();
			
		}).delegate('.field-link-remove', 'click', function(){
			
			var element_id = jQuery(this).closest('.e').attr('data-id');
			
			adminForm.elementDelete(element_id);
			
			jQuery("#e-field-" + element_id).slideUp('fast', function(){
				
				adminForm.elementsController();
				
			});
			
			return false;
			
		});
		
		//
		
		jQuery("#elements-list").sortable({
			handle: '.icon-move',
			axis: 'y'
		}).on('sortstop', function(){
			
			adminForm.elementUpdatePosition();
			
		});
				
	},
	
	// PopUp
		
	selectFormPopUp: function(form_id){
		
		if(typeof form_id=='undefined' || form_id===null){
			form_id = this.current_container_id;
		}
		
		if(!form_id){
			return false;
		}
		
		if(this.popup_mode){
		
			window.opener.adminFormOnSelect(form_id);
					
			window.close();
		
		} else {
			
			var popup_url = app.plugin_url + 'popup-insert-help.php?formId=' + form_id;
			
			var popup = window.open(popup_url, '', "location=1,status=1,scrollbars=1,width=500,height=450");
			
			popup.focus();
						
		}
		
	},

	
	// Sections
	
	showSection: function(id){
		
		var header_text = '';
		
		if(id=='list'){
			header_text = '<strong>Form</strong> Management';
		}

		if(id=='details'){
			
			// var form_info = adminForm.containerDataGet(this.current_container_id);
			
			header_text = '<strong>Form</strong> Details';
		}
		
		header_text += ' <a href="#" id="form-settings-link">settings</a>';
		
		jQuery("#wrap-header").html(header_text);
		
		//
		
		jQuery("#wrap > .section-content.active").hide().removeClass('active');
		
		jQuery("#section-" + id).show().addClass('active');
	},
	
	/*
	** Containers
	*/
	
	containerAdd: function(data){
		
		var default_data = {
			id: this._renderId(),
			name: ''
		};
		
		data = jQuery.extend(default_data, data);
		
		this.container_list[data.id] = data;
		
		return data.id;
		
	},
	
	containerAddView: function(container_id){
		
		var container_data = this.containerDataGet(container_id);		
		
		jQuery("#form-list").append(
			'<div id="form-e-' + container_data.id + '" class="e" data-id="' + container_data.id + '">' + 
				'<a href="#" class="form-select-link">add to page</a>' + 
				'<div class="top"><a href="#" class="edit-link">edit</a><span class="seperator">|</span><a href="#" class="delete-link">delete</a></div>' + 
				'<div class="footer"><input type="text" class="input-name" placeholder="Form name..." value="' + container_data.name + '" /></div>' + 
			'</div>'
		);
		
		adminForm.containerController();
		
	},
	
	containerDeleteService: function(container_id){
		
		// db
		
		if(!this.container_list[container_id]){	
			return false;
		}
			
		delete this.container_list[container_id];
		
		// view
		
		jQuery("#form-list .e[data-id='" + container_id + "']").remove();
		
		//
		
		for(i in this.element_list){
			var e = this.element_list[i];
			if(e.container_id==container_id){
				delete this.element_list[i];
			}
		}
		
		// controller
		
		this.containerController();
		
	},
	
	
	containerDataGet: function(id){
		
		if(!this.container_list[id]){
			return false;
		}
		
		return this.container_list[id];
		
	},
	
	containerUpdate: function(id, data_update){

		if(!this.container_list[id]){
			return false;
		}
		
		this.container_list[id] = jQuery.extend(this.container_list[id], data_update);

	},
	
	///
	
	containerLengthIndex: function(){
		
		return Object.keys(this.container_list).length;
		
	},
	
	containerController: function(){
		
		var index_length = this.containerLengthIndex();
		
		//
		
		jQuery("#form-list,#form-list-empty").hide();
		
		//
		
		if(!index_length){
			
			jQuery("#form-list-empty").show();
			
		} else {
			
			jQuery("#form-list").show();
			
		}
		
		jQuery("#elements-list").sortable('refresh');
		
	},
	
	/* go to details */
	
	containerShowDetails: function(container_id){
	
		this.current_container_id = container_id;
			
		this.showSection('details')
				
		this.elementsController();
		
		//
				
		jQuery("#elements-list").html('');
		
		var elements = this.elementsGet();
		
		for(i in elements){
			
			var e = elements[i];
			
			adminForm.elementAddView(e.id);
			
		}
	},
	
	/*
	** Elements
	*/
	
	elementUpdatePosition: function(){
		
		var n = 0;
		
		jQuery("#elements-list > .e").each(function(){
			
			var this_id = jQuery(this).attr('data-id');
			
			adminForm.elementUpdate(this_id, {
				position: n
			});
			
			n++;
			
		});
		
		adminForm.saveChangesAuto();
		
	},
	
	elementAddView: function(element_id, animate){
		
		var element_data = this.elementDataGet(element_id);
			
		var element_html = Mustache.render(document.getElementById('template-form-element').innerHTML, {
			id: element_id,
			
			name: element_data.name
		});
			
		jQuery("#elements-list").append(element_html);
		
		var $this = jQuery("#elements-list").children().last();
		
		if(animate){
				
			$this.hide().slideDown('fast');
			
		}
		
		//
		
		if(element_data.required){
			$this.find('.field-required-status').prop('checked', true);
		}

		if(element_data.type){
			$this.find(".field-type-select option[value='" + element_data.type + "']").prop('selected', true);
		}
		
		//
		
		this.elementsController();	
		
	},
	
	elementAdd: function(data){

		var default_data = {
			id: this._renderId(),
			container_id: this.current_container_id,
			
			name: '',
			type: 'text',
			required: false,
			position: 0
		};
		
		data = jQuery.extend(default_data, data);
		
		this.element_list[data.id] = data;
		
		return data.id;

	},
	
	elementUpdate: function(id, update_data){
		
		if(!this.element_list[id]){	
			return false;
		}
		
		this.element_list[id] = jQuery.extend(this.element_list[id], update_data);
				
		return true;
		
	},
	
	elementDelete: function(id){
		
		if(!this.element_list[id]){	
			return false;
		}
		
		delete this.element_list[id];
		
		return true;
		
	},
	
	elementDataGet: function(id){
		
		if(!this.element_list[id]){	
			return false;
		}
		
		return this.element_list[id];
		
	},
	
	elementDeleteService: function(element_id){
		
		jQuery("#elements-list .e[data-id=" + element_id + "]").remove();
		
		this.elementDelete(element_id);
		
		this.elementsController();
		
	},
	
	//
	
	elementsGet: function(container_id){
		
		if(!container_id){
			container_id = this.current_container_id;
		}
		
		var arr = [];
		
		for(i in this.element_list){
			
			var e = this.element_list[i];
			
			if(e.container_id==container_id){
				
				arr.push(e);
				
			}
			
		}
		
		arr.sort(function(a, b){
			
			return a.position-b.position;
			
		});
		
		return arr;
		
	},
	
	elementsController: function(){
		
		var elements = this.elementsGet();
		
		//
		
		jQuery("#elements-list-empty,#elements-list").hide();
		
		if(!elements.length){
			jQuery("#elements-list-empty").show();
		} else {
			jQuery("#elements-list").show();
		}
		
	},
	
	
	/*
	** Data Process
	*/
	
	saveChangesAuto: function(){
				
		if(this.save_func){
			clearTimeout(this.save_func);
		}
		
		this.save_func = setTimeout(function(){
		
			adminForm.saveChanges();
		
		}, 500);
		
	},
	
	saveChanges: function(){
		
		adminForm.loadingStatus('saving...');
		
		console.log('saving...');
		
		this.saveChangesRequest(function(){
			
			adminForm.loadingStatusHide();
			
		});
		
	},
	
	saveChangesRequest: function(_func){
		
		if(typeof _func!='function')
			_func = function(){};
		
		//
		
		var export_data = this.exportData();
		
		export_data = JSON.stringify(export_data);
		
		//
		
		jQuery.ajax({
			url: app.admin_url + 'admin-ajax.php?action=tidio_form_save_data',
			data: {
				saveData: encodeURIComponent(export_data)
			},
			dataType: 'JSON',
			type: 'POST'
		}).done(function(){
			
			_func();
			
		});
		
	},
		
	exportData: function(){
		
		var data = {
			container: [],
			element: []
		};
		
		for(i in this.container_list){
			var e = this.container_list[i];
			data.container.push(e);
		}

		for(i in this.element_list){
			var e = this.element_list[i];
			data.element.push(e);
		}
		
		return data;

	},
	
	replayData: function(data){
		
		console.log('replayData', data);
						
		if(!data.container || !data.element){
			return false;
		}
				
		for(i in data.container){
			var e = data.container[i];		
			this.container_list[e.id] = e;	
			adminForm.containerAddView(e.id);
		}
		
		adminForm.containerController();
		
		//

		for(i in data.element){
			var e = data.element[i];
			this.element_list[e.id] = e;
		}
				
	},

	/*
	** Loading
	*/

	loadingStatus: function(text){
		
		jQuery("#fixed-loading-bottom").fadeIn('fast');
		
		jQuery("#fixed-loading-bottom .text").text(text);
		
	},
	
	loadingStatusHide: function(){
		
		jQuery("#fixed-loading-bottom").fadeOut();
		
	},
	
	/*
	** Helpers
	*/
	
	_renderId: function(){
				
		return this._generateHash(32);
		
	},
	
	_generateHash: function(length){

		if (!length)
			length = 32;
		
		var string = '',
			hash_arr = 'abcdefghijklmnopqrstuvwxyz0123456789';
		
		for (var i = 0; i < length; ++i) {
			var word_i = this._rand(0, hash_arr.length - 1);
			string += hash_arr[word_i]
		}
		return string;

	},
	
	_rand: function(min, max){
		var argc = arguments.length;
		if (argc === 0) {
			min = 0;
			max = 2147483647;
		} else if (argc === 1) {
			throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
		}
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
};