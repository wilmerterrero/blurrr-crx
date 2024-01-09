const { createWriteStream } = require('fs');
const archiver = require('archiver');

const output = createWriteStream(`${__dirname}/../dist.zip`);
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

archive.directory('dist/', false);

archive.finalize();