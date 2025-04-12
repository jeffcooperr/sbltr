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
    const url = new URL(window.location.href);

    url.searchParams.delete('tags');
    url.searchParams.delete('max_rent');
    url.searchParams.delete('roommates');
    url.searchParams.delete('semester');
    url.searchParams.delete('max_distance');

    // Append tags to the URL search parameters
    const selectedTags = getSelectedTags();
    selectedTags.forEach(tag => {
        url.searchParams.append('tags', tag);
    });

    const maxRent = document.getElementById('max_rent').value;
    const roommates = document.getElementById('roommates').value;
    const semester = document.getElementById('semester').value;
    const maxDistance = document.getElementById('max_distance').value;

    if (maxRent) url.searchParams.set('max_rent', maxRent);
    if (roommates) url.searchParams.set('roommates', roommates);
    if (semester && semester !== "Any") url.searchParams.set('semester', semester);
    if (maxDistance) url.searchParams.set('max_distance', maxDistance);

    // update and reload url
    window.location.href = url.toString();
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
    const url = new URL(window.location.href);
    const selectedTags = url.searchParams.getAll('tags');

    fetch('/api/tags')
        .then(response => response.json())
        .then(tags => {
            const tagContainer = document.getElementById('advanced-filters-form');
            tagContainer.innerHTML = '';

            const header = document.createElement('h3');
            header.textContent = 'Tags';
            tagContainer.appendChild(header);

            const tagGrid = document.createElement('div');
            tagGrid.classList.add('tag-grid');

            // Dynamically generate checkboxes for each unique tag
            tags.forEach(tag => {
                const tagDiv = document.createElement('div');
                tagDiv.classList.add('tag-item');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('tag-checkbox');
                checkbox.value = tag;
                checkbox.id = 'tag-' + tag;

                if (selectedTags.includes(tag)) {
                    checkbox.checked = true;
                }

                const label = document.createElement('label');
                label.setAttribute('for', 'tag-' + tag);
                label.textContent = tag;

                tagDiv.appendChild(checkbox);
                tagDiv.appendChild(label);
                tagContainer.appendChild(tagDiv);
            });
            tagContainer.appendChild(tagGrid);

            const basicHeader = document.createElement('h4');
            basicHeader.textContent = 'Basic Filters';
            tagContainer.appendChild(basicHeader);

            const basicContainer = document.createElement('div');
            basicContainer.id = 'basic-filters-container';
            tagContainer.appendChild(basicContainer);

            basicFilters(basicContainer);
        })
        .catch(error => {
            console.error('Error loading tags:', error);
        });
}

function basicFilters(container) {
    const urlParams = new URLSearchParams(window.location.search);

    // Max Rent filter
    const maxRentDiv = document.createElement('div');
    maxRentDiv.className = 'filter-group';
    maxRentDiv.innerHTML = `
        <label for="max_rent">Max Rent ($):</label>
        <input type="number" id="max_rent" name="max_rent" placeholder="5000" value="${urlParams.get('max_rent') || ''}">
        `;
    container.appendChild(maxRentDiv);
    
    // Roommates filter
    const roommatesDiv = document.createElement('div');
    roommatesDiv.className = 'filter-group';
    roommatesDiv.innerHTML = `
        <label for="roommates">Number of Roommates:</label>
        <input type="number" id="roommates" name="roommates" placeholder="Any" value="${urlParams.get('roommates') || ''}">
    `;
    container.appendChild(roommatesDiv);
    
    // Semester filter
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'filter-group';
    const semesterSelect = document.createElement('select');
    semesterSelect.id = 'semester';
    semesterSelect.name = 'semester';
    ['Any', 'Summer 2025', 'Fall 2025', 'Spring 2026'].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (urlParams.get('semester') === opt) option.selected = true;
        semesterSelect.appendChild(option);
    });
    semesterDiv.innerHTML = `<label for="semester">Semester:</label>`;
    semesterDiv.appendChild(semesterSelect);
    container.appendChild(semesterDiv);
    
    // Max Distance filter
    const distanceDiv = document.createElement('div');
    distanceDiv.className = 'filter-group';
    distanceDiv.innerHTML = `
        <label for="max_distance">Max Distance (miles):</label>
        <input type="number" step="0.01" id="max_distance" name="max_distance" placeholder="5" value="${urlParams.get('max_distance') || ''}">
    `;
    container.appendChild(distanceDiv);
}