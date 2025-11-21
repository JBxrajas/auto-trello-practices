module.exports = {
    titleText: 'Capture, organize, and tackle your to-dos from anywhere | Trello',
    navContainer: 'header',
    featureElement: 'button[data-testid="bignav-tab"]',
    
    // Feature navigation items with their expected paths (from the HTML)
    features: [
        { label: 'Inbox', path: '/inbox' },
        { label: 'Planner', path: '/planner' },
        { label: 'Automation', path: '/butler-automation' },
        { label: 'Power-Ups', path: '/power-ups' },
        { label: 'Templates', path: '/templates' },
        { label: 'Integrations', path: '/integrations' }
    ],

    // Individual feature selectors (direct links from the HTML)
    featuresInbox: 'a[href="/inbox"]',
    featuresPlanner: 'a[href="/planner"]',
    featuresAutomation: 'a[href="/butler-automation"]',
    featuresPowerUps: 'a[href="/power-ups"]',
    featuresTemplates: 'a[href="/templates"]',
    featuresIntegrations: 'a[href="/integrations"]'
};