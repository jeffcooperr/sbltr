# sbltr - Student Subletting Website 

> <div style="font-size: 1.2em;">
> <strong>Project Repository:</strong>  
> <a href="https://github.com/jeffcooperr/sbltr.git">https://github.com/jeffcooperr/sbltr.git</a>  
> <br /><strong>Team:</strong> Jeff Cooper, Delaney Fisher, Bella Kamont, Ben Keane  
> <br /><strong>Class:</strong> Software Engineering CS 3050, Section A
> </div>

## Description

We have created a client/server system that serves as a social platform for college students (restricted to UVM students at this time) to post a view subletting listings in the Burlington region. The frontend is a website that is hosted using flask and the backend is implemented using Python to send and receive data from a Firestore database. The Firestore database contains the account information along with the listings and their associated data. Users are required to be authenticated with a UVM email address to access the website.  

## What Packages/Requirements do you need to run the program

- firebase_admin
- geopy
- dotenv
- pillow

## Installation

<div style="font-size: 1em;">
  <ol>
    <li>Clone the following repository in terminal or in a preferred IDE: <a href="https://github.com/jeffcooperr/sbltr.git">https://github.com/jeffcooperr/sbltr.git</a></li>
    <li>Create a file named <code>sbltr-c125d-firebase-adminsdk-fbsvc-d691b459c6.json</code> in the folder <code>sbltr</code> with the following contents:</li>
  </ol>
  <a>Note: One of our team members will give you the correct credentials if you are meant to have access.</a>
  <pre>
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR-PRIVATE-KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "your-client-email@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-client-email%40your-project.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
  </pre>

  <ol start="3">
    <li>Create a file named <code>.env</code> in the folder <code>sbltr</code> which contains the following contents:</li>
  </ol>
<pre>

    FLASK_SECRET_KEY = "your-secret-key-here"
    FIREBASE_WEB_API_KEY = "AIzaSyD-example-api-key"
    GOOGLE_API_KEY = "AIzaSyD-example-google-api-key"

    FIREBASE_CONFIG_KEY = "your-firebase-config-key"
    FIREBASE_AUTH_DOMAIN = "your-project-id.firebaseapp.com"
    FIREBASE_PROJECT_ID = "your-project-id"
    FIREBASE_STORAGE_BUCKET = "your-project-id.appspot.com"
    FIREBASE_MESSAGING_SENDER_ID = "123456789012"
    FIREBASE_APP_ID = "1:123456789012:web:abcdef123456"
    FIREBASE_MEASUREMENT_ID = "G-ABCDEFG123"
</pre>
  <ol start="4">
    <li>Now you can run the program locally through terminal and access it through the http link.</li>
  </ol>
</div>

## How to access the program

<div style="font-size: 1em;">
<p>To access the website, you will need to create an account or login to an already existing account.</p>
<p>To create an account follow these steps:</p>
<ol>
    <li>On the login page click "Sign up".</li>
    <li>Enter in a valid UVM email address. Your account will not be successfully created if you aren't able to verify your email via a link (which will not be sent to an invalid address or a none @uvm.edu address).</li>
    <li>Enter in a strong password or generate one by clicking "Generate Strong Password".
    <br> - The password must be at least 6 characters long, contain both uppercase and lowercase letters, one special character, and one digit. 
    </li>
    <li>Click "Sign Up"</li>
    <li>You should receive a verification email in the mailbox of the email you signed up with. Click the link in this email.</li>
    <li>You will be brought to a page that says your email has been successfully verified if the verification works, click "continue".</li>
    <li>Clicking continue should bring you to the login page. In the login page, sign into your account by entering your email and password for the account you just created and click "Log In".</li>
    <li>Once logged in, you will be brought to the sites home page which is where users can view and favorite listings, their locations on a map, and add listings.</li>
</ol>

</div>

## Program functionality 

<div style="font-size: 1em;">
<p>Once logged in, users can do the following: </p>
<ol>
    <li>Users can view a listing's details by clicking on its post on the main page.</li>
    <li>Users can create a listing by clicking the plus in the top right corner of the page, next to the heart.<br>When creating a listing for a sublet, the address, semester, and number of roommates must be entered. At least one image must also be uploaded, and up to three can be added.</li>
    <li>Users can favorite listings by clicking the heart on the post. Hearted listings can then be viewed by clicking the heart that's located on the top right of the page (In development).</li>
</ol>
</div>

## Images

<a>Images of what the pages of the website currently look like (Will update along with major changes in the project)</a>
<br />
<img src="website-photos/LoginPage.png" alt="Login Page" width="500">
<br />
<img src="website-photos/NewAccountPage.png" alt="New Account Page" width="500">
<br />
<img src="website-photos/HomePage.png" alt="Home Page" width="500">
<br />
<img src="website-photos/ListingDetailsPage.png" alt="Listing Details Page" width="500">

- March 26 2025






