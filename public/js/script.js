
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Search Suggestions Functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const suggestionItems = document.querySelectorAll('.suggestion-item');

  if (searchInput && searchSuggestions) {
    // Show suggestions on focus
    searchInput.addEventListener('focus', function() {
      searchSuggestions.style.display = 'block';
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.style.display = 'none';
      }
    });

    // Handle suggestion clicks
    suggestionItems.forEach(item => {
      item.addEventListener('click', function() {
        const searchTerm = this.getAttribute('data-search');
        searchInput.value = this.textContent;
        searchSuggestions.style.display = 'none';
        
        // Submit the form
        const form = searchInput.closest('form');
        if (form) {
          form.submit();
        }
      });
    });

    // Filter suggestions based on input
    searchInput.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      suggestionItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(value)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Filter Icons Functionality
  const filterIcons = document.querySelectorAll('.filter');
  filterIcons.forEach(filter => {
    filter.addEventListener('click', function() {
      // Get filter type from icon or text
      const filterType = this.querySelector('p').textContent.toLowerCase();
      
      // Map display names to URL-friendly names
      const filterMap = {
        'trending': 'trending',
        'rooms': 'rooms',
        'iconic cities': 'iconic-cities',
        'mountains': 'mountains',
        'castles': 'castles',
        'amazing pools': 'amazing-pools',
        'camping': 'camping',
        'farms': 'farms',
        'arctic': 'arctic',
        'domes': 'domes',
        'boats': 'boats'
      };
      
      const filterUrl = filterMap[filterType];
      
      if (filterUrl) {
        // Redirect to filter URL
        window.location.href = `/listings/filter/${filterUrl}`;
      }
    });
  });
});
