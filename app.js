// AI-Enhanced UDL Interactive Webpage Application
class AIUDLApp {
    constructor() {
        this.currentSection = 'hero';
        this.sections = [];
        this.navigationLinks = [];
        this.progressIndicator = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupNavigation();
        this.setupExpandableContent();
        this.setupTabs();
        this.setupCaseStudies();
        this.setupResourceCategories();
        this.setupInteractiveElements();
        this.setupAccessibility();
        this.setupScrollEffects();
        this.setupSearch();
        this.announcePageLoad();
    }

    setupElements() {
        this.sections = document.querySelectorAll('.content-section, .hero-section, .references-section');
        this.navigationLinks = document.querySelectorAll('.nav-link');
        this.progressIndicator = document.getElementById('progressIndicator');
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        this.navigationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    this.updateActiveNavLink(link);
                    this.announceNavigation(targetSection);
                }
            });
        });

        // Update navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateProgressIndicator();
            this.updateActiveNavOnScroll();
        });

        // Initial progress update
        this.updateProgressIndicator();
    }

    scrollToSection(section) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    updateProgressIndicator() {
        if (!this.progressIndicator) return;
        
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / documentHeight) * 100;
        
        this.progressIndicator.style.width = `${Math.min(progress, 100)}%`;
    }

    updateActiveNavLink(activeLink) {
        this.navigationLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updateActiveNavOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const correspondingLink = document.querySelector(`[href="#${sectionId}"]`);
                if (correspondingLink) {
                    this.updateActiveNavLink(correspondingLink);
                }
            }
        });
    }

    setupExpandableContent() {
        const expandButtons = document.querySelectorAll('.expand-btn');
        
        expandButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleExpandableContent(button);
            });

            // Keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleExpandableContent(button);
                }
            });

            // Set initial ARIA attributes
            button.setAttribute('aria-expanded', 'false');
        });
    }

    toggleExpandableContent(button) {
        const section = button.closest('.expandable-content');
        const body = section.querySelector('.expandable-body');
        const icon = button.querySelector('.expand-icon');
        const expandText = button.querySelector('.expand-text');
        const isActive = button.classList.contains('active');

        if (isActive) {
            // Collapse
            button.classList.remove('active');
            body.classList.remove('active');
            body.style.display = 'none';
            if (expandText) {
                expandText.textContent = expandText.textContent.replace('Hide', 'View');
            }
            if (icon) {
                icon.textContent = '+';
            }
            button.setAttribute('aria-expanded', 'false');
        } else {
            // Expand
            button.classList.add('active');
            body.style.display = 'block';
            setTimeout(() => {
                body.classList.add('active');
            }, 10);
            if (expandText) {
                expandText.textContent = expandText.textContent.replace('View', 'Hide');
            }
            if (icon) {
                icon.textContent = '−';
            }
            button.setAttribute('aria-expanded', 'true');
            
            // Scroll to content if needed
            setTimeout(() => {
                const rect = section.getBoundingClientRect();
                if (rect.bottom > window.innerHeight) {
                    section.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
            }, 300);
        }

        // Announce change for screen readers
        this.announceContentToggle(section, !isActive);
    }

    setupTabs() {
        // Setup convergence tabs
        const convergenceTabButtons = document.querySelectorAll('.convergence-tabs .tab-btn');
        const convergenceTabPanes = document.querySelectorAll('.tab-pane');
        
        convergenceTabButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, button, convergenceTabButtons, convergenceTabPanes);
            });

            // Keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const targetTab = button.getAttribute('data-tab');
                    this.switchTab(targetTab, button, convergenceTabButtons, convergenceTabPanes);
                }
            });

            // Set initial ARIA attributes
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
        });
    }

    switchTab(targetTab, activeButton, allButtons, allPanes) {
        // Update buttons
        allButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');

        // Update panes
        allPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        const targetPane = document.getElementById(targetTab);
        if (targetPane) {
            targetPane.classList.add('active');
        }

        // Announce tab change
        this.announceTabChange(activeButton.textContent);
    }

    setupCaseStudies() {
        const expandCaseButtons = document.querySelectorAll('.expand-case');
        
        expandCaseButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCaseStudy(button);
            });

            // Set initial ARIA attributes
            button.setAttribute('aria-expanded', 'false');
        });
    }

    toggleCaseStudy(button) {
        const card = button.closest('.case-study-card');
        const details = card.querySelector('.case-details');
        const isExpanded = details.style.display === 'block';

        if (isExpanded) {
            details.style.display = 'none';
            details.classList.remove('active');
            button.textContent = 'View Full Study';
            button.setAttribute('aria-expanded', 'false');
        } else {
            details.style.display = 'block';
            setTimeout(() => {
                details.classList.add('active');
            }, 10);
            button.textContent = 'Hide Study Details';
            button.setAttribute('aria-expanded', 'true');
        }

        // Announce change
        const studyTitle = card.querySelector('h3').textContent;
        this.announceCaseStudyToggle(studyTitle, !isExpanded);
    }

    setupResourceCategories() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const resourceGroups = document.querySelectorAll('.resource-group');

        categoryButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetCategory = button.getAttribute('data-category');
                this.switchResourceCategory(targetCategory, button, categoryButtons, resourceGroups);
            });

            // Set initial ARIA attributes
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
        });
    }

    switchResourceCategory(targetCategory, activeButton, allButtons, allGroups) {
        // Update buttons
        allButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');

        // Update resource groups
        allGroups.forEach(group => {
            group.classList.remove('active');
        });
        
        const targetGroup = document.getElementById(targetCategory);
        if (targetGroup) {
            targetGroup.classList.add('active');
        }

        // Announce category change
        this.announceResourceCategoryChange(activeButton.textContent);
    }

    setupInteractiveElements() {
        // Make principle cards interactive
        const principleCards = document.querySelectorAll('.principle-card');
        principleCards.forEach((card) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Learn more about ${card.querySelector('h3').textContent}`);
            
            card.addEventListener('click', () => this.highlightCard(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.highlightCard(card);
                }
            });
        });

        // Add hover effects for better UX
        this.setupHoverEffects();
    }

    highlightCard(card) {
        // Remove highlight from all cards
        document.querySelectorAll('.principle-card, .tech-item, .case-study-card')
            .forEach(c => c.classList.remove('highlighted'));
        
        // Add highlight to selected card
        card.classList.add('highlighted');
        
        // Focus the card for accessibility
        card.focus();
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            card.classList.remove('highlighted');
        }, 3000);

        // Announce card interaction
        const cardTitle = card.querySelector('h3').textContent;
        this.announceCardHighlight(cardTitle);
    }

    setupHoverEffects() {
        const interactiveElements = document.querySelectorAll(
            '.principle-card, .tech-item, .case-study-card, .phase, .resource-item'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (!element.classList.contains('highlighted')) {
                    element.style.transform = element.style.transform || 'translateY(-2px)';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (!element.classList.contains('highlighted')) {
                    element.style.transform = '';
                }
            });
        });
    }

    setupScrollEffects() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupAccessibility() {
        // Keyboard navigation enhancement
        document.addEventListener('keydown', (e) => {
            // Skip to main content with Ctrl+/
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                const introSection = document.getElementById('introduction');
                if (introSection) {
                    introSection.focus();
                    this.announceSkipToContent();
                }
            }
        });

        // Focus management for modals and overlays
        this.setupFocusTrapping();
        
        // Add ARIA labels where needed
        this.enhanceARIALabels();
    }

    setupFocusTrapping() {
        const focusableSelectors = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = Array.from(document.querySelectorAll(focusableSelectors));
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    enhanceARIALabels() {
        // Add labels to interactive elements
        const expandButtons = document.querySelectorAll('.expand-btn');
        expandButtons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                const section = button.closest('.expandable-content');
                const title = section.querySelector('h2, h3')?.textContent || 'Content section';
                button.setAttribute('aria-label', `Expand ${title}`);
                button.setAttribute('aria-expanded', 'false');
            }
        });

        // Add labels to tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('resourceSearch');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput || !searchResults) {
            return;
        }

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value.trim());
            }, 300);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(searchInput.value.trim());
            }
        });

        // Also set up the global search button
        const searchButton = document.querySelector('.search-container .btn');
        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch(searchInput.value.trim());
            });
        }
    }

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        
        if (!searchResults) {
            return;
        }
        
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        // Simple search through resource content
        const allResources = document.querySelectorAll('.resource-item, .paper-item, .finding-item');
        const results = [];

        allResources.forEach((item, index) => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                const title = item.querySelector('h4')?.textContent || item.querySelector('h5')?.textContent || `Resource ${index + 1}`;
                const excerpt = this.extractExcerpt(text, query.toLowerCase());
                results.push({ title, excerpt, element: item });
            }
        });

        this.displaySearchResults(results, query);
        this.announceSearchResults(results.length, query);
    }

    extractExcerpt(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text.substring(0, 100) + '...';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + query.length + 50);
        let excerpt = text.substring(start, end);
        
        if (start > 0) excerpt = '...' + excerpt;
        if (end < text.length) excerpt = excerpt + '...';
        
        return excerpt;
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = `<p class="no-results">No results found for "${query}"</p>`;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result-item">
                <h5>${result.title}</h5>
                <p>${this.highlightSearchTerms(result.excerpt, query)}</p>
            </div>
        `).join('');

        searchResults.innerHTML = `
            <h4>Search Results (${results.length})</h4>
            ${resultsHTML}
        `;
    }

    highlightSearchTerms(text, query) {
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Accessibility announcements
    announcePageLoad() {
        this.createAriaLiveRegion();
        setTimeout(() => {
            this.announceToScreenReader('AI-Enhanced UDL interactive webpage loaded. Use navigation menu to explore sections.');
        }, 1000);
    }

    createAriaLiveRegion() {
        if (document.getElementById('aria-announcer')) return;
        
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('aria-announcer');
        if (announcer) {
            announcer.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    announceNavigation(section) {
        const sectionTitle = section.querySelector('h2, h1')?.textContent || 'Section';
        this.announceToScreenReader(`Navigated to ${sectionTitle}`);
    }

    announceContentToggle(section, isExpanded) {
        const sectionTitle = section.querySelector('h2, h3')?.textContent || 'Content section';
        const state = isExpanded ? 'expanded' : 'collapsed';
        this.announceToScreenReader(`${sectionTitle} ${state}`);
    }

    announceTabChange(tabName) {
        this.announceToScreenReader(`Switched to ${tabName} tab`);
    }

    announceCaseStudyToggle(studyTitle, isExpanded) {
        const state = isExpanded ? 'expanded' : 'collapsed';
        this.announceToScreenReader(`${studyTitle} case study ${state}`);
    }

    announceResourceCategoryChange(categoryName) {
        this.announceToScreenReader(`Switched to ${categoryName} resources`);
    }

    announceCardHighlight(cardTitle) {
        this.announceToScreenReader(`${cardTitle} card highlighted`);
    }

    announceSkipToContent() {
        this.announceToScreenReader('Skipped to main content');
    }

    announceSearchResults(count, query) {
        this.announceToScreenReader(`Found ${count} results for ${query}`);
    }
}

// Global functions for inline event handlers
function searchResources() {
    const searchInput = document.getElementById('resourceSearch');
    if (searchInput && window.aiudlApp) {
        window.aiudlApp.performSearch(searchInput.value.trim());
    }
}

function downloadImplementationGuide() {
    // Create a simple implementation guide document
    const guideContent = `AI-UDL Implementation Checklist

Phase 1: Assessment & Planning (Months 1-2)
☐ Conduct comprehensive UDL needs assessment
☐ Identify current accessibility gaps
☐ Research available AI tools and platforms
☐ Assess technical infrastructure requirements
☐ Develop pilot program parameters
☐ Establish baseline accessibility metrics
☐ Secure administrative support and funding

Phase 2: Professional Development (Months 2-4)
☐ Train educators on UDL principles
☐ Introduce AI tools and applications
☐ Establish ethical guidelines and best practices
☐ Create professional learning communities
☐ Develop technical support systems
☐ Design assessment rubrics for AI-UDL integration

Phase 3: Gradual Implementation (Months 4-8)
☐ Deploy pilot programs in selected classrooms
☐ Implement AI-powered accessibility tools
☐ Gather continuous feedback from stakeholders
☐ Monitor student engagement and outcomes
☐ Iterate and improve based on data
☐ Address technical and pedagogical challenges
☐ Document best practices and lessons learned

Phase 4: Full Integration (Months 8+)
☐ Scale successful initiatives institution-wide
☐ Implement continuous monitoring systems
☐ Maintain ongoing professional development
☐ Establish evaluation and assessment protocols
☐ Contribute to research and best practice sharing
☐ Plan for sustainability and future updates

Key Considerations:
• Digital equity and access for all students
• Privacy and data security protocols
• Ethical use of AI in educational settings
• Balance between technology and human interaction
• Ongoing support and professional development needs

For more information, visit: https://udlguidelines.cast.org/`;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI-UDL-Implementation-Checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Announce download
    if (window.aiudlApp) {
        window.aiudlApp.announceToScreenReader('AI-UDL Implementation Checklist downloaded');
    }
}

function shareContent(platform) {
    const title = 'AI as a Universal Design for Learning Tool: Transforming Inclusive Education';
    const url = window.location.href;
    const text = 'Discover how artificial intelligence enhances Universal Design for Learning principles to create more inclusive educational experiences.';

    let shareUrl;
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
            break;
        default:
            return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // Announce share action
    if (window.aiudlApp) {
        window.aiudlApp.announceToScreenReader(`Shared content via ${platform}`);
    }
}

// Enhanced CSS for interactive elements
function addInteractiveStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .highlighted {
            box-shadow: 0 0 0 3px var(--color-primary) !important;
            transform: scale(1.02) !important;
            transition: all 0.3s ease !important;
        }
        
        .sr-only {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        }
        
        .visible {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .search-result-item {
            background-color: var(--color-surface);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            border: 1px solid var(--color-border);
            margin-bottom: var(--space-12);
        }
        
        .search-result-item h5 {
            color: var(--color-primary);
            margin-bottom: var(--space-8);
        }
        
        .search-result-item mark {
            background-color: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: 2px 4px;
            border-radius: 2px;
        }
        
        .no-results {
            text-align: center;
            color: var(--color-text-secondary);
            font-style: italic;
            padding: var(--space-20);
        }
        
        /* Loading states */
        .loading {
            position: relative;
            opacity: 0.7;
            pointer-events: none;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid var(--color-border);
            border-top: 2px solid var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Enhanced focus indicators */
        .principle-card:focus,
        .tech-item:focus,
        .case-study-card:focus,
        .resource-item:focus {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        /* Improved button states */
        .expand-btn:focus,
        .tab-btn:focus,
        .category-btn:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 1px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add interactive styles
    addInteractiveStyles();
    
    // Initialize the main application
    window.aiudlApp = new AIUDLApp();
    
    // Add performance monitoring
    if ('PerformanceObserver' in window) {
        const performanceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log('Page load performance:', {
                        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                        loadComplete: entry.loadEventEnd - entry.loadEventStart
                    });
                }
            }
        });
        
        performanceObserver.observe({ entryTypes: ['navigation'] });
    }
    
    // Add error handling
    window.addEventListener('error', (event) => {
        console.error('Application error:', event.error);
        // In a production environment, this could report to an error tracking service
    });
    
    // Handle online/offline states
    window.addEventListener('online', () => {
        if (window.aiudlApp) {
            window.aiudlApp.announceToScreenReader('Connection restored');
        }
    });
    
    window.addEventListener('offline', () => {
        if (window.aiudlApp) {
            window.aiudlApp.announceToScreenReader('Connection lost. Some features may not be available.');
        }
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        AIUDLApp,
        searchResources,
        downloadImplementationGuide,
        shareContent
    };
}