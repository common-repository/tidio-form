var serviceForm = {
	
	settings_data: null,
	
	source_url: null,
	
	create: function(data){
		
		if(data.settings_data){
			this.settings_data = data.settings_data;
		}
		
		if(data.source_url){
			this.source_url = data.source_url;
		}
		
		this.initForms();
		
	},
	
	initForms: function(){
		
		jQuery('.tidio-form').on('submit', function(){
			
			var $this = jQuery(this),
				submit_err = serviceForm.validForm($this);
			
			if(!submit_err){
				serviceForm.submitForm($this);
				this.reset();
				return false;
			}
			
			alert(submit_err);
						
			return false;
			
		});
		
	},
	
	submitForm: function($this){
		
		if(!this.settings_data['email'] || this.settings_data['email'].indexOf('@')==-1){
			return false;
		}
		
		//
		
		var form_data = this.getDataForm($this);
		
		//
		
		var api_data = {
			mailSubject: 'New Message from "' + location.host + '"',
			mailTo: [this.settings_data['email'], ''],
			mailHeader: 'New message from "' + location.host + '"',
			mailContent: form_data
		};
		
		//
		
		if(serviceForm.settings_data['send_method']=='tidio-api'){
		
			this.apiSendMail(api_data);
		
		} else {
		
			this.serverSendMail(api_data);
		
		}
		
		//
		
		alert('Your message was sent successfully');

		
	},
	
	getDataForm: function($this){
		
		var form_data = [];
		
		$this.find('.input').each(function(){
			
			form_data.push([
				'column', 
				this.getAttribute('placeholder'),
				this.value
			]);
			
		});
		
		return form_data;
		
	},
	
	validForm: function($this){
				
		var form_err = null;
		
		$this.find('.input').each(function(){
			
			var this_type = this.getAttribute('data-type'),
				this_required = this.getAttribute('data-required'),
				this_value = this.value;
				
			if(this_required=='0'){
				return true;
			}
			
			if(!this_value){
				form_err = 'You have not filled in all the fields!';
			
			} else if(this_type=='email'){
				
				if(this_value.indexOf('@')==-1 || this_value.indexOf('.')==-1){
					
					form_err = 'The email address you\'ve given is not valid!';
					
				}
				
			}
			
			
		});
				
		return form_err;
		
	},
	
	/* Tidio Elements Mail Server API */
	
	serverSendMail: function(form_data){
		
		var form_data = encodeURI(JSON.stringify(form_data));
		
		jQuery.ajax({
			url: this.source_url + 'wp-admin/admin-ajax.php?action=tidio_form_send_message',
			type: 'POST',
			data: {
				formData: form_data
			},
			dataType: 'JSON'
		}).done(function(){
			
		});
						
	},
	
	/* Tidio Elements Mail API */
	
	apiSendMail: function(send_data, _func, async){
		
		if(typeof _func!='function') _func = function(){};
		
		//
		
		if(!send_data)
			
			return false;

		if(typeof async!=='boolean')
			
			async = true;

		//
		
		send_data = this.prepareMailData(send_data);
						
		var ajax_url = '//www.tidioelements.com/api/sendMail';
				
		//
				
		jQuery.ajax({
			url: ajax_url,
			type: 'POST',
			data: send_data,
			dataType: 'json',
			success: function(data){
				
				_func(true, data);
				
			},
			error: function(){
				
				_func(false);
				
			},
			async: async
		});
						
		
	},
	
	prepareMailData: function(send_data){

		var send_data_default = {
			mailSubject: '',
			mailFrom: [],
			mailTo: [],
			mailHeader: '',
			mailContent: ''
		};
					
		send_data = jQuery.extend(send_data_default, send_data);
			
		//
			
		send_data['mailFrom'] = JSON.stringify(send_data['mailFrom']);

		send_data['mailTo'] = JSON.stringify(send_data['mailTo']);

		send_data['mailContent'] = JSON.stringify(send_data['mailContent']);
		
		//
		
		return send_data;

	}
	
};