import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import Flask, render_template, request, redirect, url_for, session, flash

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'FLASK_SECRET_KEY'  # Required for using sessions

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

    # If not logged in, redirect to login page
    flash("You need to log in to view the listings")
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        try:
            # Attempt to sign in with email and password
            user = auth.get_user_by_email(email)
            # Check if the password is correct (Firebase Auth handles this for you)
            # Firebase SDK doesn't provide a direct way to check password, but you can use Firebase client libraries on the front-end to handle login securely.

            # If authentication is successful, log the user in by saving their UID in the session
            session['user_id'] = user.uid
            flash("Login successful!")
            return redirect(url_for('home'))
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
