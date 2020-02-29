#!/usr/bin/env node
var convertor = require("../index");

const optionDefinitions = [
    { name: 'dir', alias: 'd', type: String },
    { name: 'fileFilter', type: String, alias: 'f', defaultOption: "component.ts" }
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions);

convertor.convertInlineTemplate((options && options.dir) || "./", (options && options.fileFilter) || "");
