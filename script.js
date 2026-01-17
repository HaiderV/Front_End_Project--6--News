// Mock Data Configuration (Entertainment & General kept as is)
const IMAGES = {
    anime: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop",
    entertainment: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?q=80&w=600&auto=format&fit=crop",
    general: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop"
};

const NEWS_DATA = {
    anime: [], // Will be populated by API
    entertainment: [
        {
            id: 1,
            title: "Blockbuster 'Galactic Wars' Breaks Box Office Records",
            image: IMAGES.entertainment,
            description: "The sci-fi epic has surpassed $1 billion in its opening weekend, setting a new standard for cinematic releases.",
            pubDate: "2026-01-14 10:00:00",
            link: "#"
        },
        {
            id: 2,
            title: "Music Awards 2026: The Full Winners List",
            image: IMAGES.entertainment,
            description: "Surprise wins and stunning performances defined this year's ceremony. See who took home the golden trophies.",
            pubDate: "2026-01-15 20:30:00",
            link: "#"
        },
        // ... (keeping other mock items simpler for brevity, or I can keep them all if I want to be safe, but user only asked for Anime API)
        {
            id: 3,
            title: "Streaming Service X merges with Giant Y",
            image: IMAGES.entertainment,
            description: "A massive consolidation in the streaming world. What does this mean for your subscription prices and content library?",
           pubDate: "2026-01-10 12:00:00",
            link: "#"
        },
        {
            id: 4,
            title: "Actor Z Talks method acting for new Role",
            image: IMAGES.entertainment,
            description: "In an exclusive interview, the star reveals the intense preparation required for their transformative performance.",
            pubDate: "2026-01-12 15:45:00",
            link: "#"
        },
        {
            id: 5,
            title: "Viral Trend Takes Over Social Media",
            image: IMAGES.entertainment,
            description: "Everyone from celebrities to your neighbors is doing it. We explain the origin of the latest dance craze.",
            pubDate: "2026-01-08 09:15:00",
            link: "#"
        },
        {
            id: 6,
            title: "Upcoming series to binge this weekend",
            image: IMAGES.entertainment,
            description: "Not sure what to watch? We've curated a list of the most binge-worthy shows releasing this Friday.",
            pubDate: "2026-01-16 14:00:00",
            link: "#"
        }
    ],
    general: [
        {
            id: 1,
            title: "Global Summit Addresses Climate Action Goals",
            image: IMAGES.general,
            description: "World leaders gather to discuss urgent measures required to meet the 2030 sustainability targets.",
            pubDate: "2026-01-15 11:30:00",
            link: "#"
        },
        // Keeping only top items for brevity in replacement, can assume others exist or just replace all 
         {
            id: 2,
            title: "Tech Giant Unveils Revolutionary Quantum Processor",
            image: IMAGES.general,
            description: "The new chip promises to solve complex problems millions of times faster than current supercomputers.",
            pubDate: "2026-01-14 08:00:00",
             link: "#"
        },
         {
            id: 3,
            title: "Stock Markets Rally Amidst Economic Optimism",
            image: IMAGES.general,
            description: "Indices hit record highs as inflation data comes in lower than expected, signaling a strong economic recovery.",
            pubDate: "2026-01-13 16:20:00",
             link: "#"
        },
        {
            id: 4,
            title: "New Mars Rover Sends Back Stunning Panorama",
            image: IMAGES.general,
            description: "NASA's latest explorer captures the most detailed images of the Red Planet's surface to date.",
            pubDate: "2026-01-11 13:10:00",
             link: "#"
        },
         {
            id: 5,
            title: "Breakthrough in Medical Science: Cure for X?",
            image: IMAGES.general,
            description: "Researchers announce promising results from early clinical trials, offering hope for millions.",
            pubDate: "2026-01-09 10:50:00",
             link: "#"
        },
         {
            id: 6,
            title: "City Infrastructure Overhaul Approved",
            image: IMAGES.general,
            description: "The massive project aims to modernize public transport and green spaces over the next five years.",
            pubDate: "2026-01-07 14:40:00",
             link: "#"
        }
    ]
};

// DOM Elements
const newsContainer = document.getElementById('news-container');
const navButtons = document.querySelectorAll('.nav-btn:not(.menu-btn)'); // Exclude menu btn from standard tabs
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarItems = document.querySelectorAll('.sidebar-item');

// State
let currentCategory = 'anime';

