document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        // Store token and username in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);  // Store the username as well

        // Redirect on successful login
        window.location.href = '/home.html';
    } else {
        alert(data.message); // Show error message
    }
});
