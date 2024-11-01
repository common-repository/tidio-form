<?php
if (empty($_GET['formId'])) {
	$_GET['formId'] = '';
}
$formId = htmlentities($_GET['formId']);
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>PopUp</title>
		<link rel="stylesheet" href="./media/css/popup-base.css">

		<style>
			body {
				width: 100%;
			}

			pre {
				word-break: break-word; width: 100%;
			}
		</style>
	</head>
	<body>
		<h3>Add a form on page</h3>
		<p>
			<strong>Option #1</strong> While creating a subpage/post
		</p>
		<p>
			While you create a subpage/post click the "Add Form" button to add or manage the gallery.
		</p>
		<p>
			<strong>Option #2</strong> Paste the shortcode
		</p>
		<p>
			If you want to add the form in different place than subpage/post you need to paste the following shortcode into your subpage
		<pre>&lt;?php echo do_shortcode('[tidio-gallery id="<?php echo $formId ?>" /]'); ?&gt;</pre>.
	</p>
</body>
</html>
