<?php

if(empty($_POST['saveData'])){
	
	return $this->response(false, 'ERR_PASSED_DATA');
	
}

$saveData = $_POST['saveData'];

$saveData = urldecode($saveData);

//

update_option('tidio_form_data', $saveData);

//

return $this->response(true, 'SAVED');
