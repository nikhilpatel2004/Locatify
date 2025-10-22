document.addEventListener('DOMContentLoaded', () => {
  // Use event delegation for better performance
  document.body.addEventListener('click', async (event) => {
    // Find the closest like-button ancestor
    const likeButton = event.target.closest('.like-button');

    if (likeButton) {
      // Prevent the link from being followed when the heart is clicked
      event.preventDefault();
      event.stopPropagation();

      const listingId = likeButton.dataset.id;

      try {
        const response = await fetch(`/listings/${listingId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add CSRF token header if you use csurf
          },
        });

        if (response.status === 401) {
          // If user is not logged in, redirect to login page
          window.location.href = '/login';
          return;
        }

        const data = await response.json();

        if (data.success) {
          // Toggle the 'liked' class based on the response
          likeButton.classList.toggle('liked', data.liked);
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  });
});