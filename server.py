from firebase_admin import credentials,db
import os,sys,json,time,getpass
import firebase_admin
import praw

#checks for login info and logs into reddit bot
def redlog(login):
    return praw.Reddit(
        client_id = login["id"], 
        client_secret = login["secret"], 
        username = login["username"], 
        password = login["password"], 
        user_agent = "Isbot2000 ~ Coddit")
def asklogin():
    print("PLease enter your bot login info (dw, it is only stored locally)\n")
    i = getpass.getpass('Id: ')
    s = getpass.getpass('Secret: ')
    u = input('Username: ')
    p = getpass.getpass('Password: ')
    login = {"id":i,"secret":s,"username":u,"password":p}
    with open('./Assets/login.json', 'w') as lgn:
        json.dump(login, lgn)
    try:
        print("\nChecking details...\n")
        redlog(login).user.me()
    except:
        print("ERROR: Invalid login\n")
        os.remove('./Assets/login.json')
        checklogin()
    print("Logging in...\n")
    return redlog(login)
def checklogin():
    if os.path.exists('./Assets/login.json'):
        with open('./Assets/login.json') as lgn:
            login = json.load(lgn)
        try:
            print("\nChecking details...\n")
            redlog(login).user.me()
        except:
            return asklogin()
    else:
        return asklogin()
    print("Logging in...\n")
    return redlog(login)

#define certain variables and other things
try:
    print("Starting script...\n")
    #checks for login info and logs into firebase
    try:
        cred = credentials.Certificate("./Assets/firebase-login.json")
        durl = {"databaseURL":"https://isbo-coddit-default-rtdb.firebaseio.com/"}
        firebase_admin.initialize_app(cred, durl)
    except: print("Please add or fix 'firebase-login.json'"); sys.exit()
    #defines nececary variables
    subred = checklogin().subreddit("teenagersbutpog")
    banned = ["Isbot2000", "DimittrikovBot", "AutoModerator"]
    datdbs = [db.reference("This Month"), db.reference("This Year"), db.reference("All Time")]
    streams = [
        [subred.stream.submissions(pause_after=0,skip_existing=True), "Submission", 0],
        [subred.stream.comments(pause_after=0,skip_existing=True), "Comment", 1]
    ]
    print("Ready\n")
except KeyboardInterrupt: sys.exit()

#main script
while True:
    try:
        #runs through for each of the 2 streams
        for stream in streams:
            #runs through for each post or comment in said stream
            for con in stream[0]:
                #checks if the author of post/comment exists or is banned
                if (con is None): time.sleep(1); break
                author = str(con.author)
                if (author in banned): print(author+" banned"); break
                #goes through the 2 databases (this month and all time) and updates them
                for datdb in datdbs:
                    #fetches data
                    data = datdb.get()
                    #if the author is already there, update the existing data for them
                    if (author in data):
                        data[author][stream[2]] += 1
                    #if the author isnt there, add them then update the data for them
                    else:
                        data[author] = [0, 0]
                        data[author][stream[2]] += 1
                    #pushes changes to firabase database
                    datdb.set(data)
                print(stream[1]+" added for "+author)
                time.sleep(1)
    except KeyboardInterrupt:
        print("\nExiting..."); sys.exit()
    except BaseException as error:
        print(str(error))
        #restarts streams after an error
        try: streams = [
            [subred.stream.submissions(pause_after=0,skip_existing=True), "Submission", 0],
            [subred.stream.comments(pause_after=0,skip_existing=True), "Comment", 1]
        ]
        except: sys.exit()
        finally: time.sleep(10)
