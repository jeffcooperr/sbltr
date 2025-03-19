// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWpTLpLRfUoZvS_DMoG_LacJf8Dcm--OU",
  authDomain: "sbltr-c125d.firebaseapp.com",
  projectId: "sbltr-c125d",
  storageBucket: "sbltr-c125d.firebasestorage.app",
  messagingSenderId: "939786788547",
  appId: "1:939786788547:web:9ed81752e0658b0bca8c76",
  measurementId: "G-62CKTQGYKD"
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
      // TODO: Add more password requirements. - Bella
      if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'signUpMessage');
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