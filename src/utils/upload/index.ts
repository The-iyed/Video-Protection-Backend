import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { filterVideo } from './video';
import fs from 'fs';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { AppError } from '../appError';
import { HttpCode } from '../httpCode';
import path from 'path';
const multerStorage = multer.memoryStorage();
const uploadVideo = multer({
  storage: multerStorage,
  fileFilter: filterVideo,
});

export const upload = uploadVideo.single('video');

export const uploadVideoToFS = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const videoBuffer = req.file?.buffer;
  const segmentOutputFolder = 'public/video';
  if (!fs.existsSync(segmentOutputFolder)) {
    fs.mkdirSync(segmentOutputFolder, { recursive: true });
  }
  if (!ffmpegPath || !videoBuffer) throw new AppError('invalid file path', HttpCode.BAD_REQUEST);
  const outputFolder = 'public/video';


  console.log(req.file)
  const tempFilePath = path.join(outputFolder, `${req.file?.originalname}.mp4`);
  const m3u8OutputPath = path.join(outputFolder, `${req.file?.originalname.split('.')[0]}.m3u8`);
  fs.writeFileSync(tempFilePath, videoBuffer);
  const command = ffmpeg()
    .setFfmpegPath(ffmpegPath)
    .input(tempFilePath)
    .outputOptions([
      '-hls_time 10', 
      '-hls_list_size 0',
      `-hls_segment_filename ${segmentOutputFolder}/[path]segment-%03d.ts`, 
    ])
    .output(m3u8OutputPath)
    .on('start', () => console.log('FFmpeg process started'))
    .on('end', () => {
      console.log('Conversion complete!');
      res.send({
        message:'video converted with succeess',
        response:`${process.env.baseURL}${process.env.PORT}/video/${req.file?.originalname.split('.')[0]}.m3u8`
      });
    })
    .on('error', err => {
      console.error('Error during conversion:', err);
      res.status(500).send('Error converting video.');
    });
  command.run();
});
