// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_CONFIG_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Show message for user sign in
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Run when the page opens and the user clicks the submit button.
document.addEventListener('DOMContentLoaded', () => {
  const signUpButton = document.getElementById('submitSignUp');

  if (signUpButton) {
    signUpButton.addEventListener('click', (event) => {

      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Email validation
      if (!email) {
        showMessage('Email is required', 'signUpMessage');
        return;
      }

      if (!email.endsWith('@uvm.edu')) {
        showMessage('Please use a UVM email address (@uvm.edu)', 'signUpMessage');
        return;
      }

      // Password validation

      // Password requirements
      const minLength = 6;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*]/.test(password);

      if (password.length < minLength) {
        showMessage('Password must be at least 6 characters long!', 'signUpMessage');
        return;
      }

      if (!hasUpperCase || !hasLowerCase) {
        showMessage('Password must consist of both uppercase and lowercase letters!', 'signUpMessage');
        return;
      }

      if (!hasDigit){
        showMessage('Password must contain at least one Digit!', 'signUpMessage');
        return;
      }

      if (!hasSpecialChars){
        showMessage('Password must contain at least one special character!', 'signUpMessage');
        return;
      }

      // Create user and store in firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

          const user = userCredential.user;

          // Store user data in Firestore
          const userData = {
            email: email,
            createdAt: new Date()
          };

          const docRef = doc(db, 'users', user.uid);
          return setDoc(docRef, userData)
            .then(() => {
              // Return the user so we can use it in the next then() block
              return user;
            });
        })
        .then((user) => {
            const actionCodeSettings = {
                // Redirect user to the login page after they verify their email.
                url: window.location.origin + '/login',
                handleCodeInApp: false
            };

          // Send email verification after user is created.
          return sendEmailVerification(user, actionCodeSettings)
            .then(() => {
              showMessage('Account created! Verification email sent. Please check your inbox and verify your email before logging in.', 'signUpMessage');

              return auth.signOut();
            });
        })
        .then(() => {
          // Redirect to login page after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        })
        .catch((error) => {
          console.error('Error during signup process:', error);

          if (error.code === 'auth/email-already-in-use') {
            showMessage('Email address is already in use.', 'signUpMessage');
          }
          else {
            showMessage('There was an error creating the account: ' + error.message, 'signUpMessage');
          }
        });
    });
  }
});
