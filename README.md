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

## Author

* **Mohammed Riyaz**
