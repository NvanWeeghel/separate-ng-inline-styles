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
        let filepath = componentFilePath.replace(/(\.ts)$/, ".html");
        removeFile(filepath, {
            err: "error deleting the component html template file. please do it manually. file: " + filepath,
            success: "successfully removed component html template file. file: " + filepath
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

function writeTemplateFile(filepath, templateContent) {
    let componentFilePath = filepath.replace(/(\.html)$/, ".ts"),
        pat = new RegExp("('|\")?template('|\")?:[\\s\\n]*`[\\s]*[^`]*`", "g");
    fs.writeFile(filepath, templateContent, function (err) {
        if (err) {
            console.log("Error creating the template file, so reverting back.");
            revertAllChanges(componentFilePath);
        } else {
            console.log('Successfully created the html template file. file: ' + filepath);
            fs.readFile(componentFilePath, 'utf-8', (err, data) => {
                if (err) {
                    console.log("error reading component file");
                    revertAllChanges(componentFilePath, true);
                } else {
                    var editedContent = data.replace(pat, "templateUrl: \"" + path.basename(filepath) + "\"");

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
                createTemplateHtmlFile(componentFilePath, templateContent);
            }
        });
    }
}

function createTemplateHtmlFile(componentFilePath, templateContent) {
    let fileName = path.basename(componentFilePath),
        filePath = path.dirname(componentFilePath),
        templatePath;
    if (fileName.match(/(\.component\.ts)$/)) {
        templatePath = filePath + "/" + fileName.replace("component.ts", "component.html");
        fs.stat(templatePath, function(err, stats) {
            if (!stats || (err && err.Error.match(/(no such file or directory)/gi))) {
                console.log("Component Template file not exists and inline template found, so its migrating inline template to template file. Component" + componentFilePath);
                writeTemplateFile(templatePath, templateContent);
            } else {
                console.log("Component template file exists, so skipping this component. Component: " + componentFilePath);
            }

        });
    }
    return false;
}

exports.convertInlineTemplate = function(dir, fileFilter) {
    let processedFileCount = 0;
    console.log("Migration Process started ..... ");
    if (typeof dir !== "string") {
        console.log("invalid directory value");
        return;
    }
    fif.find({term:"('|\")?template('|\")?:[\\s\\n]*`[\\s]*[^`]*`", flags: "g"}, dir, fileFilter||"component.ts$")
        .then(function(results) {
            for (var result in results) {
                console.log("filename: " + result);
                var res = results[result];
                if (res.matches[0]) {
                    takeFileBackupAndMigrate(result, res.matches[0].replace(/('|")?template('|")?:[`\s\n\r\t]*/, "").replace(/`/g, ""));
                } else {
                    console.log("No inline template found in Component. Component: " + result);
                }
                processedFileCount++;
            }

        })
        .finally(()=>{
            if (!processedFileCount) {
                console.log("No inline templates detected. You are good!");
            }
        });
}


