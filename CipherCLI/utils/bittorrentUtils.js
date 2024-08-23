const BitTorrent = require('webtorrent');
const fs = require('fs');
const path = require('path');

/**
 * Initialize a new BitTorrent client.
 */
function createClient() {
    return new BitTorrent();
}

/**
 * Add a torrent to the client and start downloading.
 * @param {BitTorrent} client - The BitTorrent client instance.
 * @param {string} torrentPath - Path to the torrent file or magnet URI.
 * @returns {Promise} - Resolves with the torrent object when added.
 */
function addTorrent(client, torrentPath) {
    return new Promise((resolve, reject) => {
        client.add(torrentPath, (torrent) => {
            console.log(`Torrent added: ${torrent.infoHash}`);
            resolve(torrent);
        });
    });
}

/**
 * Save torrent metadata to a file.
 * @param {Object} torrent - The torrent object.
 * @param {string} outputPath - Path where metadata will be saved.
 */
function saveTorrentMetadata(torrent, outputPath) {
    const metadata = {
        infoHash: torrent.infoHash,
        name: torrent.name,
        files: torrent.files.map(file => ({
            name: file.name,
            length: file.length
        }))
    };

    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
}

/**
 * Download a specific file from a torrent.
 * @param {BitTorrent} client - The BitTorrent client instance.
 * @param {string} infoHash - The info hash of the torrent.
 * @param {string} fileName - The name of the file to download.
 * @param {string} outputDir - Directory to save the downloaded file.
 * @returns {Promise} - Resolves when the file is downloaded.
 */
async function downloadFile(client, infoHash, fileName, outputDir) {
    return new Promise((resolve, reject) => {
        const torrent = client.torrents.find(t => t.infoHash === infoHash);

        if (!torrent) {
            return reject(new Error('Torrent not found'));
        }

        const file = torrent.files.find(f => f.name === fileName);

        if (!file) {
            return reject(new Error('File not found in torrent'));
        }

        file.getBuffer((err, buffer) => {
            if (err) {
                return reject(err);
            }

            const filePath = path.join(outputDir, fileName);
            fs.writeFileSync(filePath, buffer);
            console.log(`File downloaded: ${filePath}`);
            resolve(filePath);
        });
    });
}

module.exports = {
    createClient,
    addTorrent,
    saveTorrentMetadata,
    downloadFile
};
