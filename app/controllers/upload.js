var fs = require('fs');

exports.post = function(req, res){
    saveFile(req.files.imageData.path);
	res.json({ success: 1 });
};

function saveFile(path) {
    var fileData = fs.readFileSync(path),
        savePath = __dirname + '/photo/' + new Date().getTime() + '.jpg';

    fs.writeFileSync(savePath, fileData);
    console.log("Save " + savePath);
}