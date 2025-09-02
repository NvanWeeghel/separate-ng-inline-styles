# separate-ng-inline-styles

This is very useful command line tool to migrate angular component's inline styles into separate style files.
Its the teadious job to manually do that. We need to touch hundred+ files based on size of the projects. 

This tool will automate migration process and do that for you within fraction of seconds.
If there is already a style file, it will add a second styleUrl, which has to be manually modified.

## Installation

Install this tool globally, so that it will be available from anywhere

```
npm i -g NvanWeeghel/separate-ng-inline-styles
```
## Usage

```
separate-ng-inline-styles -d <angular_components_path>
 ```
 OR
 
 ```
 separate-ng-inline-styles --dir <angular_components_path>
  ```
 
 Example
 
 ```
separate-ng-inline-styles --dir ./app
```  
Tool will do following processes
 - will find all angular component files 
   - (by default looks for component.ts files. if it needs to look for js file, we can use -f "component.js"). 
 - verifies whether component file has inline styles or not. 
 - if component file contains inline styles, it will separate inline content from component file
 - create the <componentname>.component.scss file
 - writes the separated inline styles content into scss file
 - Finally replace component file styles attribute with stylesUrl: "<componentName>.component.scss"

## Authors

* **Niek van Weeghel**
* **Mohammed Riyaz**
