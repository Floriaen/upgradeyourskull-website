<?php
	//error_reporting(E_ALL); 
 	//ini_set("display_errors", 1);
	if (isset($_REQUEST['t'])) {
		$sprite = null;
		switch ($_REQUEST['t']) {
			case 'dyzebc0':
				$sprite = 'tetris.png';
			break;
			case 'cx5ntda':
				$sprite = 'halloween.png';				
			break;
			case 'axjwtbg':
				$sprite = 'adventure.png';				
			break;
			case 'nhsfcb5':
				$sprite = 'wasntmywar.png';				
			break;
			case 'zm46cf0':
				$sprite = 'kawai.png';				
			break;
			case 'xmas':
				$sprite = 'xmas.png';				
			break;
			case 'ao2yckw':
			default:
				$sprite = '../thefall.png';			
			break;
		}
		header('Content-type: image/png');
		chdir(dirname(__FILE__));
		echo file_get_contents($sprite);
	}
	

?>