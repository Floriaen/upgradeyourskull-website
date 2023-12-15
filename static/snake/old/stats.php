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
	var_export($_REQUEST);
	$output = '';
	if (isset($_REQUEST['pattern'])) {
		if ($_REQUEST['pattern'] == 'save') {
			// http://floriaen.fr/snake/working/stats.php?itemFound=10&eatenCarrots=100&startTime=00000000&endDate=startTime=00000000
			if (isset($_REQUEST['itemsFound']) && isset($_REQUEST['eatenCarrots']) && isset($_REQUEST['startTime']) && isset($_REQUEST['endTime'])) {
				$sql = 'INSERT INTO snake_stats (items_found, eaten_carrots, game_start_time, game_end_time, ninja_ip, creation_date) 
						VALUES (
							'.(int) $_REQUEST['itemsFound'].',
							'.(int) $_REQUEST['eatenCarrots'].',
							FROM_UNIXTIME('.(int) $_REQUEST['startTime'].'),
							FROM_UNIXTIME('.(int) $_REQUEST['endTime'].'),
							\''.md5($_SERVER['REMOTE_ADDR']).'\',
							NOW()
						)';
						echo $sql;
				$result = $db->query( $sql );
				if( $result !== FALSE ) {
					$output = '';
				}				
			}
		}
	}
	echo json_encode($output);

?>