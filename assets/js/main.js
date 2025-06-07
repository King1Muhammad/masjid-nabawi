document.addEventListener('DOMContentLoaded', () => {
    // Basic content check for backup verification
    console.log('Backup version:', document.querySelector('meta[name="version"]')?.content || '1.0');
    
    // Initialize preview mode
    console.log('Preview initializing...');
    console.log('Preview ready');
});