<?php

if(empty($_POST['saveData'])){
	
	return $this->response(false, 'ERR_PASSED_DATA');
	
}

$saveData = urldecode($_POST['saveData']);

update_option('tidio_form_settings', $saveData);

//

return $this->response(true, 'SAVED');
