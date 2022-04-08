from firebase_admin import credentials,db
import os,sys,json,time,getpass
import firebase_admin
import praw

print("Starting script...\n")
try:
    cred = credentials.Certificate("firebase-login.json")
    durl = {"databaseURL":"https://isbo-coddit-default-rtdb.firebaseio.com/"}
    firebase_admin.initialize_app(cred, durl)
except:print("Please add or fix 'firebase-login.json'");sys.exit()
def redlog(login):
    return praw.Reddit(
        client_id = login["id"], 
        client_secret = login["secret"], 
        username = login["username"], 
        password = login["password"], 
        user_agent = "Isbo2000 Coddit 5.0")
def asklogin():
    i = getpass.getpass('Id: ')
    s = getpass.getpass('Secret: ')
    u = input('Username: ')
    p = getpass.getpass('Password: ')
    login = {"id":i,"secret":s,"username":u,"password":p}
    with open('login.json', 'w') as lgn:json.dump(login, lgn)
    try:redlog(login).user.me()
    except:os.remove('login.json');sys.exit()
    return redlog(login)
def checklogin():
    if os.path.exists('login.json'):
        with open('login.json') as lgn:login=json.load(lgn)
        try:redlog(login).user.me()
        except:return asklogin()
    else:return asklogin()
    return redlog(login)
subreddit = checklogin().subreddit("teenagersbutpog")
banned = ["Isbot2000", "DimittrikovBot", "AutoModerator"]
datdbs = [db.reference("data"), db.reference("all-time")]
sub_stream = subreddit.stream.submissions(skip_existing = True)
com_stream = subreddit.stream.comments(skip_existing = True)
print("Ready\n")

def counter(stream, name, num):
    for con in stream:
        author = str(con.author)
        if (author not in banned):
            for datdb in datdbs:
                data = datdb.get()
                if (author in data):
                    data[author][num] += 1
                else:
                    data[author] = [0, 0]
                    data[author][num] += 1
                datdb.set(data)
            print(name+" added for "+author)
        else:print(author+" is banned, nothing added")
while True:
    try:
        counter(sub_stream,"Submission",0)
        time.sleep(1)
        counter(com_stream,"Comment",1)
        time.sleep(1)
    except BaseException as error:
        print(str(error))
