from firebase_admin import credentials,db
import os,sys,json,time,getpass
import firebase_admin
import praw

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
    with open('./login.json', 'w') as lgn:
        json.dump(login, lgn)
    try:
        print("\nChecking details...\n")
        redlog(login).user.me()
    except:
        print("ERROR: Invalid login\n")
        os.remove('./login.json')
        checklogin()
    print("Logging in...\n")
    return redlog(login)
def checklogin():
    if os.path.exists('./login.json'):
        with open('./login.json') as lgn:
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

try:
    print("Starting script...\n")
    try:
        cred = credentials.Certificate("firebase-login.json")
        durl = {"databaseURL":"https://isbo-coddit-default-rtdb.firebaseio.com/"}
        firebase_admin.initialize_app(cred, durl)
    except: print("Please add or fix 'firebase-login.json'"); sys.exit()
    subred = checklogin().subreddit("teenagersbutpog")
    banned = ["Isbot2000", "DimittrikovBot", "AutoModerator"]
    datdbs = [db.reference("data"), db.reference("all-time")]
    streams = [
        [subred.stream.submissions(pause_after=0,skip_existing=True), "Submission", 0],
        [subred.stream.comments(pause_after=0,skip_existing=True), "Comment", 1]
    ]
    print("Ready\n")
except KeyboardInterrupt: sys.exit()

while True:
    try:
        for stream in streams:
            for con in stream[0]:
                if (con is None): time.sleep(1); break
                author = str(con.author)
                if (author in banned): print(author+" banned"); break
                for datdb in datdbs:
                    data = datdb.get()
                    if (author in data):
                        data[author][stream[2]] += 1
                    else:
                        data[author] = [0, 0]
                        data[author][stream[2]] += 1
                    datdb.set(data)
                print(stream[1]+" added for "+author)
                time.sleep(1)
    except KeyboardInterrupt:
        print("\nExiting..."); sys.exit()
    except BaseException as error:
        print(str(error))
        try: streams = [
            [subred.stream.submissions(pause_after=0,skip_existing=True), "Submission", 0],
            [subred.stream.comments(pause_after=0,skip_existing=True), "Comment", 1]
        ]
        except: sys.exit()
        finally: time.sleep(10)
