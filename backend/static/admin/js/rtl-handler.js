// RTL Handler for Persian/Farsi Language Support
document.addEventListener('DOMContentLoaded', function() {
    // Detect if the current language is Persian/Farsi
    const currentLanguage = document.documentElement.lang || 'en';
    const isPersian = currentLanguage === 'fa' || currentLanguage === 'fa-ir';
    
    // Apply RTL direction for Persian
    if (isPersian) {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl-mode');
        
        // Add Persian font class to body
        document.body.classList.add('persian-text');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl-mode');
        document.body.classList.remove('persian-text');
    }
    
    // Handle language switcher if present
    const languageSelect = document.querySelector('select[name="language"]');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            
            // Update URL with language parameter
            const url = new URL(window.location);
            url.searchParams.set('language', selectedLang);
            
            // Reload page with new language
            window.location.href = url.toString();
        });
    }
    
    // Auto-detect Persian text in form fields and apply appropriate styling
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            const value = this.value;
            const persianRegex = /[\u0600-\u06FF]/;
            
            if (persianRegex.test(value)) {
                this.style.direction = 'rtl';
                this.style.textAlign = 'right';
                this.style.fontFamily = "'Vazir', 'Tahoma', 'Arial', sans-serif";
            } else {
                this.style.direction = 'ltr';
                this.style.textAlign = 'left';
                this.style.fontFamily = '';
            }
        });
        
        // Apply on page load for existing content
        const value = input.value;
        const persianRegex = /[\u0600-\u06FF]/;
        if (persianRegex.test(value)) {
            input.style.direction = 'rtl';
            input.style.textAlign = 'right';
            input.style.fontFamily = "'Vazir', 'Tahoma', 'Arial', sans-serif";
        }
    });
    
    // Enhance table display for Persian content
    const tableCells = document.querySelectorAll('td, th');
    tableCells.forEach(function(cell) {
        const text = cell.textContent;
        const persianRegex = /[\u0600-\u06FF]/;
        
        if (persianRegex.test(text)) {
            cell.style.direction = 'rtl';
            cell.style.textAlign = 'right';
            cell.style.fontFamily = "'Vazir', 'Tahoma', 'Arial', sans-serif";
        }
    });
    
    // Add visual indicators for bilingual fields
    const bilingualFields = document.querySelectorAll('[name*="_en"], [name*="_fa"]');
    bilingualFields.forEach(function(field) {
        const fieldName = field.getAttribute('name');
        if (fieldName && fieldName.includes('_fa')) {
            // Persian field
            field.style.direction = 'rtl';
            field.style.textAlign = 'right';
            field.style.fontFamily = "'Vazir', 'Tahoma', 'Arial', sans-serif";
            
            // Add a small flag or indicator
            const label = field.closest('.form-group')?.querySelector('label');
            if (label && !label.querySelector('.lang-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'lang-indicator';
                indicator.textContent = ' (فا)';
                indicator.style.color = '#666';
                indicator.style.fontSize = '0.8em';
                label.appendChild(indicator);
            }
        } else if (fieldName && fieldName.includes('_en')) {
            // English field
            field.style.direction = 'ltr';
            field.style.textAlign = 'left';
            
            // Add a small flag or indicator
            const label = field.closest('.form-group')?.querySelector('label');
            if (label && !label.querySelector('.lang-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'lang-indicator';
                indicator.textContent = ' (EN)';
                indicator.style.color = '#666';
                indicator.style.fontSize = '0.8em';
                label.appendChild(indicator);
            }
        }
    });
});

// Helper function to toggle RTL mode
function toggleRTL() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    document.documentElement.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
    document.body.classList.toggle('rtl-mode', !isRTL);
    document.body.classList.toggle('persian-text', !isRTL);
}
