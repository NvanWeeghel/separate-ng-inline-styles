'use strict';

var fif = require('find-in-files'),
    path = require('path'),
    fs = require('fs');

function revertAllChanges(componentFilePath, isRevertAll) {
    removeFile(componentFilePath + "_back", {
        err: "error deleting the component back file. please do it manually. file: " + componentFilePath + "_back",
        success: "successfully removed component backup file. file: " + componentFilePath + "_back"
    });
    if (isRevertAll) {
        let filepath = componentFilePath.replace(/(\.ts)$/, ".scss");
        removeFile(filepath, {
            err: "error deleting the component scss template file. please do it manually. file: " + filepath,
            success: "successfully removed component scss template file. file: " + filepath
        });
    }
}

function removeFile(path, messages) {
    fs.unlink(path, (err) => {
        if (err) {
            console.log(messages.err);
        } else {
            console.log(messages.success);
        }
    });
}

function writeTemplateFile(filepath, styleContent) {
    let componentFilePath = filepath.replace(/(\.scss)$/, ".ts"),
        pat = new RegExp("('|\")?styles('|\")?:[\\s\\n]*`[\\s]*[^`]*`", "g");
    fs.writeFile(filepath, styleContent, function (err) {
        if (err) {
            console.log("Error creating the style file, so reverting back.");
            revertAllChanges(componentFilePath);
        } else {
            console.log('Successfully created the scsss style file. file: ' + filepath);
            fs.readFile(componentFilePath, 'utf-8', (err, data) => {
                if (err) {
                    console.log("error reading component file");
                    revertAllChanges(componentFilePath, true);
                } else {
                    var editedContent = data.replace(pat, "styleUrl: \"" + path.basename(filepath) + "\"");

                    fs.writeFile(componentFilePath, editedContent, 'utf-8', function (err) {
                        if (err) {
                            console.log("error editing the file. File: "+ componentFilePath);
                            revertAllChanges(componentFilePath, true);
                        } else {
                            console.log('successfully migrated. File: ' + componentFilePath);
                            console.log('removing component backup. File: ' + componentFilePath);
                            revertAllChanges(componentFilePath);
                        }

                    });
                }
            });

        }
    });
}

function takeFileBackupAndMigrate(componentFilePath, templateContent) {
    if (fs.copyFile) {
        fs.copyFile(componentFilePath, componentFilePath + "_back", (err) => {
            if (err) {
                console.log("failed to back up component file, so it's skipping the process for this file. File: " +componentFilePath);
                return;
            } else {

                console.log('Successfully backed up the component file. File: ' +componentFilePath);
                createTemplateScssFile(componentFilePath, templateContent);
            }
        });
    }
}

function createTemplateScssFile(componentFilePath, templateContent) {
    let fileName = path.basename(componentFilePath),
        filePath = path.dirname(componentFilePath),
        stylePath;
    if (fileName.match(/(\.component\.ts)$/)) {
        stylePath = filePath + "/" + fileName.replace("component.ts", "component.scss");
        fs.stat(stylePath, function(err, stats) {
            if (!stats || (err && err.Error.match(/(no such file or directory)/gi))) {
                console.log("Component style file not exists and inline styles found, so its migrating inline styles to style file. Component" + componentFilePath);
                writeTemplateFile(stylePath, templateContent);
            } else {
                console.log("Component style file exists, so skipping this component. Component: " + componentFilePath);
            }

        });
    }
    return false;
}

exports.convertInlineStyle = function(dir, fileFilter) {
    let processedFileCount = 0;
    console.log("Migration Process started ..... ");
    if (typeof dir !== "string") {
        console.log("invalid directory value");
        return;
    }
    fif.find({term:"('|\")?styles('|\")?:[\\s\\n]*`[\\s]*[^`]*`", flags: "g"}, dir, fileFilter||"component.ts$")
        .then(function(results) {
            for (var result in results) {
                console.log("filename: " + result);
                var res = results[result];
                if (res.matches[0]) {
                    takeFileBackupAndMigrate(result, res.matches[0].replace(/('|")?styles('|")?:[`\s\n\r\t]*/, "").replace(/`/g, ""));
                } else {
                    console.log("No inline styles found in Component. Component: " + result);
                }
                processedFileCount++;
            }

        })
        .finally(()=>{
            if (!processedFileCount) {
                console.log("No inline styles detected. You are good!");
            }
        });
}


