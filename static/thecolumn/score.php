<?php
	ini_set('display_errors', 1);
	error_reporting(E_ALL);

	header('Content-type: application/json');
	$cgiDir = '/homez.379/floriaen/core/';

	// 1 - GET BACK DATA:

	$filename = null;
	$rootDir = getcwd();

	// load required classes:
	chdir($cgiDir);
	require_once('config.php');
	require_once('class/service/singleDatabase.class.php');
	chdir($rootDir);

	// open bdd access
	$db = new SingleDatabase(
		Database::$HOST,
		Database::$PORT,
		Database::$DATABASE,
		Database::$USER,
		Database::$PASSWORD
	);
	//var_export($_REQUEST);
	$output = '';
	if (isset($_REQUEST['pattern'])) {
		if ($_REQUEST['pattern'] == 'addScore') {
			// http://floriaen.fr/column/score.php?pattern=addScore&gain=3.10&height=100.10&name=Florian
			if (isset($_REQUEST['gain']) && isset($_REQUEST['height']) && isset($_REQUEST['name'])) {
				$from = 'unknow';
				if (isset($_REQUEST['from']) && !empty($_REQUEST['from'])) {
					$from = $_REQUEST['from'];
				}

				$sql = 'INSERT INTO column_score (gain, height, name, ninja_ip, `from`, creation_date) 
						VALUES (
							'.$_REQUEST['gain'].',
							'.$_REQUEST['height'].',
							\''.mysql_escape_string($_REQUEST['name']).'\',
							\''.md5($_SERVER['REMOTE_ADDR']).'\',
							\''.mysql_escape_string($from).'\',
							NOW()
						)';
						echo $sql;
				$result = $db->query($sql);
				if( $result !== FALSE ) {
					$output = '';
				}				
			}
		} else
		if ($_REQUEST['pattern'] == 'getHighScore') {
			

			/*

			
*/

			// http://floriaen.fr/column/score.php?pattern=getHighScore&limit=5
			if (isset($_REQUEST['limit']) && is_numeric($_REQUEST['limit'])) {
				$limit = $_REQUEST['limit'];
				$output = array();
				$sql = 'SELECT MAX(gain) AS gain, name, `from` FROM column_score 
						GROUP BY name, `from` 
						ORDER BY MAX(gain) DESC LIMIT '.$limit;
				$result = $db->query($sql);
				if ($result) {
					while ($row = mysql_fetch_assoc($result)) {
						$output[] = $row;
					}
				}
			}
		}
	}
	echo json_encode($output);

?>