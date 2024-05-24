//@ts-check
const http = require('http');
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');

const uploadDir = './uploads';

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/upload/profile-picture') {
        handleProfile(req, res);
    }
    else if (req.method === 'POST' && req.url === '/upload/course-video') {
        handleCourseVideo(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({message: 'Not Found', error: true}));
    }
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`File Server is listening on port ${PORT}`);
});

/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function handleProfile(req, res) {
    const upDir = path.join(uploadDir, "images", "profiles");
    const form = new multiparty.Form({ uploadDir: upDir });
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message: 'Internal Server Error', error: true}));
                console.log("Parse Error", err);
                return;
            }
            
            if(fields.userId === undefined) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message: 'User ID is required', error: true}));
                return;
            }

            const file = files.file[0];
            const tempPath = file.path;
            const targetPath = path.join(upDir, fields.userId[0] + path.extname(file.originalFilename));

            fs.rename(tempPath, targetPath, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({message: 'Internal Server Error', error: true}));
                    console.log("Rename Error", err);
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message: 'Uploaded successfully', url: targetPath.replace(/\\/g, "/"), error: false}));
            });
        });
}

/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function handleCourseVideo(req, res) {
    const upDir = path.join(uploadDir, "videos", "courses");
    const form = new multiparty.Form({ uploadDir: upDir });
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message: 'Internal Server Error', error: true}));
                console.log("Parse Error", err);
                return;
            }
            
            if(fields.courseId === undefined || fields.moduleId === undefined) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message: 'Missing Course ID or Module ID', error: true}));
                return;
            }

            const file = files.file[0];
            const tempPath = file.path;

            const coursePath = path.join(upDir, fields.courseId[0]);
            if (!fs.existsSync(coursePath)) fs.mkdirSync(coursePath);

            const targetPath = path.join(coursePath, fields.moduleId + path.extname(file.originalFilename));

            fs.rename(tempPath, targetPath, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({message: 'Internal Server Error', error: true}));
                    console.log("Rename Error", err);
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message: 'Uploaded successfully', url: targetPath.replace(/\\/g, "/"), error: false}));
            });
        });
}
