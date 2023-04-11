from firebase_admin import credentials,db
from actions_toolkit import core
import firebase_admin
import os

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

#monthly
if (os.environ.get("resm") == '4'):
    core.info("Resetting month...")

    index = db.reference("Index").get()
    index["months"].append({"name":os.environ.get("month").replace("_"," ")})
    db.reference("Index").set(index)
    core.info("Added month to index..")

    current = db.reference("This Month")
    month = db.reference(os.environ.get("month"))
    core.info("Fetched database pages..")

    month.set(current.get())
    core.info("Added previous month..")

    current.set({"Isbo2000":[0,0]})
    core.info("Reset current month..")

#yearly
if (os.environ.get("resy") == '4'):
    core.info("Resetting year...")

    index = db.reference("Index").get()
    index["years"].append({"name":os.environ.get("year")})
    db.reference("Index").set(index)
    core.info("Added year to index..")

    current = db.reference("This Year")
    year = db.reference(os.environ.get("year"))
    core.info("Fetched database pages..")

    year.set(current.get())
    core.info("Added previous year..")

    current.set({"Isbo2000":[0,0]})
    core.info("Reset current year..")

#neither??
else:
    core.error("Unable to reset month or year")