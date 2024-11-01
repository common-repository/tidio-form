<?php

class TidioFormOptions {
	
	public static $formData;
	public static $formSettings;
	

	public static function getOptions(){
		
		if(self::$formSettings){
			return self::$formSettings;
		}

		$formSettings = get_option('tidio_form_settings');
		
		if(empty($formSettings)){
			
			$formSettings = array(
				'email' => get_option('admin_email'),
				'send_method' => 'tidio-api'
			);
			
			$formSettings = json_encode($formSettings);
			
			get_option('tidio_form_settings', $formSettings);
			
		}
		
		self::$formSettings = json_decode($formSettings, true);
		
		return self::$formSettings;

	}
	
	public static function getFormData(){
		
		if(self::$formData){
			return self::$formData;
		}
		
		$formData = get_option('tidio_form_data');
		
		if(empty($formData)){
			$formData = array();
		} else {
			self::$formData = json_decode($formData, true);
		}
		
		return self::$formData;
	}
	
	//
	
	public static function getFormOnce($formId){
		
        $formData = get_option('tidio_form_data');

        if (!$formData) {
            return null;
        }

        $formData = json_decode($formData, true);

        $exportData = array(
            'data' => null,
            'elements' => array()
        );
        if (is_array($formData['container'])) {
            foreach ($formData['container'] as $e) {
                if ($formId == $e['id']) {
                    $exportData['data'] = $e;
                }
            }
        }

        if (!$exportData['data']) {
            return null;
        }

        foreach ($formData['element'] as $e) {
            if ($formId == $e['container_id']) {
                $exportData['elements'][] = $e;
            }
        }
		
		usort($exportData['elements'], 'TidioFormOptions::getFormOnceSort');
		
        return $exportData;
		
	}
	
	public static function getFormOnceSort($a, $b){
		
		return $a['position'] * 1 > $b['position'] * 1;
		
	}
	
	// Register
	
	public static function register(){
		
		if(get_option('tidio_form_key')){
				
			return false;
		}
		
		$url = 'http://www.tidioelements.com/apiExternalPlugin/registerPlugin?'.http_build_query(array(
			'siteUrl' => site_url(),
			'pluginType' => 'form',
			'_ip' => $_SERVER['REMOTE_ADDR']
		));
		
		//
		
		$key = '-1';
		
		//
				
		$content = self::getContent($url);
		
		
		if($content){
		
			$content = json_decode($content, true);
			
			if(isset($content['value'])){
				
				$key = '1';
				
			}
		
		}
		
		update_option('tidio_form_key', $key);
			
	}
	
	private static function getContent($url){

		$ch = curl_init();
	
		curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)');
	
		$data = curl_exec($ch);
		curl_close($ch);
		
		return $data;

	}

		
}