## Contributing

### Adding a new assessment
If you'd like to add a new assessment, open an issue and state why this assessment is needed and create an accompanying pull request.  
For each assessment, it needs to be able to pass all current tests as well as implement its own set. Depending what your assessment is, at least two tests are required: It running on a file that it can pass and running on a file that it won't pass to demonstrate what errors like.  
Each assessment also needs some kind of config file that is overwritable by the user.

### Updating an assessment
Updates, more through testing, or any kind of bug fixes are always welcome! Open an issue and create an accompanying pull request. Try to keep issues as specific as possible and to change as little as possible. It's better to have many pull requests each addressing a single issue than trying to fix everything at once.  
Updates to the core code need to be able to pass all tests
Adding tests need to explain why the test is nessicary and how it wasn't being tested before.  
Modifing tests need to explain why the previous version wasn't working or how it is beeing modified to be better.  
