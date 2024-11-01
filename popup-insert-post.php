<?php define('POPUP_MODE', true); ?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Add Form</title>
		<link rel="stylesheet" href="<?php echo TFORM_PLUGIN_URL ?>media/css/popup-base.css">
		<link rel="stylesheet" href="<?php echo TFORM_PLUGIN_URL ?>media/css/app-options.css">
		<script src="<?php echo site_url('wp-includes/js/jquery/jquery.js'); ?>"></script>
		<script src="<?php echo TFORM_PLUGIN_URL ?>media/js/jquery-ui.js"></script>
		<script src="<?php echo TFORM_PLUGIN_URL ?>media/js/plugin-minicolors.js"></script>
		<script src="<?php echo TFORM_PLUGIN_URL ?>media/js/admin-form.js"></script>
		<script src="<?php echo TFORM_PLUGIN_URL ?>media/js/mustache.js"></script>
	</head>

	<body class="popup-mode">

		<?php require __DIR__ . '/options.php'; ?>

	</body>
</html>
