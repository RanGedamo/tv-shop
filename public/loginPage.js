document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', async function (event) {
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
            console.log(data );
          displayMessage(data.error || 'Login failed. Please try again.', 'error');
        } else {
            console.log(data );
          displayMessage(data.successMessage, 'success');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      } catch (error) {
        console.error('Error during login request:', error);
        displayMessage('An error occurred. Please try again later.', 'error');
      }
    });
  
    function displayMessage(message, type) {
      const messageContainer = document.getElementById('error-message');
      messageContainer.style.display = 'block';
      messageContainer.className = type === 'error' ? 'alert alert-danger' : 'alert alert-success';
      messageContainer.textContent = message;
    }
  });
  