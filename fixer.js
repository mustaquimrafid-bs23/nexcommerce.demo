const fs = require('fs');
const execSync = require('child_process').execSync;

let files = [
    'cart.html', 'checkout.html', 'confirmation.html', 'foundation.html',
    'js/ai-search-v2.js', 'js/ai-search.js', 'js/home.js', 'js/notifications.js',
    'js/plp.js', 'js/theme-switcher.js', 'js/tracking.js', 'lookbook.html',
    'playground.html', 'tracking.html'
];

let regex = /(t|n|her|inf|log|aut|pr|studi|int|merin|dem)&times;/gi;

let totalFixed = 0;
files.forEach(f => {
    let head = execSync('git show HEAD:' + f.replace(/\\/g, '/')).toString();
    let current = fs.readFileSync(f, 'utf8');
    
    let match;
    let replacements = [];
    while ((match = regex.exec(head)) !== null) {
        let prefix = match[1];
        let originalText = match[0];
        let correctText = prefix + 'o ';
        
        // Use 20 chars context to ensure uniqueness
        let before = head.substring(Math.max(0, match.index - 20), match.index);
        let after = head.substring(match.index + originalText.length, match.index + originalText.length + 20);
        
        let escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        let badPatternStr = escapeRegExp(before) + ' ' + escapeRegExp(after);
        let badPattern = new RegExp(badPatternStr);
        
        let goodText = before + correctText + after;
        
        replacements.push({ badPattern, goodText, originalText });
    }
    
    let newCurrent = current;
    let fixedCount = 0;
    replacements.forEach(r => {
        if (r.badPattern.test(newCurrent)) {
            newCurrent = newCurrent.replace(r.badPattern, r.goodText);
            fixedCount++;
        }
    });
    
    if (newCurrent !== current) {
        fs.writeFileSync(f, newCurrent, 'utf8');
        console.log('Fixed ' + fixedCount + ' places in ' + f);
        totalFixed += fixedCount;
    }
});
console.log('Total fixed: ' + totalFixed);
