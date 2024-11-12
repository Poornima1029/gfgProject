document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const securityAnswer = document.getElementById('security-answer').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // Send the reset password request to the server
    const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, securityAnswer, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Password reset successfully!');
        window.location.href = 'login.html';
    } else {
        alert(data.message);
    }
});
