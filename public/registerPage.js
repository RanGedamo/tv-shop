document.addEventListener('DOMContentLoaded', function () {
    let userData = {};
    let timer;
    let redirectTimer;

    document.getElementById('register-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        userData = { firstName, lastName, username, password, confirmPassword };
        document.getElementById('email-display').textContent = `Code sent to: ${username}`;

        // התחלת טיימר של 3 שניות למעבר אוטומטי אם אין שגיאות
        redirectTimer = setTimeout(() => {
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('register-title').innerHTML = 'OTP Verification';
            document.getElementById('otp-section').style.display = 'block';
            displayMessage('OTP is being sent. Please enter the code sent to your email.', 'success');
            startOtpTimer(300); // התחלת הטיימר לספירה לאחור
        }, 3000);

        try {
            const response = await fetch('/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) {
                clearTimeout(redirectTimer); // ביטול המעבר לעמוד ה-OTP אם יש שגיאה
                displayMessage(data.error || 'Failed to send OTP. Please try again.', 'error');
            }
        } catch (error) {
            clearTimeout(redirectTimer); // ביטול המעבר לעמוד ה-OTP במקרה של שגיאה
            console.error('Error during OTP request:', error);
            displayMessage('An error occurred. Please try again later.', 'error');
        }
    });

    // טיפול באימות ה-OTP
    document.getElementById('otp-verify-button').addEventListener('click', async function () {
        const otp = document.getElementById('otp').value;

        try {
            const response = await fetch('/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userData.username, otp }),
            });

            const data = await response.json();
            if (!response.ok) {
                displayMessage(data.error || 'OTP verification failed. Please try again.', 'error');
            } else {
                // שליחת המידע לרישום לאחר אימות מוצלח
                const registerResponse = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });

                const registerData = await registerResponse.json();
                if (!registerResponse.ok) {
                    displayMessage(registerData.error || 'Registration failed. Please try again.', 'error');
                } else {
                    displayMessage('Registration successful!', 'success');
                    setTimeout(() => window.location.href = '/login', 1000);
                }
            }
        } catch (error) {
            console.error('Error during OTP verification or registration:', error);
            displayMessage('An error occurred. Please try again later.', 'error');
        }
    });

    // פונקציה להתחלת הטיימר
    function startOtpTimer(duration) {
        let timeRemaining = duration;
        const timerElement = document.getElementById('timer');

        timer = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerElement.textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeRemaining <= 0) {
                clearInterval(timer);
                displayMessage('OTP expired. Please request a new code.', 'error');
                document.getElementById('otp-section').style.display = 'none';
                document.getElementById('register-title').innerHTML = 'Register';
                document.getElementById('register-section').style.display = 'block';
            }

            timeRemaining--;
        }, 1000);
    }

    // פונקציה להצגת הודעות
    function displayMessage(message, type) {
        const messageContainer = document.getElementById('error-message');
        messageContainer.style.display = 'block';
        messageContainer.className = type === 'error' ? 'alert alert-danger' : 'alert alert-success';
        messageContainer.textContent = message;
    }
});

// פונקציה להצגת/הסתרת סיסמא
function togglePasswordVisibility(inputId, toggleButton) {
    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}
