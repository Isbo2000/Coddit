from firebase_admin import credentials,db
from actions_toolkit import core
import firebase_admin, praw, os, time, requests

#start timer
start = time.perf_counter()

#log into firebase / initialize firebase
firebase_admin.initialize_app(
    credentials.Certificate({
        "type": "service_account",
        "project_id": os.environ.get("project_id"),
        "private_key_id": os.environ.get("private_key_id"),
        "private_key": os.environ.get("private_key").replace('\\n', '\n'),
        "client_email": os.environ.get("client_email"),
        "client_id": os.environ.get("client_id"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.environ.get("client_x509_cert_url")
    }),
    {"databaseURL":"https://test-coddit-default-rtdb.firebaseio.com/"}
)

try:
    #set status badge
    db.reference("Status/server").set({
        "message": "online",
        "color": "success",
        "isError": "false",
        "label": "server",
        "schemaVersion": 1
    })

    #log into reddit / initialize reddit
    reddit = praw.Reddit(
        client_id = os.environ.get("id"), 
        client_secret = os.environ.get("secret"), 
        username = os.environ.get("username"), 
        password = os.environ.get("password"), 
        user_agent = f'{os.environ.get("username")} ~ Coddit'
    )

    #define important variables
    banned = ["Isbot2000", "DimittrikovBot", "AutoModerator", "-thermodynamiclawyer"]
    databases = [db.reference("This Month"), db.reference("This Year"), db.reference("All Time")]
    sub = reddit.subreddit("teenagersbutpog")
    streams = [
        [sub.stream.submissions(pause_after=0,skip_existing=True), "Submission", 0],
        [sub.stream.comments(pause_after=0,skip_existing=True), "Comment", 1]
    ]
    
    #main script
    while ((time.perf_counter()-start) < 21560):
        try:
            #runs through for each of the streams
            for stream in streams:

                #runs through for all content in the stream
                for content in stream[0]:
                    #check if content exists
                    if (content is None): break

                    #get author and check if they are banned
                    author = str(content.author)
                    if (author in banned): core.info(author+" banned"); break

                    #goes through the databases and updates them
                    for database in databases:
                        #fetches data
                        data = database.get()

                        #if the author is already there, update the existing data for them
                        if (author in data):
                            data[author][stream[2]] += 1

                        #if the author isnt there, add them then update the data for them
                        else:
                            data[author] = [0, 0]
                            data[author][stream[2]] += 1

                        #pushes changes to firabase database
                        database.set(data)
                    
                    #log success
                    core.info(f'{stream[1]} added for {author}')

        except BaseException as error:
            #log error and restart streams
            try:
                core.error(error)
                streams = [
                    [sub.stream.submissions(pause_after=0,skip_existing=True), "Submission", 0],
                    [sub.stream.comments(pause_after=0,skip_existing=True), "Comment", 1]
                ]

            #if error occurs within the error
            except BaseException as error:
                #set status badge
                db.reference("Status/server").set({
                    "message": "failed",
                    "color": "critical",
                    "isError": "true",
                    "label": "server",
                    "schemaVersion": 1
                })
                #restart server
                requests.post(os.environ.get("server_restart_url"), data="Restart server", headers={"Content-Type": "application/json"})
                core.set_failed(error)

    #set status badge
    db.reference("Status/server").set({
        "message": "offline",
        "color": "inactive",
        "isError": "false",
        "label": "server",
        "schemaVersion": 1
    })

    #restart server
    requests.post(os.environ.get("server_restart_url"), data="Restart server", headers={"Content-Type": "application/json"})

except BaseException as error:
    #set status badge
    db.reference("Status/server").set({
        "message": "failed",
        "color": "critical",
        "isError": "true",
        "label": "server",
        "schemaVersion": 1
    })
    #restart server
    requests.post(os.environ.get("server_restart_url"), data="Restart server", headers={"Content-Type": "application/json"})
    core.set_failed(error)