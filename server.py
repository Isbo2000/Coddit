import os
import sys
import praw
import json
import getpass
from time import sleep
import firebase_admin
from firebase_admin import db
from firebase_admin import credentials
print("Starting script...\n")
try:
    app = firebase_admin.initialize_app(credentials.Certificate("firebase-login.json"))
except:
    print("Please add or fix 'firebase-login.json'")
    sys.exit()

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
    except:
        os.remove('login.json')
        sys.exit()
    return redlog(login)
def checklogin():
    if os.path.exists('login.json'):
        with open('login.json') as lgn:login=json.load(lgn)
        try:redlog(login).user.me()
        except:return asklogin()
    else:return asklogin()
    return redlog(login)
reddit = checklogin()

sub_stream = reddit.subreddit("teenagersbutpog").stream.submissions(pause_after = 0, skip_existing = True)
com_stream = reddit.subreddit("teenagersbutpog").stream.comments(pause_after = 0, skip_existing = True)
banned = ["Isbot2000","DimittrikovBot","AutoModerator"]
ref = db.reference("/")

def counter(stream, con_type):
    for thing in stream:
        if (not(thing)):return
        author = str(thing.author)
        if (author in banned):return
        ref = db.reference("/data/")
        data = ref.get()
        if (author in data):
            ref = db.reference("/data/"+author+"/"+con_type+"/")
            value = data[author][con_type] + 1
            ref.update(value)
        else:
            data[author] = [0, 0]
            data[author][con_type] +=1
            ref.set(data)
        ref = db.reference("/all-time/")
        all_data = ref.get()
        if (author in all_data):
            ref = db.reference("/data/"+author+"/"+con_type+"/")
            value = all_data[author][con_type] + 1
            ref.update(value)
        else:
            all_data[author] = [0, 0]
            all_data[author][con_type] +=1
            ref.set(all_data)
        if(con_type==0):ty="Submission"
        elif(con_type==1):ty="Comment"
        print(f'{ty} added for {author}')
        sleep(5)

print("Ready\n")
while True:
    try:
        counter(sub_stream,0)
        sleep(15)
        counter(com_stream,1)
        sleep(15)
    except BaseException as error:
        print(str(error))
        sleep(30)
