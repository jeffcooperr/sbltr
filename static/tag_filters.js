// Advanced filters button, displays overlay and dynamically loads tags
document.getElementById('advanced-filters-btn').addEventListener('click', function() {
    document.getElementById('advanced-filters-overlay').style.display = 'block';
    loadTags();
});

// Close the overlay
document.getElementById('close-filters-btn').addEventListener('click', function() {
    document.getElementById('advanced-filters-overlay').style.display = 'none';
});

// Apply filters button within advanced filters, clears current filters and searches with new selected tags
document.getElementById('apply-filters-btn').addEventListener('click', function() {
    // Clear current filters
    const url = new URL(window.location.href);
    url.searchParams.delete('max_rent');
    url.searchParams.delete('roommates');
    url.searchParams.delete('semester');
    url.searchParams.delete('max_distance');
    url.searchParams.delete('tags');

    // Get selected tags
    const selectedTags = getSelectedTags();
    
    // Append tags to the URL search parameters
    selectedTags.forEach(tag => {
        url.searchParams.append('tags', tag);
    });

    window.history.replaceState({}, '', url);

    location.reload();
});

// Clear filters button, removes any current filters
document.getElementById('clear-filters-btn').addEventListener('click', function() {
    document.getElementById('filter').reset();
    
    document.querySelectorAll('.tag-checkbox').forEach(function(checkbox) {
        checkbox.checked = false;
    });

    const url = new URL(window.location.href);
    url.searchParams.delete('max_rent');
    url.searchParams.delete('roommates');
    url.searchParams.delete('semester');
    url.searchParams.delete('max_distance');
    url.searchParams.delete('tags');

    window.history.replaceState({}, '', url);
    
    location.reload();  
});

// Retrieve any selected tags
function getSelectedTags() {
    const selectedTags = [];
    document.querySelectorAll('.tag-checkbox:checked').forEach(checkbox => {
        selectedTags.push(checkbox.value);
    });
    return selectedTags;
}

// Dynamically generate tags and checkboxes from firebase, used inside advanced filters menu
function loadTags() {
    fetch('/api/tags')
        .then(response => response.json())
        .then(tags => {
            const tagContainer = document.getElementById('advanced-filters-form');
            tagContainer.innerHTML = '';

            // Dynamically generate checkboxes for each unique tag
            tags.forEach(tag => {
                const tagDiv = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('tag-checkbox');
                checkbox.value = tag;
                checkbox.id = 'tag-' + tag;

                const label = document.createElement('label');
                label.setAttribute('for', 'tag-' + tag);
                label.textContent = tag;

                tagDiv.appendChild(checkbox);
                tagDiv.appendChild(label);
                tagContainer.appendChild(tagDiv);
            });
        })
        .catch(error => {
            console.error('Error loading tags:', error);
        });
}
