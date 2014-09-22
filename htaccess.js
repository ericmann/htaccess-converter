var fs = require( 'fs' ),
	csv = require( 'fast-csv' ),
	stream,
	output;

/**
 * Read a line from the CSV and write out the .htaccess line
 *
 * @param {array} row
 */
function readLine( row ) {
	var oldPath = row[0],
		newPath = row[1];

	// If either the source or target URL are empty, ignore it
	if ( '' === oldPath || '' === newPath ) {
		return;
	}

	output.write( 'RedirectRule\t^' + oldPath + '$\t' + newPath + '\t[R=301,L,NC]\r\n' );
}

/**
 * Close our output file so we clean up the system and release any potential file locks
 */
function closeFile() {
	output.end();
}

stream = fs.createReadStream( 'source.csv' );
output = fs.createWriteStream( 'output.htaccess' );

var csvStream = csv.parse()
	.on( 'data', readLine )
	.on( 'end', closeFile );

stream.pipe( csvStream );