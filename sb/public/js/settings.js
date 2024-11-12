window.onload = function() {
    // Display username logic
    const username = localStorage.getItem('username');
    if (username) {
        const userNameElement = document.createElement('h2');
        userNameElement.textContent = `Hello, ${username}, Customize your profile!`;
        document.getElementById('username-placeholder').appendChild(userNameElement);
    } else {
        // Redirect to login page if no username is found
        window.location.href = '/login.html';
    }

    // Logout button functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Show custom confirmation modal
            const modal = document.getElementById('customConfirmModal');
            modal.style.display = 'block';
    
            // Handle modal buttons
            document.getElementById('confirmLogoutBtn').addEventListener('click', () => {
                // Confirm logout
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = '/index.html';
            });
    
            document.getElementById('cancelLogoutBtn').addEventListener('click', () => {
                // Close modal without logging out
                modal.style.display = 'none';
            });
        });
    }
    

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const darkModeEnabled = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', darkModeEnabled);
        });

        // Apply dark mode if previously enabled
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Function to load profile data from localStorage
    function loadProfileData() {
        const profileImgData = localStorage.getItem('profileImg');
        const bioData = localStorage.getItem('bio');
        const professionData = localStorage.getItem('profession');
        const usernameData = localStorage.getItem('username');
    
        // Log data to verify
        console.log('Profile Image Data:', profileImgData);
        console.log('Bio Data:', bioData);
        console.log('Profession Data:', professionData);
        console.log('Username Data:', usernameData);
    
        // Display profile container
        const profileContainer = document.getElementById('username-placeholder');
        profileContainer.innerHTML = ''; // Clear previous profile content
    
    
        // Handle profile image
        if (profileImgData) {
            const img = document.createElement('img');
            img.src = profileImgData; // Set the stored base64 string as the source
            img.alt = 'Profile Image';
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            img.style.justifyContent = 'flex-start';
            img.style.alignItems = 'center';
            img.style.marginRight = '15px';
   
            profileContainer.appendChild(img);
        } else {
            console.log('No profile image data found.');
        }

        
        // Handle username
        if (usernameData) {
            const usernameElement = document.createElement('h2');
            usernameElement.textContent = `${usernameData}`;
            profileContainer.appendChild(usernameElement);
        }
    
        // Handle bio and profession
        if (bioData) {
            const bioParagraph = document.createElement('p');
            bioParagraph.textContent = `Bio: ${bioData}`;
            profileContainer.appendChild(bioParagraph);
        }
    
        if (professionData) {
            const professionParagraph = document.createElement('p');
            professionParagraph.textContent = `Profession: ${professionData}`;
            profileContainer.appendChild(professionParagraph);
        }
    }
    
    // Load profile data when the page loads
    loadProfileData();
    
    // Profile customization form logic
    const customizeProfileBtn = document.getElementById('customizeProfileBtn');
    const formContainer = document.getElementById('customizeProfileForm');
    const closeProfileFormBtn = document.getElementById('closeProfileFormBtn');
    
    if (customizeProfileBtn) {
        customizeProfileBtn.addEventListener('click', function() {
            formContainer.style.display = 'block';
        });
    }
    
    if (closeProfileFormBtn) {
        closeProfileFormBtn.addEventListener('click', function() {
            formContainer.style.display = 'none';
        });
    }
    
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            const profileImgInput = document.getElementById('profileImg');
            const bioInput = document.getElementById('bio').value;
            const professionInput = document.getElementById('profession').value;
    
            // Convert the image to a base64 string
            if (profileImgInput.files.length > 0) {
                const file = profileImgInput.files[0];
                const reader = new FileReader();
    
                reader.onloadend = function() {
                    const base64Image = reader.result;
                    console.log('Saving Image as Base64:', base64Image); // Debugging base64 string
                    localStorage.setItem('profileImg', base64Image); // Save base64 string
                };
    
                // Read the file as a data URL (Base64 string)
                reader.readAsDataURL(file);
            }
    
            localStorage.setItem('bio', bioInput);
            localStorage.setItem('profession', professionInput);
    
            // Reload profile data
            loadProfileData();
    
            // Hide the form after saving
            formContainer.style.display = 'none';
        });
    }
};
