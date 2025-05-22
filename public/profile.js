document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No token found! Please login first.')
        window.location.href = '/';
        return;
    }

    try {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch profile data!');
        }

        const user = await res.json();

        document.getElementById('firstName').textContent = user.firstName;
        document.getElementById('lastName').textContent = user.lastName;
        document.getElementById('username-info').textContent = user.username;
    }
    catch (err) {
        console.error(err.message);
        alert('Error loading profile. Redirecting to login!');
        window.location.href = '/';
    }
});