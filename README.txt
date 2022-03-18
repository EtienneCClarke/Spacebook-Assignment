----------------------------------------------------------------
Setting Up Project

In order to run project on your phone through expo you must
change all the fetch requests from "localhost:3333" to your
IPv4 address.


Bad:
'http://localhost:3333/api/1.0.0/friendrequests/{user_id}'

Good:
'http://192.168.1.73:3333/api/1.0.0/friendrequests/{user_id}'

----------------------------------------------------------------
Version Control			:			GitHub

In order to maintain a good level of version control I
used GitHub to regularly upload my code when a new stage
in the project reaches completion. This allowed me to
revert to previous project states if i ever had to.

[https://github.com/EtienneCClarke/Spacebook-Assignment.git]

----------------------------------------------------------------
Style Guide 			: 			Air B&B

In partnership with eslint. I used the Air B&B style guide
to ensure my code quality is consistent throughout the project.
This can be tested by running 

spacebook-assignmnet> npm run linter.