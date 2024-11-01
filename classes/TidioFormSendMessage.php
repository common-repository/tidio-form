<?php

class TidioFormSendMessage {

	public function send($mailData) {

		$mailContent = $this->mailContent($mailData['content']);
		
		try {
			wp_mail($mailData['to'], $mailData['subject'], $mailContent);
		} catch(Exception $e){	
			return false;
		}
		
		return true;
	}

	private function mailContent($data) {
		
		$html = '';

		if(!empty($data['header'])){
			$html .= '<h2>' . get_bloginfo('name') . ' / New Message</h2>';
		}
		
		if(!empty($data['fields'])){
			
			$arr = $data['fields'];
			
			foreach ($arr as $e) {
	
				if ($e[0] == 'text') {
	
					$html .= '<p>' . $e[1] . '</p>';
				} else if ($e[0] == 'header') {
	
					$html .= '<h3>' . $e[1] . '</h3>';
				} else if ($e[0] == 'column') {
	
					$html .=
					'<p>' .
						'<span style="display: inline-block; width: 150px;"><strong>' . $e[1] . '</strong></span>' .
						'<span style="display: inline-block;">' . $e[2] . '</span>' .
					'</p>';
				}
			}
		
		}


		$htmlStructure = file_get_contents(__DIR__ . '/../media/html/mail-structure.html');

		$html = str_replace('{{content}}', $html, $htmlStructure);

		return $html;
	}

}