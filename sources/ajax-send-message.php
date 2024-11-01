<?php

require __DIR__ . '/../classes/TidioFormSendMessage.php';

$tidioFormSendMessage = new TidioFormSendMessage();

if (empty($_POST['formData'])) {

	$this->response(false, 'ERR_PASSED_DATA');
}

$formData = $_POST['formData'];

$formData = urldecode($formData);

@$formData = json_decode($formData, true);

if (!$formData) {

	$this->response(false, 'ERR_PASSED_DATA');
}

$status = $tidioFormSendMessage->send(array(
	'to' => $formData['mailTo'][0],
	'subject' => 'New message from your site!',
	'content' => array(
		'header' => 'New message from your site!',
		'fields' => $formData['mailContent']
	)
));

if($status){
	
	$this->response(true, true);
	
}

$this->response(false, false);

