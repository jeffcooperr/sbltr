import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, render_template

# Initialize Flask app
app = Flask(__name__)

# Initialize Firestore
cred = credentials.Certificate('path')  # Update with the correct path
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def home():
    # Fetch housing listings from Firestore
    listings_ref = db.collection("listings")
    docs = listings_ref.stream()

    listings = []
    for doc in docs:
        listing = doc.to_dict()
        listing["id"] = doc.id  # Store the document ID
        listings.append(listing)

    return render_template('index.html', listings=listings)

if __name__ == '__main__':
    app.run(debug=True)