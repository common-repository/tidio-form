<?php

$html =
'<form class="tidio-form" id="tidio-form-'.$formData['data']['id'].'">';

foreach ($formData['elements'] as $e) {

	$html .= '<div class="tidio-form-item">';

	if ($e['type'] == 'long-text'){
		$html .= ' <textarea name="" placeholder="'.$e['name'].'" data-required="'.$e['required'].'" data-type="long-text" class="input"></textarea>';
	}
	
	if ($e['type'] == 'dropdown'){
		$html .= '<select data-required="'.$e['required'].'" data-type="dropdown" class="input"><option>'.$e['name'].'</option><option>'.$e['name'].'</option></select>';
	}
	
	if ($e['type'] == 'email'){
		$html .= ' <input name="" type="email" placeholder="'.$e['name'].'" data-required="'.$e['required'].'" data-type="email" class="input" />';
	}
	
	if ($e['type'] == 'number'){
		$html .= ' <input name="" type="number" placeholder="'.$e['name'].'" data-required="'.$e['required'].'" data-type="number" class="input"/>';
	}
	
	if ($e['type'] == 'text'){
		$html .= '<input name="" type="text" placeholder="'.$e['name'].'" data-required="'.$e['required'].'" data-type="text" class="input"/>';
	}

	$html .= '</div>';

}

$html .= '<div class="form-footer"><button type="submit" class="button-submit">Send</button></div></form>';
