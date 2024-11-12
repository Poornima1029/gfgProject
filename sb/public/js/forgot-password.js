// ./js/forgot-password.js
document.getElementById('forgot-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = event.target.email.value;

    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        alert(result.message); // Display success or error message
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending the reset code.');
    }
});
