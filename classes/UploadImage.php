<?php

class UploadImage {

	private $uploadDir;
	private $uploadUrl;

	public function __construct() {

		$uploadArrData = wp_upload_dir();
		$this->uploadDir = $uploadArrData['path'];
		$this->uploadUrl = $uploadArrData['url'];
	}

	public function upload($name) {

		if (empty($_FILES[$name]))
			return false;

		$_FILE = $_FILES[$name];

		//

		$fileName = $_FILE['name'];
		$fileExtension = explode('.', $fileName);
		$fileExtension = end($fileExtension);
		$filePath = $_FILE['tmp_name'];

		$targetName = md5(microtime()) . '.' . $fileExtension;
		$targetPath = $this->uploadDir . '/' . $targetName;
		$targetUrl = $this->uploadUrl . '/' . $targetName;

		move_uploaded_file($filePath, $targetPath);

		return array(
			'filePath' => $targetPath,
			'fileName' => $targetName,
			'fileExtension' => $fileExtension,
			'fileUrl' => $targetUrl
		);
	}

	public function renderNewPath($data, $name) {

		$data['filePath'] = substr($data['filePath'], 0, -4) . '-' . $name . '.' . $data['fileExtension'];

		$data['fileUrl'] = substr($data['fileUrl'], 0, -4) . '-' . $name . '.' . $data['fileExtension'];

		$data['fileName'] = substr($data['fileName'], 0, -4) . '-' . $name . '.' . $data['fileExtension'];

		return $data;
	}

}