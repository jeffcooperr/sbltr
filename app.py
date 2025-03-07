import os
import requests
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from flask import Flask, render_template, request, redirect, url_for, session, flash
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.
# Code of your application, which uses environment variables (e.g. from `os.environ` or
# `os.getenv`) as if they came from the actual environment.


# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

# Firebase web api key
FIREBASE_WEB_API_KEY = os.getenv('FIREBASE_WEB_API_KEY')

# Google API
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Initialize Firestore
cred = credentials.Certificate('../sbltr-c125d-firebase-adminsdk-fbsvc-d691b459c6.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def home():
    # If the user is logged in, show the listings
    if 'user_id' in session:
        # Fetch housing listings from Firestore
        listings_ref = db.collection("listings")
        docs = listings_ref.stream()

        listings = []
        for doc in docs:
            listing = doc.to_dict()
            listing["id"] = doc.id  # Store the document ID
            listings.append(listing)

        return render_template('index.html', listings=listings)

    return redirect(url_for('login'))


@app.route('/add_listing', methods=['GET', 'POST'])
def add_listing():
    if 'user_id' not in session:
        flash("Please log in to add a listing.")
        return redirect(url_for('login'))

    if request.method == 'POST':
        address = request.form['address']
        distance = request.form['distance']
        roommates = request.form['roommates']
        rent = request.form['rent']

        new_listing = {
            "user_id": session['user_id'],
            "address": address,
            "distance": distance,
            "roommates": roommates,
            "rent": rent
        }

        try:
            db.collection("listings").add(new_listing)
            flash("Listing added successfully!")
            return redirect(url_for('home'))
        except Exception as e:
            flash(f"Error adding listing: {str(e)}")
            return redirect(url_for('add_listing'))

    return render_template('add_listing.html', google_api_key=GOOGLE_API_KEY)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Firebase REST API endpoint for sign-in
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"

        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }

        try:
            response = requests.post(url, json=payload)
            data = response.json()

            if "idToken" in data:
                session['user_id'] = data['localId']  # Store user ID in session
                flash("Login successful!")
                return redirect(url_for('home'))
            else:
                flash(data.get("error", {}).get("message", "Invalid login credentials"))
                return redirect(url_for('login'))

        except Exception as e:
            flash(f"Error logging in: {str(e)}")
            return redirect(url_for('login'))

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if not email.endswith("@uvm.edu"):
            flash('Please use a valid UVM email')
            return redirect(url_for('signup'))

        try:
            # Create a new user with the provided email and password
            user = auth.create_user(email=email, password=password)
            flash(f"User {user.email} created successfully! You can now log in.")
            return redirect(url_for('login'))
        except Exception as e:
            flash(f"Error signing up: {str(e)}")
            return redirect(url_for('signup'))

    return render_template('signup.html')


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash("You have been logged out.")
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
