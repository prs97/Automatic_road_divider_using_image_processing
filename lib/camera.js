const nodeWebcam = require('node-webcam');
const path = require("path");
const cv = require('opencv');
const cameraOptions = {
    width: 600,
    height: 800,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: "jpg",
    location: "/images",
};

module.exports = function(cb) {
    const cameras = nodeWebcam.create(cameraOptions);
    cameras.list(function(list) {
        const camera1 = nodeWebcam.create(list[0]);
        const camera2 = nodeWebcam.create(list[1]);
        const cameraImagePath = path.resolve(__dirname, "../public/images");
        const imageExtension = ".jpg";

        camera1.capture(path.join(cameraImagePath, "camera1"), function(err, camera1Data) {
            if(err) {
                return console.error(err);
            }
            camera2.capture(path.join(cameraImagePath, "camera2"), function(err, camera2Data) {
                if(err) {
                    return console.error(err);
                }
                cv.readImage(path.join(cameraImagePath, "camera1" + imageExtension), function(err, camera1Image) {
                    const camera1ImageHeight = camera1Image.height(),
                        camera1ImageWidth = camera1Image.width(),
                        highThrash = 150,
                        lowThrash = 0,
                        iteration = 2;
                    if(camera1ImageHeight < 1 || camera1ImageWidth < 1) {
                        throw new Error("Camera1Image not captured");
                    }
                    camera1Image.convertGrayscale();
                    camera1Image.save(path.join(cameraImagePath, "grayscaleImg1" + imageExtension));

                    camera1Image.gaussianBlur([3,3]);
                    camera1Image.save(path.join(cameraImagePath, "gaussianblurImg1" + imageExtension));
                    camera1Image.canny(lowThrash, highThrash);
                    camera1Image.dilate(iteration);

                    camera1Image.save(path.join(cameraImagePath, "cannyImg1" + imageExtension));

                    const lineType = 8;
                    const maxLevel = 0;
                    const thickness = 1;
                    var big = new cv.Matrix(camera1ImageHeight, camera1ImageWidth);
                    var all = new cv.Matrix(camera1ImageHeight, camera1ImageWidth);
                    var contours = camera1Image.findContours();
                    var maxArea = 500;
                    var BLUE  = [255, 0, 0];
                    var RED   = [0, 0, 255]; 
                    var GREEN = [0, 255, 0]; 
                    var WHITE = [255, 255, 255];

                    for(var i = 0; i < contours.size(); i++) {
                        if(contours.area(i) > maxArea) {
                            var moments = contours.moments(i);
                            var cgx = Math.round(moments.m10 / moments.m00);
                            var cgy = Math.round(moments.m01 / moments.m00);
                            big.drawContour(contours, i, GREEN, thickness, lineType, maxLevel, [0, 0]);
                            big.line([cgx - 5, cgy], [cgx + 5, cgy], RED);
                            big.line([cgx, cgy - 5], [cgx, cgy + 5], RED);
                        }
                    }

                    all.drawAllContours(contours, WHITE);

                    big.save(path.join(cameraImagePath, 'big1.png'));
                    all.save(path.join(cameraImagePath, 'all1.png'));
                    console.log('Image saved');
                    console.log(i);
                    cb(i > 70 ? "Forward" : "Reverse");
                });
            });
        });
    });
};