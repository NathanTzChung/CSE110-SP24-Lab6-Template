1) 1. Within a Github action that runs whenever code is pushed. The idea is that the tests are automated, so we shouldn't have to be running them manually (though we can). By having the automated tests in the pipeline using Github actions, then upon pushing code, the code is checked. If a test is failed, then the push is ultimately rejected, and we will know that there is something to fix. This is efficient and helps keep large issues from being pushed to into the project. (Also, it probably isn't a good idea to run them after all development is completed because, at that point, there could be many things that need to be fixed. It's just not efficient.)


2) No, I would not use an end-to-end test to check if a function is returning the correct output. This is because end-to-end testing's purpose is to emulate user actions. Checking if a function is returning the correct output is something that can be tested by things like unit testing. Basically, end-to-end testing tests the flow to make sure a user can go from start to finish (regardless of correct output).




