## Meeting Minutes ##


### Monday, Week 2 (6-06-2022) ###
Called on Microsoft Teams and discussed which functions each member will work on (as set out below)

- Nicholas - authLoginV1, authRegisterV1, channelsCreateV1, data.md\
- Steven - channelsListV1, channelsListallV1\
- Dan - channelDetailsV1, channelJoinV1\
- Huda - channelInviteV1, channelMessagesV1\

### Thursday, Week 3 (16-06-2022 @ 3pm) ###
Conducted in-person during Lab

General Overview:
- Write tests
- Write implementation
- Test implementation against personal tests
- Test implementation against automarking via dryrun + leaderboard
  - “The leaderboard will be run on Monday, Wednesday, and Friday lunchtime during the week that the iteration is due.”  

- Need to work function by function, instead of writing all the tests first and then all of the implementations
- Functions need to be done in order (11 in total) - everything to be done prior to Monday afternoon so we have time to make edits after seeing updated mark on the Leaderboard  
  - Dan: authLoginV1 + authRegisterV1
    - Necessary for many following functions
    - Due: Thursday evening
  - Nic: channelsCreateV1 + channelsListV1
    - Due: Saturday afternoon
  - Dan: channelsListallV1 + channelDetailsV1
    - Due: Saturday night / Sunday morning
  - Steven: channelJoinV1 + channelInviteV1
    - Don’t return anything = not necessary for other functions
    - Due: Monday afternoon
  - Huda: channelMessagesV1 + userProfileV1 + clearV1
    - Due: Monday afternoon

- Iteration 1 requires a minimum of 12 merge requests
- Ask Nic if you have any questions regarding the data.md file  


- Standups: asynchronous over Teams (use the shared channel involving Sienna)
  - One person can create a post on Thursdays + Sundays OR Thursday Standup can be during the lab @ 2pm and Sunday Standup can be during the meeting @ 2pm
  - Response by every team member by the end of the day involving answers for the following:
    - What did I do?
    - What problems did I face?
    - What am I going to do?
- Meetings: Over Teams 
    - Sunday afternoon @ 2pm

### Sunday, Week 4 (19-06-2022 @ 2pm) ###
Called on Microsoft Teams (Steven was not present)

- Standup:
  - Nick - Completed test cases, working on implementation
  - Dan - Finished testing and implementing first two functions

- Action items:
  - Unchanged

### Thursday, Week 4 (23-06-2022 @ 3pm) ###
Conducted in-person during Lab (Nicholas was not present)

- Iteration One is due tomorrow
  - For Iteration Two: we can improve by starting earlier + more frequent communication + more discussion on code layout and how to simplify it
- Updates:
  - Pipeline is currently fine
  - All functions have been completed except for channelMessagesV1
- To do before due time:
  - Huda completes and pushes channelMessagesV1 to master
  - Editing for readability, spacing, and uniformity
  - Add Documentation prior to each function (see: '8.4 Documentation Contribution' of assignment spec)
  - Move 'clearV1()' function in test files to 'beforeEach()'
  - Update assumptions file (first six assumptions will be marked)  

### Thursday, Week 5 (30-06-2022 @ 3pm) ###
Conducted in-person during lab time

- Iteration two is due on Friday of Week 7
- What we need to do:
  - Change old code to pass all tests - everyone fix the tests they failed + add one assumption to the assumptions.md file (due: Thursday, Week 5)
- Typescript + HTTPS (due: Sunday, Week 5)
    - Nic completes first five (convert to TS and implement HTTPS)
    - Huda completes next five (convert to TS and implement HTTPS)
  - New functions
    - Channel → Dan (due: Friday, Week 6)
    - Message → Steven (due: Friday, Week 6)
    - DM (hardest one) → Nic (due: Friday, Week 6)
    - User/users → Huda (due: Friday, Week 6)
- Linting

- Meeting will be held sometime next Week 6 (Thursday or Sunday) to check up on everyone's progress / complications
- Standups will continue to be held on Thursdays and Sundays

### Sienna’s Notes: Post-Iteration One ###
- Set a realistic deadline
- Send a message in the Teams chat if you have a merge request that needs to be approved
- Write tests and implementation on the same branch before you merge it into master
- Branch name format: [initials]-[function_name]
- For each commit : put name of file that has changed in commit message
- Edit assumptions file
  - Everyone add one more assumption to the file (fixing mistakes we made in iteration one)
- Do not delete branches

### Thursday, Week 6 (07-07-2022 @ 1pm) ###
Conducted over Microsoft Teams

- Standup completed during meeting 
- Nicholas' updates: has added 'tokens' functionality + has changed the way we access things (because of we had to convert to ts, things need to be accessed via string instead of int)
    - This was causing the email to appear as ascii code
- Channels array is currently a little flawed:
    - We are pushing to the end of the array
    - When a channel is deleted, a gap is left in the middle
- Huda and Nic will complete their designated functions (see Board on Git)
- Steven and Dan will get started on what functions they can

### Thursday, Week 7 (14-07-2022 @ 3pm) ###
Conducted in-person during lab time (Nicholas unable to attend)

- Standup completed during meeting 
- Huda: user/profile/v2 is not passing tests (edit: passed all tests by the end of lab)
- Steven and Dan completing respective functions with final edits
- Nicholas has completed his functions and testing
- Note: function documentation must comply with JSDocs formatting (Sienna linked in Teams chat Iteration 1 Feedback post)
- Pipeline running extremely slowly = merging immediately (locally) into master is allowed (just remember to check linting, tsc, and tests)

### Thursday, Week 9 (28-07-2022 @ 2pm) ###
Conducted in-person during lab time

- Updates post-Iteration 2 (regarding failed course tests):
  - DM and channel functions have been fixed by Nick (including messages function)
  - User function has been fixed by Huda
  - Remaining failing implementations are to be fixed by Dan
  - Dan to implement Iter2 Feedback "Request wrapper functions would have be clearer in a separate file" by creating request.ts
- What we need to do:
  - Modify Iteration 2 work to match Iteration 3 spec (this includes updating tests to include new errors + changing server.ts)
  - 19 new functions in Iteration 3 interface:
    - Huda to complete users/ (3)
    - Nick to complete auth/ (2) and admin/ (2) and standup/ (3)
    - Steven to complete messages/ (4 - pin, unpin, sendlater, sendlaterdm)
    - Dan to complete notifications/ (1) and search (1) and messages/ (3 - share, react, unreact)
  - Huda to complete PDF report
- Deadlines:
  - Iteration 2 modifications - Due: Sunday, Week 9 
  - Iteration 3 functions and report - Due: Wednesday Morning, Week 10 (before leaderboard is updated)
