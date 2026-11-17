// Context7 AI Chat Widget
(function() {
    'use strict';

    if (document.querySelector('script[src="https://context7.com/widget.js"]')) {
        return;
    }

    const widget = document.createElement('script');
    widget.src = 'https://context7.com/widget.js';
    widget.async = true;
    // this repo's own library (the help articles and API docs), not the old osintcat.net crawl
    widget.setAttribute('data-library', '/osintcathq/docs');
    widget.setAttribute('data-color', '#7c3aed');
    widget.setAttribute('data-placeholder', 'Ask about the OsintCat API…');
    document.head.appendChild(widget);
})();

// OsintCat Custom Header and Hide Mintlify Link
(function() {
    'use strict';
    
    // Function to customize header with OsintCat text
    function customizeHeader() {
        // Find the logo/link element - look for a[href="/"] with nav-logo images
        // Try multiple selectors to find the navbar logo link
        let logoLink = null;
        
        // First, try to find within navbar container
        const navbar = document.querySelector('#navbar');
        if (navbar) {
            logoLink = navbar.querySelector('a[href="/"]');
        }
        
        // If not found, try other common locations
        if (!logoLink) {
            logoLink = document.querySelector('a[href="/"] img.nav-logo')?.closest('a[href="/"]');
        }
        
        if (!logoLink) {
            // Fallback: find any a[href="/"] that contains nav-logo images
            const allLinks = document.querySelectorAll('a[href="/"]');
            for (const link of allLinks) {
                if (link.querySelector('img.nav-logo') || link.querySelector('img[alt*="logo"]')) {
                    logoLink = link;
                    break;
                }
            }
        }
        
        if (logoLink) {
            // Check if text already exists
            const existingText = logoLink.querySelector('.osintcat-text');
            if (!existingText) {
                // Add "OsintCat" text after the last image (or after sr-only span)
                const textSpan = document.createElement('span');
                textSpan.className = 'osintcat-text';
                textSpan.textContent = 'OsintCat';
                
                // Find the last image or the sr-only span to insert after
                const images = logoLink.querySelectorAll('img');
                const lastImage = images[images.length - 1];
                
                if (lastImage) {
                    // Insert after the last image
                    lastImage.parentNode.insertBefore(textSpan, lastImage.nextSibling);
                } else {
                    // Fallback: append to the link
                    logoLink.appendChild(textSpan);
                }
            }
        }
    }
    
    function hideMintlifyLink() {
        // Method 1: Find by href containing mintlify.com and poweredBy/utm_campaign
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            const href = link.href || link.getAttribute('href') || '';
            const text = link.textContent || link.innerText || '';
            
            // Check if it's the Mintlify powered by link
            if ((href.includes('mintlify.com') && (href.includes('poweredBy') || href.includes('utm_campaign=poweredBy'))) ||
                (text.trim() === 'Powered by Mintlify')) {
                
                // Multiple hiding methods
                link.style.display = 'none';
                link.style.visibility = 'hidden';
                link.style.opacity = '0';
                link.style.height = '0';
                link.style.width = '0';
                link.style.overflow = 'hidden';
                link.style.position = 'absolute';
                link.style.left = '-9999px';
                
                // Remove from DOM completely
                try {
                    if (link.parentNode) {
                        link.parentNode.removeChild(link);
                    }
                } catch (e) {
                    // If removal fails, at least it's hidden
                }
            }
        });

        // Method 2: Target specific footer links with classes
        const footerLinks = document.querySelectorAll('footer a.text-sm');
        footerLinks.forEach(link => {
            const href = link.href || link.getAttribute('href') || '';
            const text = link.textContent || link.innerText || '';
            
            if (href.includes('mintlify.com') || text.includes('Powered by Mintlify')) {
                link.style.display = 'none';
                link.style.visibility = 'hidden';
                if (link.parentNode) {
                    try {
                        link.parentNode.removeChild(link);
                    } catch (e) {
                        // Continue if removal fails
                    }
                }
            }
        });
    }

    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            customizeHeader();
            hideMintlifyLink();
        });
    } else {
        customizeHeader();
        hideMintlifyLink();
    }

    // Run multiple times to catch dynamically loaded content
    setTimeout(function() {
        customizeHeader();
        hideMintlifyLink();
    }, 50);
    setTimeout(function() {
        customizeHeader();
        hideMintlifyLink();
    }, 100);
    setTimeout(function() {
        customizeHeader();
        hideMintlifyLink();
    }, 300);
    setTimeout(function() {
        customizeHeader();
        hideMintlifyLink();
    }, 500);
    setTimeout(function() {
        customizeHeader();
        hideMintlifyLink();
    }, 1000);

    // Use MutationObserver to catch dynamically added elements
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });
            if (shouldCheck) {
                customizeHeader();
                hideMintlifyLink();
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            // Wait for body to be available
            const bodyObserver = new MutationObserver(function() {
                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    bodyObserver.disconnect();
                }
            });
            bodyObserver.observe(document.documentElement, {
                childList: true
            });
        }
    }
})();

