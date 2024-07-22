const Theta = require('@thetalabs/theta-js');
const fs = require('fs');
const path = require('path');

const provider = new Theta.providers.HttpProvider();
const videoService = new Theta.VideoAPIService(provider);

async function uploadVideo(filePath) {
  const videoBuffer = fs.readFileSync(filePath);
  const response = await videoService.uploadVideo(videoBuffer);
  console.log('Video uploaded:', response);
}

async function streamVideo(videoId) {
  const videoUrl = await videoService.getVideoUrl(videoId);
  console.log('Stream video URL:', videoUrl);
}

const filePath = path.resolve(__dirname, 'path_to_video_file.mp4');
uploadVideo(filePath);
