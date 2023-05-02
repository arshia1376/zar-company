//peyda kardan afrad balay 20 sal
// const user=db.model().find({
// age:{ $gte:20 }
// }).toArray

//Arshia Safikhani //javascript-syntax//download video youtube
// const fs = require ('fs')
// const youtubedl = require( 'youtube-dl')
// const video = youtubed( 'youtube link address'
//     [' -- format=18'], { cwd: __dirname })
// video.on('info', function (info) {
//     console. log( 'Download started')
//     console. log('filename:' + info._filename)//video name
//     console. log('size: '+ info.size) // video size
// })
// video.pipe(fs.createWriteStream('myvideo.mp4'))


//play video

// app.get('/video', (req, res) => {
//     const filePath = `./assets/test.mp4`;
//     if (!fs.existsSync(filePath)) {
//         return res.status(404).json({ data: 'OMFG file not found' });
//     }
//     const stat = fs.statSync(filePath);
//     const fileSize = stat.size;
//     const range = req.headers.range;
//     if (range) {
//         let parts = range.replace(/bytes=/, '').split('-');
//         let start = parseInt(parts[0], 10);
//         let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//         let chunkSize = end - start + 1;
//         let file = fs.createReadStream(filePath, {
//             start,
//             end,
//         });
//         let headers = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunkSize,
//             'Content-Type': 'video/mp4',
//         };
//
//         res.writeHead(206, headers);
//         file.pipe(res);
//     } else {
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp4',
//         };
//         res.writeHead(200, head);
//         fs.createReadStream(filePath).pipe(res);
//     }
// });