// Helper: Format Date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Fetch News for Category
async function fetchNews(category) {
    const API_KEY = '802fab3b6b024931bb0084aedc728938';
    
    // Define specific keywords for each category
    const queries = {
        anime: 'anime AND (manga OR series OR animation) -bitcoin -crypto -ethereum -trading',
        entertainment: '(movie OR cinema OR "box office" OR hollywood OR "TV series" OR "Netflix") -stock -trading -bitcoin',
        general: '("breaking news" OR "world news" OR "technology") -crypto -bitcoin',
        technology: 'technology AND (AI OR crypto OR gadgets OR software) -bitcoin',
        gaming: 'gaming AND (console OR PC OR esports OR "video games")',
        sports: 'sports AND (football OR basketball OR soccer OR olympics)',
        science: 'science AND (space OR biology OR physics OR research)',
        health: 'health AND (medicine OR wellness OR fitness OR nutrition)',
        politics: 'politics AND (government OR election OR policy)',
        fashion: 'fashion AND (style OR trends OR designer OR clothing)',
        travel: 'travel AND (tourism OR destination OR vacation OR guide)',
        music: 'music AND (concert OR album OR artist OR band)',
        business: 'business AND (market OR economy OR startup OR finance)'
    };

    // Fallback to category name if specific query not defined
    const queryTerm = queries[category] || category;
    const q = encodeURIComponent(queryTerm);
    
    // Fetch enough articles to get 12 valid ones
    const url = `https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            // Filter out articles that have no images or "removed" content
            const validArticles = data.articles.filter(a => a.urlToImage && !a.title.includes("Removed"));
            
            // Map the articles to our structure - INCREASED TO 12
            NEWS_DATA[category] = validArticles.slice(0, 12).map((article, index) => ({
                id: index,
                title: article.title,
                image: article.urlToImage,
                description: article.description || "Click to read the full story.",
                pubDate: article.publishedAt,
                link: article.url
            }));
            
            // Only render if this is still the current category (avoid race conditions)
            if (currentCategory === category) {
                renderNews(category);
            }
        }
    } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
    }
}

// Render Function
function renderNews(category) {
    // Clear container
    newsContainer.innerHTML = '';
    
    // Get data or init empty array
    const newsItems = NEWS_DATA[category] || [];

    if (!newsItems || newsItems.length === 0) {
        newsContainer.innerHTML = '<p style="color:var(--text-secondary); text-align:center; grid-column: 1/-1;">Loading news...</p>';
        // Trigger fetch if empty and likely not fetched yet
        if (!NEWS_DATA[category]) {
             NEWS_DATA[category] = []; // Prevent tight loop
             fetchNews(category);
        }
        return;
    }

    // Create Elements
    newsItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';

        const imgSrc = item.image;
        const dateStr = formatDate(item.pubDate);
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${imgSrc}" alt="${item.title}" class="card-image">
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
            </div>
            
            <!-- Hover Overlay -->
            <div class="news-overlay">
                <div class="overlay-date">${dateStr}</div>
                <p class="overlay-description">${item.description}</p>
                <a href="${item.link || '#'}" target="_blank" class="read-more">Read Full Story</a>
            </div>
        `;

        newsContainer.appendChild(card);
    });
}

// Sidebar Logic
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

menuBtn.addEventListener('click', toggleSidebar);
closeBtn.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', toggleSidebar);

// Handle specific category clicks from Sidebar
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        
        // Update State
        currentCategory = category;

        // Reset top nav active state
        navButtons.forEach(b => b.classList.remove('active'));
        
        // Close sidebar
        toggleSidebar();

        // Render (and fetch if needed)
        renderNews(category);
        if (!NEWS_DATA[category] || NEWS_DATA[category].length === 0) {
             fetchNews(category);
        }
    });
});

// Event Listeners for Top Nav
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        
        // Update State
        currentCategory = category;

        // Update UI Tabs
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Render
        renderNews(category);
        fetchNews(category);
    });
});

// Initial Render & Fetch
document.addEventListener('DOMContentLoaded', () => {
    renderNews(currentCategory); 
    fetchNews(currentCategory);

    // Auto-hide Info Button on Scroll
    const infoBtn = document.querySelector('.info-btn');
    const header = document.querySelector('.app-header');

    if (infoBtn && header) {
        let observer;

        const setupObserver = () => {
             if (observer) observer.disconnect();

             const headerHeight = header.offsetHeight + 10; // + buffer

             observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Start hiding clearly when it hits the header zone
                    if (!entry.isIntersecting && entry.boundingClientRect.top < headerHeight) {
                        infoBtn.classList.add('hidden');
                    } else {
                        infoBtn.classList.remove('hidden');
                    }
                });
            }, {
                root: null,
                threshold: 0,
                // Ensure the rootMargin matches the current header height
                rootMargin: `-${headerHeight}px 0px 0px 0px`
            });
            
            observer.observe(infoBtn);
        };

        // Initial setup
        setupObserver();

        // Re-calculate on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setupObserver, 100);
        });
    }
});
