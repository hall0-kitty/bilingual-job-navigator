// Main Application
document.addEventListener('DOMContentLoaded', function() {
    // Current language state
    let currentLang = 'en';
    
    // Sample data - In real app, this would come from API
    const sampleJobs = [
        {
            id: 1,
            title: "Frontend Developer",
            titleJa: "フロントエンド開発者",
            company: "Rakuten Osaka",
            location: "Osaka, Japan",
            locationJa: "大阪府",
            type: "fullstack",
            country: "jp",
            description: "Join our e-commerce team building next-gen web applications.",
            descriptionJa: "次世代Webアプリケーションを構築するECチームに参加。"
        },
        {
            id: 2,
            title: "Junior JavaScript Developer",
            titleJa: "ジュニアJavaScript開発者",
            company: "Tech Startup Osaka",
            location: "Osaka, Japan",
            locationJa: "大阪府",
            type: "frontend",
            country: "jp",
            description: "Looking for motivated junior developers to grow with our team.",
            descriptionJa: "チームと共に成長できるやる気のあるジュニア開発者を募集。"
        },
        {
            id: 3,
            title: "Bilingual Web Developer",
            titleJa: "バイリンガルWeb開発者",
            company: "Global IT Osaka",
            location: "Osaka, Japan",
            locationJa: "大阪府",
            type: "fullstack",
            country: "jp",
            description: "Work with international clients on web projects. Japanese/English required.",
            descriptionJa: "国際的なクライアントとWebプロジェクトを遂行。日英バイリンガル必須。"
        }
    ];
    
    // Interview questions by culture
    const interviewQuestions = {
        jp: [
            "自己紹介をお願いします。",
            "当社を志望する理由は何ですか？",
            "これまでの仕事で困難だったことは？",
            "チームワークについてどう考えますか？"
        ],
        us: [
            "Tell me about yourself.",
            "Why do you want to work here?",
            "What's your greatest weakness?",
            "Where do you see yourself in 5 years?"
        ],
        tech: [
            "Explain how closures work in JavaScript.",
            "What's the difference between let, const, and var?",
            "How does the event loop work?",
            "Explain REST API principles."
        ]
    };
    
    // Cultural notes for interviews
    const cultureNotes = {
        jp: "Important: Be humble, emphasize teamwork, avoid direct confrontation.",
        us: "Important: Be confident, highlight individual achievements, ask questions.",
        tech: "Important: Explain clearly, show problem-solving process, admit what you don't know."
    };
    
    // Initialize app
    initLanguageToggle();
    updateAllText();
    loadJobListings();
    setupEventListeners();
    updateStats();
    
    // Language Toggle Function
    function initLanguageToggle() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                langButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update current language
                currentLang = this.dataset.lang;
                
                // Update all text on page
                updateAllText();
                
                // Update job listings for new language
                loadJobListings();
            });
        });
    }
    
    // Update all text elements based on current language
    function updateAllText() {
        // Update elements with data-en and data-ja attributes
        document.querySelectorAll('[data-en], [data-ja]').forEach(element => {
            if (currentLang === 'en' && element.dataset.en) {
                if (element.tagName === 'INPUT' && element.dataset.enPlaceholder) {
                    element.placeholder = element.dataset.enPlaceholder;
                } else {
                    element.textContent = element.dataset.en;
                }
            } else if (currentLang === 'ja' && element.dataset.ja) {
                if (element.tagName === 'INPUT' && element.dataset.jaPlaceholder) {
                    element.placeholder = element.dataset.jaPlaceholder;
                } else {
                    element.textContent = element.dataset.ja;
                }
            }
        });
        
        // Update HTML lang attribute
        document.getElementById('html-root').lang = currentLang;
    }
    
    // Load and display job listings
    function loadJobListings() {
        const jobListings = document.getElementById('job-listings');
        const countryFilter = document.getElementById('country-filter').value;
        const typeFilter = document.getElementById('job-type-filter').value;
        
        // Filter jobs
        let filteredJobs = sampleJobs.filter(job => {
            const countryMatch = countryFilter === 'all' || job.country === countryFilter;
            const typeMatch = typeFilter === 'all' || job.type === typeFilter;
            return countryMatch && typeMatch;
        });
        
        // Clear current listings
        jobListings.innerHTML = '';
        
        // Display jobs
        if (filteredJobs.length === 0) {
            jobListings.innerHTML = `
                <p class="loading-text">
                    ${currentLang === 'en' ? 'No jobs found' : '該当する求人がありません'}
                </p>
            `;
            return;
        }
        
        filteredJobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h3 class="job-title">${currentLang === 'en' ? job.title : job.titleJa}</h3>
                <p class="job-company">${job.company}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${currentLang === 'en' ? job.location : job.locationJa}</span>
                    <span><i class="fas fa-globe"></i> ${job.country.toUpperCase()}</span>
                </div>
                <p class="job-description">${currentLang === 'en' ? job.description : job.descriptionJa}</p>
                <button class="apply-btn" data-job-id="${job.id}">
                    ${currentLang === 'en' ? 'Apply Now' : '応募する'}
                </button>
            `;
            jobListings.appendChild(jobCard);
        });
        
        // Add apply button listeners
        document.querySelectorAll('.apply-btn').forEach(button => {
            button.addEventListener('click', function() {
                const jobId = this.dataset.jobId;
                applyToJob(jobId);
            });
        });
    }
    
    // Apply to a job
    function applyToJob(jobId) {
        // Get current stats
        let applied = parseInt(localStorage.getItem('appliedCount') || '0');
        let interviewed = parseInt(localStorage.getItem('interviewCount') || '0');
        
        // Increment applied count
        applied++;
        localStorage.setItem('appliedCount', applied.toString());
        
        // Random chance of interview (20%)
        if (Math.random() < 0.2) {
            interviewed++;
            localStorage.setItem('interviewCount', interviewed.toString());
        }
        
        // Update UI
        updateStats();
        
        // Show confirmation
        alert(currentLang === 'en' 
            ? `Application submitted! You've applied to ${applied} jobs.` 
            : `応募しました！現在${applied}件の応募があります。`);
    }
    
    // Update statistics display
    function updateStats() {
        const applied = parseInt(localStorage.getItem('appliedCount') || '0');
        const interviewed = parseInt(localStorage.getItem('interviewCount') || '0');
        const responseRate = applied > 0 ? Math.round((interviewed / applied) * 100) : 0;
        
        document.getElementById('applied-count').textContent = applied;
        document.getElementById('interview-count').textContent = interviewed;
        document.getElementById('response-rate').textContent = `${responseRate}%`;
    }
    
    // Interview practice functions
    let currentQuestionIndex = 0;
    let isRecording = false;
    let recordingTime = 0;
    let timerInterval;
    
    function setupInterviewPractice() {
        const newQuestionBtn = document.getElementById('new-question-btn');
        const cultureSelect = document.getElementById('culture-select');
        const recordBtn = document.getElementById('record-btn');
        
        newQuestionBtn.addEventListener('click', getNewQuestion);
        cultureSelect.addEventListener('change', getNewQuestion);
        recordBtn.addEventListener('click', toggleRecording);
        
        // Get first question
        getNewQuestion();
    }
    
    function getNewQuestion() {
        const culture = document.getElementById('culture-select').value;
        const questions = interviewQuestions[culture];
        
        // Get random question
        currentQuestionIndex = Math.floor(Math.random() * questions.length);
        
        // Update display
        document.getElementById('current-question').textContent = questions[currentQuestionIndex];
        document.getElementById('culture-notes').textContent = cultureNotes[culture];
    }
    
    function toggleRecording() {
        const recordBtn = document.getElementById('record-btn');
        const timer = document.getElementById('recording-timer');
        
        if (!isRecording) {
            // Start recording
            isRecording = true;
            recordBtn.classList.add('recording');
            recordBtn.innerHTML = '<i class="fas fa-stop"></i>';
            
            // Start timer
            recordingTime = 0;
            timerInterval = setInterval(() => {
                recordingTime++;
                const minutes = Math.floor(recordingTime / 60).toString().padStart(2, '0');
                const seconds = (recordingTime % 60).toString().padStart(2, '0');
                timer.textContent = `${minutes}:${seconds}`;
            }, 1000);
            
        } else {
            // Stop recording
            isRecording = false;
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            
            // Stop timer
            clearInterval(timerInterval);
            
            // Save recording time
            const culture = document.getElementById('culture-select').value;
            savePracticeSession(culture, recordingTime);
        }
    }
    
    function savePracticeSession(culture, duration) {
        // Save to localStorage
        const sessions = JSON.parse(localStorage.getItem('practiceSessions') || '[]');
        sessions.push({
            date: new Date().toISOString(),
            culture: culture,
            duration: duration,
            question: interviewQuestions[culture][currentQuestionIndex]
        });
        localStorage.setItem('practiceSessions', JSON.stringify(sessions));
    }
    
    // Resume template functions
    function setupResumeBuilder() {
        document.querySelectorAll('.template-btn').forEach(button => {
            button.addEventListener('click', function() {
                const template = this.dataset.template;
                previewResume(template);
            });
        });
    }
    
    function previewResume(template) {
        const preview = document.getElementById('resume-preview');
        
        const templates = {
            jp: {
                en: "Japanese Resume Format\n\n• Personal Information at top\n• Work experience in chronological order\n• Education details\n• Skills and qualifications\n• Photo on right side\n• Humble language style",
                ja: "日本式履歴書\n\n• 個人情報を上部に\n• 職歴を時系列で\n• 学歴詳細\n• スキルと資格\n• 写真を右側に\n• 謙虚な表現スタイル"
            },
            us: {
                en: "US Resume Format\n\n• Contact information\n• Professional summary\n• Work experience with achievements\n• Education\n• Skills (technical & soft)\n• No photo or age\n• Action-oriented language",
                ja: "アメリカ式履歴書\n\n• 連絡先情報\n• プロフェッショナルサマリー\n• 実績のある職務経験\n• 教育\n• スキル（技術・ソフト）\n• 写真・年齢なし\n• 行動志向の表現"
            },
            bilingual: {
                en: "Bilingual Resume Format\n\n• Both Japanese and English sections\n• Cultural adaptation notes\n• Translation of key terms\n• Format acceptable in both cultures\n• Highlights bilingual advantage",
                ja: "バイリンガル履歴書\n\n• 日英両方のセクション\n• 文化的適応の注記\n• 重要な用語の翻訳\n• 両文化で受け入れ可能な形式\n• バイリンガル強みの強調"
            }
        };
        
        preview.innerHTML = `
            <div class="resume-template">
                <h3>${currentLang === 'en' ? 'Template Preview' : 'テンプレートプレビュー'}</h3>
                <pre>${templates[template][currentLang]}</pre>
                <button class="download-btn">
                    ${currentLang === 'en' ? 'Download Template' : 'テンプレートをダウンロード'}
                </button>
            </div>
        `;
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        // Job search
        document.getElementById('search-btn').addEventListener('click', loadJobListings);
        document.getElementById('job-search').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') loadJobListings();
        });
        
        // Filters
        document.getElementById('country-filter').addEventListener('change', loadJobListings);
        document.getElementById('job-type-filter').addEventListener('change', loadJobListings);
        
        // Resume builder
        setupResumeBuilder();
        
        // Interview practice
        setupInterviewPractice();
    }
});