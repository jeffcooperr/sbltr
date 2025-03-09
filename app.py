import os
import requests
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from flask import Flask, render_template, request, redirect, url_for, session, flash
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from dotenv import load_dotenv
import base64
from PIL import Image
from io import BytesIO

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
cred = credentials.Certificate('sbltr-c125d-firebase-adminsdk-fbsvc-d691b459c6.json')  # Update with the correct path
firebase_admin.initialize_app(cred)
db = firestore.client()

# Anchor Point for central campus
CAMPUS_COORDINATES = (44.47824202883298, -73.19629286190413)

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
        roommates = request.form['roommates']
        rent = request.form['rent']
        image = request.form['image']

        image_string = image_convert(image)

        #calculate distance automatically
        distance = get_distance(address)

        if distance is None:
            flash("Could not determine distance")
            return redirect(url_for('add_listing'))

        #calculate distance automatically
        distance = get_distance(address)

        if distance is None:
            flash("Could not determine distance")
            return redirect(url_for('add_listing'))

        new_listing = {
            "user_id": session['user_id'],
            "address": address,
            "distance": distance,
            "roommates": roommates,
            "rent": rent,
            "image": image_string
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

            print("Response from Firebase:", data)

            if "idToken" in data:
                # Get user verification status
                user_info_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_WEB_API_KEY}"
                user_payload = {"idToken": data["idToken"]}
                user_response = requests.post(user_info_url, json=user_payload)
                user_data = user_response.json()

                if "users" in user_data and len(user_data["users"]) > 0:
                    user = user_data["users"][0]

                    # Check if email is verified
                    if user.get("emailVerified", False):
                        # Store user ID in session
                        session['user_id'] = data['localId']
                        flash("Login successful!")
                        return redirect(url_for('home'))
                    else:
                        # Send a new verification email if they didn't verify their email.
                        verification_url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={FIREBASE_WEB_API_KEY}"
                        verification_payload = {
                            "requestType": "VERIFY_EMAIL",
                            "idToken": data["idToken"]
                        }
                        requests.post(verification_url, json=verification_payload)

                        flash(
                            "Your email is not verified! A new verification email has been sent. Please check your inbox.")
                        return redirect(url_for('login'))
                else:
                    flash("Unable to retrieve user information. Please try again.")
                    return redirect(url_for('login'))
            else:
                error_message = data.get("error", {}).get("message", "Invalid login credentials")
                print("Login error:", error_message)
                flash(error_message)
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

# Should edit this at some point so that user can enter city, state, country
# Or just make it automatic when they autofill address
def get_distance(address):
    geolocator = Nominatim(user_agent="sublet")
    location = geolocator.geocode(address)

    if location:
        house_coordinates = (location.latitude, location.longitude)
        distance = geodesic(CAMPUS_COORDINATES, house_coordinates).miles
        return round(distance, 2)
    return None

def image_convert(image):
    # MAX_SIZE is the maximum size (in bytes) Firebase allows for a string
    MAX_SIZE = 1048487
    image = Image.open(image)
    # Ensure that the image is in JPEG format
    image = image.convert('RGB')


    quality = 50
    # Initializes a buffer which will be used to store the image being compared to MAX_SIZE
    buffer = BytesIO()

    while quality > 5:
        # Move pointer to the beginning of buffer and clear out any remaining data
        buffer.seek(0)
        buffer.truncate()

        # Save the image to the buffer with the specified quality
        image.save(buffer, format="JPEG", quality=quality)

        # Encode the image as a base64 string and check if its size is below the limit
        encoded_string = base64.b64encode(buffer.getvalue()).decode('utf-8')
        if len(encoded_string) <= MAX_SIZE:
            return encoded_string

        # Reduce quality if image string was too large
        quality -= 5

if __name__ == '__main__':
    app.run(debug=True)
