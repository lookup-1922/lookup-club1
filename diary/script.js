const diaryContent = document.getElementById('diary-content');
const calendar = document.getElementById('calendar');
const search = document.getElementById('search');
const importButton = document.getElementById('backup-import');
const exportButton = document.getElementById('backup-export');

// Load diary entries from localStorage
const loadEntries = () => {
    return JSON.parse(localStorage.getItem('diaryEntries')) || {};
};

// Save diary entries to localStorage
const saveEntries = (entries) => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
};

// Display the diary content for the selected date
const loadDiaryForDate = (date) => {
    const entries = loadEntries();
    diaryContent.value = entries[date] || '';
};

// Save the current diary content for the selected date
diaryContent.addEventListener('input', () => {
    const entries = loadEntries();
    entries[calendar.value] = diaryContent.value;
    saveEntries(entries);
});

// Handle calendar change
calendar.addEventListener('change', () => {
    loadDiaryForDate(calendar.value);
});

// Handle search on Enter key press
search.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = search.value.toLowerCase();
        const entries = loadEntries();
        const matchingDates = Object.keys(entries).filter(date => entries[date].toLowerCase().includes(query));

        if (matchingDates.length === 1) {
            calendar.value = matchingDates[0];
            loadDiaryForDate(matchingDates[0]);
        } else if (matchingDates.length > 1) {
            const firstMatch = matchingDates[0];
            calendar.value = firstMatch;
            loadDiaryForDate(firstMatch);
            alert(`Multiple entries found: ${matchingDates.join(', ')}. Showing the first match.`);
        } else {
            alert('No entries found.');
        }
    }
});

// Handle backup export
exportButton.addEventListener('click', () => {
    const entries = loadEntries();
    const blob = new Blob([JSON.stringify(entries)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        'T' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
    a.download = `diary_backup_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

// Handle backup import
importButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedEntries = JSON.parse(e.target.result);
                saveEntries(importedEntries);
                alert('Backup imported successfully!');
                if (calendar.value) {
                    loadDiaryForDate(calendar.value);
                }
            };
            reader.readAsText(file);
        }
    });
    input.click();
});

// Initialize the app
const today = new Date().toISOString().split('T')[0];
calendar.value = today;
loadDiaryForDate(today);