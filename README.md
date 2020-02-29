# separate-ng-inline-templates

This is very useful command line tool to migrate angular component's inline templates into separate template files.
Its the teadious job to manually do that. We need to touch hundred+ files based on size of the projects. 

This tool will automate migration process and do that for you within fraction of seconds.

## Installation

Install this tool globally, so that it will be available from anywhere

```
npm i -g separate-ng-inline-template
```
## Usage

```
separate-ng-inline-template -d <angular_components_path>
 ```
 OR
 
 ```
 separate-ng-inline-template --dir <angular_components_path>
  ```
 
 Example
 
 ```
separate-ng-inline-template --dir ./app
```  
Tool will do following processes
 - will find all angular component files 
   - (by default looks for component.ts files. if it needs to look for js file, we can use -f "component.js"). 
 - verifies whether component file has inline template or not. 
 - if component file contains inline template, it will separate inline content from component file
 - create the <componentname>.component.html file
 - writes the separated inline template content into html file
 - Finally replace component file template attribute with templateUrl: "<compoentname>.component.html"

## Author

* **Mohammed Riyaz**
