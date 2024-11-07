 
            // פונקציית callback לאחר התחברות Google
            function handleGoogleSignIn(response) {
              // קבלת ה-ID Token
              const idToken = response.credential;
    
              // שליחת ה-ID Token לשרת שלך לאימות
              sendGoogleTokenToServer(idToken);
          }
    
          // פונקציה לשליחת ה-ID Token לשרת שלך
          async function sendGoogleTokenToServer(idToken) {
              try {
                  const response = await fetch('/auth/google', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ idToken }), // שליחת ה-ID Token לשרת
                  });
    
                  if (!response.ok) {
                      throw new Error("Server error during Google login");
                  }
    
                  const data = await response.json();
                  console.log("Server response:", data);
  
                  window.location.href = '/';
                  if (data.success) {
                      // שמירת הטוקן שהשרת מחזיר (למשל, טוקן גישה)
                      localStorage.setItem("authToken", data.token);
                      console.log("User logged in successfully with Google");
                  } else {
                      console.error("Google login failed:", data.message);
                  }
              } catch (error) {
                  console.error("Error during Google login:", error);
              }
          }
      
      // Google Sign-In Callback
      function handleCredentialResponse(response) {
          const userCredential = jwt_decode(response.credential);
          console.log("User info:", userCredential);

          // Change Login to Logout
          const loginTitle = document.getElementById("login-title");
          loginTitle.innerText = "Logout";
          const loginSection = document.getElementById("login-section");
          loginSection.style.display = "none"; // Hide login section after successful login
          displayMessage("Logged in with Google successfully!", 'success');
      }

      // Logout function
      function logout() {
          document.getElementById("login-title").innerText = "Login";
          document.getElementById("login-section").style.display = "block"; // Show login section
          console.log("User logged out.");
      }

      document.addEventListener('DOMContentLoaded', function () {
          let loginForm = document.getElementById('login-form');
          let forgotPasswordForm = document.getElementById('forgot-password-form');
          let otpForm = document.getElementById('otp-form');
          let changePasswordForm = document.getElementById('change-password-form');

          // טיפול בטופס התחברות
          if (loginForm) {
              loginForm.addEventListener('submit', async function (event) {
                  event.preventDefault();
                  const username = document.getElementById('username').value;
                  const password = document.getElementById('password').value;
                  try {
                      const response = await fetch('/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username, password }),
                      });
                      const data = await response.json();
                      if (!response.ok) {
                          displayMessage(data.error || 'Login failed. Please try again.', 'danger');
                      } else {
                          displayMessage(data.success, 'success');
                          setTimeout(() => window.location.href = '/', 1000);
                      }
                  } catch (error) {
                      console.error('Error during login request:', error);
                      displayMessage('An error occurred. Please try again later.', 'danger');
                  }
              });
          }

          // טיפול בטופס שכחתי סיסמה
          if (forgotPasswordForm) {
              forgotPasswordForm.addEventListener('submit', async function (event) {
                  event.preventDefault();
                  const username = document.getElementById('forgot-email').value;
                  try {
                      const response = await fetch('/auth/forgot-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username }),
                      });
                      const data = await response.json();
                      if (!response.ok) {
                          displayMessage(data.error || 'Failed to send OTP. Please try again.', 'danger');
                      } else {
                          displayMessage('OTP sent successfully! Check your email.', 'success');
                          showOtpInputSection();
                      }
                  } catch (error) {
                      console.error('Error during forgot password request:', error);
                      displayMessage('An error occurred. Please try again later.', 'danger');
                  }
              });
          }

          // טיפול בטופס הזנת OTP
          if (otpForm) {
              otpForm.addEventListener('submit', async function (event) {
                  event.preventDefault();
                  const otp = document.getElementById('otp-code').value;
                  const username = document.getElementById('forgot-email').value;
                  try {
                      const response = await fetch('/auth/verify-otp', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username, otp }),
                      });
                      const data = await response.json();
                      if (!response.ok) {
                          displayMessage(data.error || 'Invalid OTP. Please try again.', 'danger');
                      } else {
                          displayMessage('OTP verified successfully!', 'success');
                          showChangePasswordSection();
                      }
                  } catch (error) {
                      console.error('Error during OTP verification:', error);
                      displayMessage('An error occurred. Please try again later.', 'danger');
                  }
              });
          }

          // טיפול בטופס שינוי סיסמה
          if (changePasswordForm) {
              changePasswordForm.addEventListener('submit', async function (event) {
                  event.preventDefault();
                  const newPassword = document.getElementById('new-password').value;
                  const confirmPassword = document.getElementById('confirm-password').value;
                  if (newPassword !== confirmPassword) {
                      displayMessage('Passwords do not match. Please try again.', 'danger');
                      return;
                  }
                  try {
                      const response = await fetch('/auth/change-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ newPassword }),
                      });
                      const data = await response.json();
                      if (!response.ok) {
                          displayMessage(data.error || 'Failed to change password. Please try again.', 'danger');
                      } else {
                          displayMessage('Password changed successfully!', 'success');
                          showLogin();
                      }
                  } catch (error) {
                      console.error('Error during password change request:', error);
                      displayMessage('An error occurred. Please try again later.', 'danger');
                  }
              });
          }

          // פונקציות להציג ולהסתיר סקשנים
          window.showForgotPassword = function () {
              document.getElementById('login-section').style.display = 'none';
              document.getElementById('forgot-password-section').style.display = 'block';
          };

          window.showOtpInputSection = function () {
              document.getElementById('forgot-password-section').style.display = 'none';
              document.getElementById('otp-input-section').style.display = 'block';
          };

          window.showChangePasswordSection = function () {
              document.getElementById('otp-input-section').style.display = 'none';
              document.getElementById('change-password-section').style.display = 'block';
          };

          window.showLogin = function () {
              document.getElementById('forgot-password-section').style.display = 'none';
              document.getElementById('otp-input-section').style.display = 'none';
              document.getElementById('change-password-section').style.display = 'none';
              document.getElementById('login-section').style.display = 'block';
          };

          // פונקציה להצגת הודעות
          function displayMessage(message, type) {
              const messageContainer = document.getElementById('error-message');
              messageContainer.style.display = 'block';
              messageContainer.className = `alert alert-${type}`;
              messageContainer.textContent = message;
          }
      });

      function togglePasswordVisibility(inputId, toggleButton) {
          const passwordInput = document.getElementById(inputId);
          if (passwordInput.type === 'password') {
              passwordInput.type = 'text';
              toggleButton.textContent = '🙈'; // Hide icon
          } else {
              passwordInput.type = 'password';
              toggleButton.textContent = '👁️'; // Show icon
          }
      }
  