A simple rest API for Tasks.

# Commands to run this project locally

# Install the required packages.
npm install

# Build
npm run build

# Start locally
npm run start-local

# Create a production build for AWS lambda.
./prod-build.sh

# copy zip file from /prod-build/prod-build.zip into AWS Lambda.

# Notes 

Error: 502 error when loading the swagger page. 
Cause: This is caused due to AWS ALB + Lambda has a limit for files it can transfer, which is set to 1MB and swagger-ui-bundle.js is about 1.4MB
Solution: To resolve this issue, you can try using compression middleware(https://github.com/expressjs/compression) which compression all the responses from the express APIs.

Error: cannot use import statement outside a module node
Cause: Read about this here(https://codedamn.com/news/nodejs/cannot-use-import-statement-outside-a-module). This error typically occurs when you attempt to use the ES6 import statement in a CommonJS environment. There are two main module systems in JavaScript: CommonJS and ES6 Modules. CommonJS is the module system used in Node.js. It uses the require() function to import modules and the module.exports object to export functionality from a module. ES6 Modules are the standardized module system for JavaScript, as defined by the ECMAScript 2015 (ES6) specification. They use the import and export keywords to achieve the same functionality as CommonJS modules.
Solution: Use babel with appropriate .babel configuration to transpile ES6 code to commonjs used by node.