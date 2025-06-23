document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const toggle = document.getElementById('toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const html = document.documentElement;

    // Check for saved user preference (if any)
    if (toggle && mobileToggle) {
        if (localStorage.getItem('darkMode') === 'true') {
            html.classList.add('dark');
            toggle.checked = true;
            mobileToggle.checked = true;
        }

        // Toggle dark mode
        function toggleDarkMode(isDark) {
            if (isDark) {
                html.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                html.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
        }

        toggle.addEventListener('change', (e) => {
            toggleDarkMode(e.target.checked);
            mobileToggle.checked = e.target.checked;
        });

        mobileToggle.addEventListener('change', (e) => {
            toggleDarkMode(e.target.checked);
            toggle.checked = e.target.checked;
        });
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Fetch hymns from hymn.json
    let hymns = [];

    fetch('Hymn.json')
        .then(response => response.json())
        .then(data => {
            hymns = data;
            renderHymns(hymns);
        })
        .catch(error => console.error('Error loading hymn data:', error));

    const prayers = [
        {
            id: 1,
            title: "Morning Prayer",
            text: "Almighty God, who has safely brought us to the beginning of this day: Defend us by thy mighty power, that we may not fall into sin nor run into any danger; and that, guided by thy Spirit, we may do what is righteous in thy sight; through Christ our Lord. Amen.",
            category: "morning"
        },
        {
            id: 2,
            title: "Evening Prayer",
            text: "Lighten our darkness, we beseech thee, O Lord; and by thy great mercy defend us from all perils and dangers of this night; for the love of thy only Son, our Savior Jesus Christ. Amen.",
            category: "evening"
        },
        {
            id: 3,
            title: "Prayer of Confession",
            text: "Most merciful God, we confess that we have sinned against thee in thought, word, and deed, by what we have done, and by what we have left undone. We have not loved thee with our whole heart; we have not loved our neighbors as ourselves. We are truly sorry and we humbly repent. For the sake of thy Son Jesus Christ, have mercy on us and forgive us; that we may delight in thy will, and walk in thy ways, to the glory of thy name. Amen.",
            category: "confession"
        },
        {
            id: 4,
            title: "Prayer of Thanksgiving",
            text: "Almighty God, Father of all mercies, we thine unworthy servants do give thee most humble and hearty thanks for all thy goodness and loving-kindness to us and to all men. We bless thee for our creation, preservation, and all the blessings of this life; but above all for thine inestimable love in the redemption of the world by our Lord Jesus Christ; for the means of grace, and for the hope of glory. And we beseech thee, give us that due sense of all thy mercies, that our hearts may be unfeignedly thankful; and that we show forth thy praise, not only with our lips, but in our lives, by giving up ourselves to thy service, and by walking before thee in holiness and righteousness all our days; through Jesus Christ our Lord, to whom, with thee and the Holy Spirit, be all honor and glory, world without end. Amen.",
            category: "thanksgiving"
        },
        {
            id: 5,
            title: "The Lord's Prayer",
            text: "Our Father, who art in heaven, hallowed be thy Name. Thy kingdom come. Thy will be done, on earth as it is in heaven. Give us this day our daily bread. And forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. For thine is the kingdom, and the power, and the glory, forever and ever. Amen.",
            category: "all"
        }
    ];

    const oldTestamentBooks = [
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
        "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
        "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
        "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
        "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
        "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
        "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
        "Zephaniah", "Haggai", "Zechariah", "Malachi"
    ];

    const newTestamentBooks = [
        "Matthew", "Mark", "Luke", "John", "Acts",
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
        "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
        "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
        "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
        "Jude", "Revelation"
    ];

    const bibleVersions = {
        "kjv": "King James Version",
        "niv": "New International Version",
        "esv": "English Standard Version"
    };

    // Sample daily verses (in a real app, this would come from an API)
    const dailyVerses = [
        {
            reference: "John 3:16",
            text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
        },
        {
            reference: "Philippians 4:13",
            text: "I can do all things through Christ which strengtheneth me."
        },
        {
            reference: "Psalm 23:1",
            text: "The LORD is my shepherd; I shall not want."
        },
        {
            reference: "Romans 8:28",
            text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."
        },
        {
            reference: "Proverbs 3:5-6",
            text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths."
        }
    ];

    // Bible Section Dropdown Population
    const testamentSelect = document.getElementById('testament');
    const bookSelect = document.getElementById('book');
    const chapterSelect = document.getElementById('chapter');

    function populateBooks() {
        bookSelect.innerHTML = '';
        const books = testamentSelect.value === 'old' ? oldTestamentBooks : newTestamentBooks;
        books.forEach((book, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = book;
            bookSelect.appendChild(option);
        });
        populateChapters();
    }

    function populateChapters() {
        chapterSelect.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Chapter ${i}`;
            chapterSelect.appendChild(option);
        }
    }

    testamentSelect.addEventListener('change', populateBooks);
    bookSelect.addEventListener('change', populateChapters);
    // Initial population
    populateBooks();

    // Bible Section Functionality
    const loadBibleBtn = document.getElementById('load-bible');
    const dailyVerse = document.getElementById('daily-verse');
    const refreshVerseBtn = document.getElementById('refresh-verse');
    const bibleContentContainer = document.querySelector('#bible .flex-1');

    // Use a more robust selector for the Bible nav panel
    const bibleNav = document.querySelector('#bible > div > div.flex > div');
    let bibleLanguage = 'english'; // or 'zulu'
    let langToggleBtn;
    if (bibleNav) {
        langToggleBtn = document.createElement('button');
        langToggleBtn.id = 'bible-lang-toggle';
        langToggleBtn.className = 'w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors mt-2';
        langToggleBtn.textContent = 'Switch to Zulu Bible';
        bibleNav.appendChild(langToggleBtn);
        langToggleBtn.addEventListener('click', function() {
            if (bibleLanguage === 'english') {
                bibleLanguage = 'zulu';
                langToggleBtn.textContent = 'Switch to English Bible';
            } else {
                bibleLanguage = 'english';
                langToggleBtn.textContent = 'Switch to Zulu Bible';
            }
            loadBibleContent();
        });
    }

    function loadBibleContent() {
        const testament = testamentSelect.value;
        const bookIndex = parseInt(bookSelect.value);
        const bookName = testament === 'old' ? oldTestamentBooks[bookIndex - 1] : newTestamentBooks[bookIndex - 1];
        const chapter = parseInt(chapterSelect.value);
        bibleContentContainer.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">${bookName} ${chapter} (${bibleLanguage === 'zulu' ? 'Zulu' : 'English'})</h3>
                    <div class="flex items-center">
                        <select class="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="kjv">KJV</option>
                            <option value="niv">NIV</option>
                            <option value="esv">ESV</option>
                        </select>
                    </div>
                </div>
                <div class="book-content prose dark:prose-invert max-w-none h-96 overflow-y-auto">
                    <p class="mb-4">${bibleLanguage === 'zulu' ? '1 Ekuqaleni uNkulunkulu wadala izulu nomhlaba.' : '1 In the beginning God created the heaven and the earth.'}</p>
                    <p class="mb-4">${bibleLanguage === 'zulu' ? '2 Umhlaba wawungenalutho, wawungenalutho; ubumnyama babuphezu kobuso bolwandle olujulile. UMoya kaNkulunkulu wawuhambahamba phezu kwamanzi.' : '2 And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.'}</p>
                    <p class="mb-4">${bibleLanguage === 'zulu' ? '3 UNkulunkulu wathi, "Makube khona ukukhanya," kwaba khona ukukhanya.' : '3 And God said, Let there be light: and there was light.'}</p>
                    <p class="mb-4">${bibleLanguage === 'zulu' ? '4 UNkulunkulu wabona ukuthi ukukhanya kuhle; uNkulunkulu wahlukanisa ukukhanya nobumnyama.' : '4 And God saw the light, that it was good: and God divided the light from the darkness.'}</p>
                    <p class="mb-4">${bibleLanguage === 'zulu' ? '5 UNkulunkulu waqamba ukukhanya uSuku, nobumnyama waqamba uBusuku. Kwaba ntambama, kwaba sekuseni, kwaba usuku lokuqala.' : '5 And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.'}</p>
                    <p>${bibleLanguage === 'zulu' ? 'Kulesi sikhathi, umbhalo weBhayibheli uzovela ngesiZulu uma ukhetha iZulu.' : 'In a fully implemented application, this would display the actual Bible text for the selected book and chapter from an API like Bible Gateway or YouVersion.'}</p>
                </div>
            </div>
        `;
    }

    function setDailyVerse() {
        const randomVerse = dailyVerses[Math.floor(Math.random() * dailyVerses.length)];
        dailyVerse.innerHTML = `<strong>${randomVerse.reference}</strong><br>${randomVerse.text}`;
    }

    loadBibleBtn.addEventListener('click', loadBibleContent);
    refreshVerseBtn.addEventListener('click', setDailyVerse);
    // Initial setup
    setDailyVerse();

    // Hymn Book Functionality
    function renderHymns(hymnsToDisplay) {
        const hymnsContainer = document.querySelector('#hymns .grid');
        hymnsContainer.innerHTML = '';
        hymnsToDisplay.forEach(hymn => {
            const lyricsText = hymn.lyrics || hymn.Lyrics || '';
            const firstLine = lyricsText ? lyricsText.split('\n')[0] + '...' : '';
            const hymnCard = document.createElement('div');
            hymnCard.className = 'book-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col';
            hymnCard.innerHTML = `
                <div class="p-6 flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${hymn.title || hymn.Title}</h3>
                            <span class="text-sm text-gray-600 dark:text-gray-400">Hymn #${hymn.number || hymn["Hymn Number"]}</span>
                        </div>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mt-4 line-clamp-4">${firstLine}</p>
                </div>
                <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <button class="view-hymn-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors" data-id="${hymn.id || hymn["Hymn Number"]}">
                        View Hymn
                    </button>
                </div>
            `;
            hymnsContainer.appendChild(hymnCard);
        });
        // Add event listeners to the view buttons
        document.querySelectorAll('.view-hymn-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('View Hymn button clicked'); // Debug log
                const hymnId = parseInt(e.target.getAttribute('data-id'));
                const hymn = hymns.find(h => (h.id || h["Hymn Number"]) === hymnId);
                if (!hymn) {
                    alert('Hymn not found!');
                    return;
                }
                const formattedLyrics = (hymn.lyrics || hymn.Lyrics).replace(/\n/g, '<br>');
                // Defensive: check modal elements
                if (!window.openModal) {
                    alert('Modal function not found!');
                    return;
                }
                openModal(`Hymn ${hymn.number || hymn["Hymn Number"]}: ${hymn.title || hymn.Title}`,
                    `<pre class="font-sans">${formattedLyrics}</pre>`,
                    hymnsToDisplay,
                    hymnsToDisplay.findIndex(h => (h.id || h["Hymn Number"]) === hymnId)
                );
                // Ensure modal is visible
                const modal = document.getElementById('book-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.style.display = 'block';
                }
            });
        });
    }

    fetch('Hymn.json')
        .then(response => response.json())
        .then(data => {
            hymns = data;
            renderHymns(hymns);
            // Hymn search functionality
            const hymnSearch = document.getElementById('hymn-search');
            hymnSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredHymns = hymns.filter(hymn => {
                    const title = hymn.title || hymn.Title || '';
                    const lyrics = hymn.lyrics || hymn.Lyrics || '';
                    const number = hymn.number || hymn["Hymn Number"] || '';
                    return (
                        title.toLowerCase().includes(searchTerm) ||
                        lyrics.toLowerCase().includes(searchTerm) ||
                        number.toString().includes(searchTerm)
                    );
                });
                renderHymns(filteredHymns);
            });
        })
        .catch(error => console.error('Error loading hymn data:', error));

    // Modal functionality for Hymns, Prayers, and Bible
    const modal = document.getElementById('book-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.querySelector('.book-content');
    const closeModal = document.getElementById('close-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const prevItemBtn = document.getElementById('prev-item');
    const nextItemBtn = document.getElementById('next-item');
    let currentItems = [];
    let currentIndex = 0;
    function openModal(title, content, items, index) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        currentItems = items;
        currentIndex = index;
        prevItemBtn.style.display = currentIndex > 0 ? 'inline-flex' : 'none';
        nextItemBtn.style.display = currentIndex < currentItems.length - 1 ? 'inline-flex' : 'none';
        modal.classList.remove('hidden');
        modal.classList.add('fade-in');
        document.body.style.overflow = 'hidden';
    }
    // Make openModal globally accessible
    window.openModal = openModal;
    function closeModalFunc() {
        modal.classList.add('hidden');
        modal.style.display = '';
        document.body.style.overflow = '';
    }
    closeModal.addEventListener('click', closeModalFunc);
    modalBackdrop.addEventListener('click', closeModalFunc);
    prevItemBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            const item = currentItems[currentIndex];
            // Check if it's a hymn (has lyrics or Lyrics)
            if (item.lyrics || item.Lyrics) {
                const formattedLyrics = (item.lyrics || item.Lyrics).replace(/\n/g, '<br>');
                modalTitle.textContent = `Hymn ${item.number || item["Hymn Number"]}: ${item.title || item.Title}`;
                modalContent.innerHTML = `<pre class="font-sans">${formattedLyrics}</pre>`;
            } else if (item.text) {
                modalTitle.textContent = item.title || '';
                modalContent.innerHTML = `<p>${item.text}</p>`;
            }
            prevItemBtn.style.display = currentIndex > 0 ? 'inline-flex' : 'none';
            nextItemBtn.style.display = currentIndex < currentItems.length - 1 ? 'inline-flex' : 'none';
        }
    });
    nextItemBtn.addEventListener('click', () => {
        if (currentIndex < currentItems.length - 1) {
            currentIndex++;
            const item = currentItems[currentIndex];
            // Check if it's a hymn (has lyrics or Lyrics)
            if (item.lyrics || item.Lyrics) {
                const formattedLyrics = (item.lyrics || item.Lyrics).replace(/\n/g, '<br>');
                modalTitle.textContent = `Hymn ${item.number || item["Hymn Number"]}: ${item.title || item.Title}`;
                modalContent.innerHTML = `<pre class="font-sans">${formattedLyrics}</pre>`;
            } else if (item.text) {
                modalTitle.textContent = item.title || '';
                modalContent.innerHTML = `<p>${item.text}</p>`;
            }
            nextItemBtn.style.display = currentIndex < currentItems.length - 1 ? 'inline-flex' : 'none';
            prevItemBtn.style.display = currentIndex > 0 ? 'inline-flex' : 'none';
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalFunc();
        }
    });
});
