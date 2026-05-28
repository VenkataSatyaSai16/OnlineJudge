# **Version 1**

# Frontend

- **Auth** : Register / Login
- **Problems** : Set of Problems from different topics .
- **Problem Page** : Question , Sample Input and output , code editor , run custom test cases , submit problem .
- **Home Page** : Details of the website .
- **Leaderboard** : Details of users .
- **Solved** : Solved Questions details.

- **Tech Stack** : ReactJS + Redux 

 # Backend 

- **Auth** : JWT auth .
- **Pages** : Dynamically fetch all problems from db.
- **Problem Page** : Dynamically render the page using the database .
- **online compiler(run)** : run programs for given inputs and give output .
- **online judge(submit)** : fetch testcases from db and evaluate outputs and give a verdict .
- **Submission** : store the result and problemId in db .
- **Leaderboard** : Fetch from db . 
- **Solved** : Dynamically fetch from db and sort based on the timestamp.

- **Tech Stack** : Express , Node.JS 

# DB

- **Users** : Username , Email , Password , FirstName , LastName 
- **Problems** : ProblemId , ProblemName , ProblemStatement , Sample Input , Sample Output , TestCaseId 
- **Test Cases** : ProblemId , T1 , OP1 
- **Submission** : UserID , ProblemId , Code , Verdict , TimeStamp
- **LeaderBoard** : UserId , questionsSolved

- **Tech Stack** : MongoDB Atlas .


# Progress

