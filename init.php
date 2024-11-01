<?php

/**
 * Plugin Name: Tidio Form Builder
 * Plugin URI: http://www.tidioelements.com
 * Description: Form from Tidio Elements
 * Version: 1.2
 * Author: Tidio Ltd.
 * Author URI: http://www.tidiomobile.com
 * License: GPL2
 */

class TidioForm {

	private $pageId = '';
	private $extensionUrl;
	public static $shortcodeTidioForm;

	public function __construct() {

		if (!class_exists('TidioFormOptions')) {

			require 'classes/TidioFormOptions.php';
		}

		//

		$this->constDefine();

		$this->extensionUrl = plugins_url(basename(__DIR__) . '/');

		//		

		add_action('admin_menu', array($this, 'addAdminMenuLink'));

		add_action("wp_ajax_tidio_form_upload_image", array($this, "ajaxPageUploadImage"));

		add_action("wp_ajax_tidio_form_save_data", array($this, "ajaxPageSaveData"));

		add_action("wp_ajax_tidio_form_save_settings", array($this, "ajaxPageSaveSettings"));

		add_action("wp_ajax_tidio_form_popup_insert_post", array($this, "ajaxFormInsertPostPopUp"));

		// ajax priv

		add_action("wp_ajax_tidio_form_send_message", array($this, "ajaxFormSendMessage"));

		add_action("wp_ajax_nopriv_tidio_form_send_message", array($this, "ajaxFormSendMessage"));

		//

		add_action('admin_footer', array($this, 'adminJS'));

		add_shortcode('tidio-form', array($this, 'shortcodeTidioForm'));

		//

		if (!is_admin()) {
			wp_enqueue_script('shortcode-form-js', $this->extensionUrl . 'media/js/service-form.js', array('jquery'));
			wp_enqueue_style('shortcode-form-css', plugins_url('media/css/service-form.css', __FILE__));
			add_action('wp_head', array($this, 'shortcodeTidioFormJS'));
		}
	}

	// Insert Post

	public function ajaxFormInsertPostPopUp() {

		require __DIR__ . '/popup-insert-post.php';

		exit;
	}

	// Admin JS

	public function adminJS() {

		echo '<script src="' . TFORM_PLUGIN_URL . 'media/js/admin-form-inside.js"></script>';

		echo '<script> adminFormInside.create(' . json_encode(array(
			'plugin_url' => TFORM_PLUGIN_URL,
			'admin_url' => TFORM_ADMIN_URL
		)) . '); </script>';
	}

	// Menu Positions

	public function addAdminMenuLink() {

		$optionPage = add_menu_page(
				'Form', 'Form', 'manage_options', 'tidio-form', array($this, 'addAdminPage'), plugins_url(basename(__DIR__) . '/media/img/icon.png')
		);
		$this->pageId = $optionPage;
	}

	public function addAdminPage() {
		// Set class property
		$dir = plugin_dir_path(__FILE__);
		include $dir . 'options.php';
	}

	// Ajax Pages

	public function ajaxPageUploadImage() {

		require __DIR__ . '/sources/ajax-upload-image.php';
	}

	public function ajaxPageSaveData() {

		require __DIR__ . '/sources/ajax-save-data.php';
	}

	public function ajaxPageSaveSettings() {

		require __DIR__ . '/sources/ajax-save-settings.php';
	}

	public function ajaxFormSendMessage() {

		require __DIR__ . '/sources/ajax-send-message.php';
	}

	// Shortcodes

	public function shortcodeTidioForm($attr, $content = null) {

		if (empty($attr['id'])) {
			return '';
		}

		//

		$formData = TidioFormOptions::getFormOnce($attr['id']);

		include __DIR__ . '/sources/shortcode-form.php';

		return $html;
	}

	public function shortcodeTidioFormJS() {

		$html = '';

		$html .= "<script> document.addEventListener('DOMContentLoaded', function(){ serviceForm.create(" . json_encode(array(
					'settings_data' => TidioFormOptions::getOptions(),
					'source_url' => TFORM_SITE_URL
				)) . "); }); </script>";


		echo $html;
	}

	// Const Define

	private function constDefine() {

		$siteUrl = get_site_url();

		if (substr($siteUrl, -1) != '/') {
			$siteUrl .= '/';
		}

		//

		define('TFORM_SITE_URL', $siteUrl);

		define('TFORM_ADMIN_URL', TFORM_SITE_URL . 'wp-admin/');

		define('TFORM_PLUGIN_URL', plugins_url(basename(__DIR__) . '/'));
	}

	//

	private function response($status = false, $value = null) {

		echo json_encode(array(
			'status' => $status,
			'value' => $value
		));

		exit;
	}

}

$tidioForm = new TidioForm();

