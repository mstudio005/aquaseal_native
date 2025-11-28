// ===========================
// AquaSeal - Universal Video Downloader
// Platform-based Video Downloader
// ===========================

// Check if running in Capacitor (Android app)
const isCapacitor = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform && Capacitor.isNativePlatform();
const API_BASE_URL = 'http://localhost:3000/api';

// Capacitor Plugin Bridge
let PythonBridge = null;
if (isCapacitor && Capacitor.Plugins) {
    PythonBridge = Capacitor.Plugins.PythonBridge;
}

// Helper function to call Python via Capacitor or fallback to HTTP API
async function callPythonAPI(method, data) {
    if (isCapacitor && PythonBridge) {
        // Use embedded Python via Capacitor plugin
        try {
            switch(method) {
                case 'getVideoInfo':
                    return await PythonBridge.getVideoInfo(data);
                case 'getPlaylistInfo':
                    return await PythonBridge.getPlaylistInfo(data);
                case 'downloadVideo':
                    return await PythonBridge.downloadVideo(data);
                case 'downloadThumbnail':
                    return await PythonBridge.downloadThumbnail(data);
                default:
                    throw new Error('Unknown method: ' + method);
            }
        } catch (error) {
            console.error('Capacitor API error:', error);
            throw error;
        }
    } else {
        // Fallback to HTTP API for web/development
        let endpoint = '';
        switch(method) {
            case 'getVideoInfo':
                endpoint = '/video-info';
                break;
            case 'getPlaylistInfo':
                endpoint = '/playlist-info';
                break;
            case 'downloadVideo':
                endpoint = '/download';
                break;
            case 'downloadThumbnail':
                endpoint = '/download-thumbnail';
                break;
            default:
                throw new Error('Unknown method: ' + method);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'API request failed');
        }
        
        return await response.json();
    }
}

// ===========================
// Multi-Language Support
// ===========================
const TRANSLATIONS = {
    en: {
        tagline: 'Universal Video Downloader',
        choosePlatform: 'Choose Platform',
        selectWhere: 'Select where you want to download from',
        ytDesc: 'Videos, Shorts, Music',
        igDesc: 'Reels, Posts, Stories',
        fbDesc: 'Videos, Reels, Watch',
        ttDesc: 'Videos, Sounds',
        twDesc: 'Videos, GIFs',
        otherSites: 'Other Sites',
        otherDesc: '1000+ supported',
        viewAllSites: 'View All Supported Sites',
        fastDownloads: 'Fast Downloads',
        highSpeed: 'High-speed servers',
        multiQuality: 'Multiple Qualities',
        safeSecure: 'Safe & Secure',
        noData: 'No data stored',
        mobileReady: 'Mobile Ready',
        worksEverywhere: 'Works everywhere',
        back: 'Back',
        supportedSites: 'Supported Sites',
        searchSites: 'Search sites...',
        supportedWebsites: 'supported websites',
        howToUse: 'How to Use',
        tutorialIntro: 'Follow these simple steps to download videos from any platform',
        step1Title: 'Choose Platform',
        step1Desc: 'Select the platform from which you want to download (YouTube, Instagram, Facebook, etc.)',
        step2Title: 'Copy Video URL',
        step2Desc: 'Go to the video you want to download and copy its URL/link from the address bar or share button',
        step3Title: 'Paste URL',
        step3Desc: 'Paste the copied URL in the input field and tap "Get Video Info"',
        step4Title: 'Select Quality',
        step4Desc: 'Choose your preferred video quality (1080p, 720p, 480p, etc.)',
        step5Title: 'Download',
        step5Desc: 'Tap the "Download Video" button and wait for the download to complete',
        tipsTitle: '💡 Tips',
        tip1: 'Make sure you have a stable internet connection',
        tip2: 'Higher quality = larger file size',
        tip3: 'Downloaded videos are saved to your device\'s download folder',
        tip4: 'You can stop the download anytime using the Stop button',
        pasteUrl: 'Paste a video URL to download',
        getVideoInfo: 'Get Video Info',
        fetchingInfo: 'Fetching video information...',
        selectQuality: 'Select Quality',
        downloadVideo: 'Download Video',
        downloadThumbnail: 'Download Thumbnail',
        stop: 'Stop',
        madeWith: 'Made with',
        forVideoLovers: 'for video lovers.',
        selectLanguage: 'Select Language',
        playlistVideos: 'Playlist Videos',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        selectRange: 'Select Range:',
        applyRange: 'Apply',
        downloadQuality: 'Download Quality:',
        downloadSelected: 'Download Selected',
        downloadAll: 'Download All',
        stopAll: 'Stop All',
        errorEnterUrl: 'Please enter a video URL',
        errorValidUrl: 'Please enter a valid URL',
        errorBlocked: 'This website is not supported due to content policy restrictions.',
        errorFetchFailed: 'Failed to fetch video info. Make sure the backend server is running.'
    },
    ur: {
        tagline: 'یونیورسل ویڈیو ڈاؤنلوڈر',
        choosePlatform: 'پلیٹ فارم منتخب کریں',
        selectWhere: 'منتخب کریں کہ آپ کہاں سے ڈاؤنلوڈ کرنا چاہتے ہیں',
        ytDesc: 'ویڈیوز، شارٹس، میوزک',
        igDesc: 'ریلز، پوسٹس، اسٹوریز',
        fbDesc: 'ویڈیوز، ریلز، واچ',
        ttDesc: 'ویڈیوز، ساؤنڈز',
        twDesc: 'ویڈیوز، GIFs',
        otherSites: 'دیگر سائٹس',
        otherDesc: '1000+ معاون',
        viewAllSites: 'تمام معاون سائٹس دیکھیں',
        fastDownloads: 'تیز ڈاؤنلوڈز',
        highSpeed: 'تیز رفتار سرورز',
        multiQuality: 'متعدد کوالٹیز',
        safeSecure: 'محفوظ اور سیکیور',
        noData: 'کوئی ڈیٹا ذخیرہ نہیں',
        mobileReady: 'موبائل ریڈی',
        worksEverywhere: 'ہر جگہ کام کرتا ہے',
        back: 'واپس',
        supportedSites: 'معاون سائٹس',
        searchSites: 'سائٹس تلاش کریں...',
        supportedWebsites: 'معاون ویب سائٹس',
        howToUse: 'استعمال کا طریقہ',
        tutorialIntro: 'کسی بھی پلیٹ فارم سے ویڈیوز ڈاؤنلوڈ کرنے کے لیے ان آسان مراحل پر عمل کریں',
        step1Title: 'پلیٹ فارم منتخب کریں',
        step1Desc: 'وہ پلیٹ فارم منتخب کریں جہاں سے آپ ڈاؤنلوڈ کرنا چاہتے ہیں (یوٹیوب، انسٹاگرام، فیس بک وغیرہ)',
        step2Title: 'ویڈیو URL کاپی کریں',
        step2Desc: 'جو ویڈیو ڈاؤنلوڈ کرنی ہے اس پر جائیں اور ایڈریس بار یا شیئر بٹن سے URL/لنک کاپی کریں',
        step3Title: 'URL پیسٹ کریں',
        step3Desc: 'کاپی شدہ URL ان پٹ فیلڈ میں پیسٹ کریں اور "ویڈیو انفو حاصل کریں" پر ٹیپ کریں',
        step4Title: 'کوالٹی منتخب کریں',
        step4Desc: 'اپنی پسندیدہ ویڈیو کوالٹی منتخب کریں (1080p, 720p, 480p وغیرہ)',
        step5Title: 'ڈاؤنلوڈ کریں',
        step5Desc: '"ویڈیو ڈاؤنلوڈ کریں" بٹن پر ٹیپ کریں اور ڈاؤنلوڈ مکمل ہونے کا انتظار کریں',
        tipsTitle: '💡 تجاویز',
        tip1: 'یقینی بنائیں کہ آپ کا انٹرنیٹ کنکشن مستحکم ہے',
        tip2: 'زیادہ کوالٹی = زیادہ فائل سائز',
        tip3: 'ڈاؤنلوڈ شدہ ویڈیوز آپ کے ڈیوائس کے ڈاؤنلوڈ فولڈر میں محفوظ ہوتی ہیں',
        tip4: 'آپ اسٹاپ بٹن استعمال کرکے کسی بھی وقت ڈاؤنلوڈ روک سکتے ہیں',
        pasteUrl: 'ڈاؤنلوڈ کرنے کے لیے ویڈیو URL پیسٹ کریں',
        getVideoInfo: 'ویڈیو انفو حاصل کریں',
        fetchingInfo: 'ویڈیو کی معلومات حاصل کی جا رہی ہیں...',
        selectQuality: 'کوالٹی منتخب کریں',
        downloadVideo: 'ویڈیو ڈاؤنلوڈ کریں',
        downloadThumbnail: 'تھمب نیل ڈاؤنلوڈ کریں',
        stop: 'رکیں',
        madeWith: 'بنایا گیا',
        forVideoLovers: 'ویڈیو سے محبت کرنے والوں کے لیے۔',
        selectLanguage: 'زبان منتخب کریں',
        playlistVideos: 'پلے لسٹ ویڈیوز',
        selectAll: 'سب منتخب کریں',
        deselectAll: 'سب غیر منتخب کریں',
        selectRange: 'رینج منتخب کریں:',
        applyRange: 'لاگو کریں',
        downloadQuality: 'ڈاؤنلوڈ کوالٹی:',
        downloadSelected: 'منتخب ڈاؤنلوڈ کریں',
        downloadAll: 'سب ڈاؤنلوڈ کریں',
        stopAll: 'سب روکیں',
        errorEnterUrl: 'براہ کرم ویڈیو URL درج کریں',
        errorValidUrl: 'براہ کرم درست URL درج کریں',
        errorBlocked: 'مواد کی پالیسی کی پابندیوں کی وجہ سے یہ ویب سائٹ معاون نہیں ہے۔',
        errorFetchFailed: 'ویڈیو انفو حاصل کرنے میں ناکام۔ یقینی بنائیں کہ بیک اینڈ سرور چل رہا ہے۔'
    },
    hi: {
        tagline: 'यूनिवर्सल वीडियो डाउनलोडर',
        choosePlatform: 'प्लेटफॉर्म चुनें',
        selectWhere: 'चुनें कि आप कहाँ से डाउनलोड करना चाहते हैं',
        ytDesc: 'वीडियो, शॉर्ट्स, म्यूजिक',
        igDesc: 'रील्स, पोस्ट्स, स्टोरीज',
        fbDesc: 'वीडियो, रील्स, वॉच',
        ttDesc: 'वीडियो, साउंड्स',
        twDesc: 'वीडियो, GIFs',
        otherSites: 'अन्य साइट्स',
        otherDesc: '1000+ समर्थित',
        viewAllSites: 'सभी समर्थित साइट्स देखें',
        fastDownloads: 'तेज डाउनलोड',
        highSpeed: 'हाई-स्पीड सर्वर',
        multiQuality: 'कई क्वालिटी',
        safeSecure: 'सुरक्षित',
        noData: 'कोई डेटा संग्रहीत नहीं',
        mobileReady: 'मोबाइल रेडी',
        worksEverywhere: 'हर जगह काम करता है',
        back: 'वापस',
        supportedSites: 'समर्थित साइट्स',
        searchSites: 'साइट्स खोजें...',
        supportedWebsites: 'समर्थित वेबसाइट्स',
        howToUse: 'उपयोग कैसे करें',
        tutorialIntro: 'किसी भी प्लेटफॉर्म से वीडियो डाउनलोड करने के लिए इन आसान चरणों का पालन करें',
        step1Title: 'प्लेटफॉर्म चुनें',
        step1Desc: 'वह प्लेटफॉर्म चुनें जहाँ से आप डाउनलोड करना चाहते हैं (YouTube, Instagram, Facebook आदि)',
        step2Title: 'वीडियो URL कॉपी करें',
        step2Desc: 'जो वीडियो डाउनलोड करनी है उस पर जाएं और एड्रेस बार या शेयर बटन से URL/लिंक कॉपी करें',
        step3Title: 'URL पेस्ट करें',
        step3Desc: 'कॉपी किया गया URL इनपुट फील्ड में पेस्ट करें और "वीडियो इंफो प्राप्त करें" पर टैप करें',
        step4Title: 'क्वालिटी चुनें',
        step4Desc: 'अपनी पसंदीदा वीडियो क्वालिटी चुनें (1080p, 720p, 480p आदि)',
        step5Title: 'डाउनलोड करें',
        step5Desc: '"वीडियो डाउनलोड करें" बटन पर टैप करें और डाउनलोड पूरा होने का इंतजार करें',
        tipsTitle: '💡 सुझाव',
        tip1: 'सुनिश्चित करें कि आपका इंटरनेट कनेक्शन स्थिर है',
        tip2: 'उच्च क्वालिटी = बड़ी फाइल साइज',
        tip3: 'डाउनलोड किए गए वीडियो आपके डिवाइस के डाउनलोड फोल्डर में सेव होते हैं',
        tip4: 'आप स्टॉप बटन का उपयोग करके कभी भी डाउनलोड रोक सकते हैं',
        pasteUrl: 'डाउनलोड करने के लिए वीडियो URL पेस्ट करें',
        getVideoInfo: 'वीडियो इंफो प्राप्त करें',
        fetchingInfo: 'वीडियो जानकारी प्राप्त की जा रही है...',
        selectQuality: 'क्वालिटी चुनें',
        downloadVideo: 'वीडियो डाउनलोड करें',
        downloadThumbnail: 'थंबनेल डाउनलोड करें',
        stop: 'रोकें',
        madeWith: 'बनाया गया',
        forVideoLovers: 'वीडियो प्रेमियों के लिए।',
        selectLanguage: 'भाषा चुनें',
        playlistVideos: 'प्लेलिस्ट वीडियो',
        selectAll: 'सब चुनें',
        deselectAll: 'सब अचयनित करें',
        selectRange: 'रेंज चुनें:',
        applyRange: 'लागू करें',
        downloadQuality: 'डाउनलोड क्वालिटी:',
        downloadSelected: 'चुने हुए डाउनलोड करें',
        downloadAll: 'सब डाउनलोड करें',
        stopAll: 'सब रोकें',
        errorEnterUrl: 'कृपया वीडियो URL दर्ज करें',
        errorValidUrl: 'कृपया एक वैध URL दर्ज करें',
        errorBlocked: 'सामग्री नीति प्रतिबंधों के कारण यह वेबसाइट समर्थित नहीं है।',
        errorFetchFailed: 'वीडियो इंफो प्राप्त करने में विफल। सुनिश्चित करें कि बैकएंड सर्वर चल रहा है।'
    },
    hinglish: {
        tagline: 'Universal Video Downloader',
        choosePlatform: 'Platform Select Karo',
        selectWhere: 'Choose karo kahaan se download karna hai',
        ytDesc: 'Videos, Shorts, Music',
        igDesc: 'Reels, Posts, Stories',
        fbDesc: 'Videos, Reels, Watch',
        ttDesc: 'Videos, Sounds',
        twDesc: 'Videos, GIFs',
        otherSites: 'Other Sites',
        otherDesc: '1000+ supported',
        viewAllSites: 'Saari Supported Sites Dekho',
        fastDownloads: 'Fast Downloads',
        highSpeed: 'High-speed servers',
        multiQuality: 'Multiple Qualities',
        safeSecure: 'Safe & Secure',
        noData: 'Koi data store nahi',
        mobileReady: 'Mobile Ready',
        worksEverywhere: 'Har jagah kaam karta hai',
        back: 'Wapas',
        supportedSites: 'Supported Sites',
        searchSites: 'Sites search karo...',
        supportedWebsites: 'supported websites',
        howToUse: 'Kaise Use Karein',
        tutorialIntro: 'Kisi bhi platform se video download karne ke liye ye simple steps follow karo',
        step1Title: 'Platform Select Karo',
        step1Desc: 'Platform select karo jahan se download karna hai (YouTube, Instagram, Facebook wagairah)',
        step2Title: 'Video URL Copy Karo',
        step2Desc: 'Jo video download karni hai wahan jao aur address bar ya share button se URL/link copy karo',
        step3Title: 'URL Paste Karo',
        step3Desc: 'Copy kiya hua URL input field mein paste karo aur "Get Video Info" pe tap karo',
        step4Title: 'Quality Select Karo',
        step4Desc: 'Apni pasand ki video quality chuno (1080p, 720p, 480p wagairah)',
        step5Title: 'Download Karo',
        step5Desc: '"Download Video" button pe tap karo aur download complete hone ka wait karo',
        tipsTitle: '💡 Tips',
        tip1: 'Dhyan rakho ki tumhara internet connection stable ho',
        tip2: 'Zyada quality = Badi file size',
        tip3: 'Download hui videos tumhare device ke download folder mein save hoti hain',
        tip4: 'Tum Stop button use karke kabhi bhi download rok sakte ho',
        pasteUrl: 'Download karne ke liye video URL paste karo',
        getVideoInfo: 'Video Info Lo',
        fetchingInfo: 'Video info fetch ho rahi hai...',
        selectQuality: 'Quality Chuno',
        downloadVideo: 'Video Download Karo',
        downloadThumbnail: 'Thumbnail Download Karo',
        stop: 'Roko',
        madeWith: 'Banaya gaya',
        forVideoLovers: 'video lovers ke liye.',
        selectLanguage: 'Language Select Karo',
        playlistVideos: 'Playlist Videos',
        selectAll: 'Sab Select Karo',
        deselectAll: 'Sab Deselect Karo',
        selectRange: 'Range Select Karo:',
        applyRange: 'Apply Karo',
        downloadQuality: 'Download Quality:',
        downloadSelected: 'Selected Download Karo',
        downloadAll: 'Sab Download Karo',
        stopAll: 'Sab Roko',
        errorEnterUrl: 'Please video URL daalo',
        errorValidUrl: 'Please sahi URL daalo',
        errorBlocked: 'Content policy restrictions ki wajah se yeh website supported nahi hai.',
        errorFetchFailed: 'Video info fetch nahi ho paayi. Check karo ki backend server chal raha hai.'
    }
};

let currentLanguage = localStorage.getItem('aquaseal-language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('aquaseal-language', lang);
    
    // Update RTL for Urdu
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.textContent = TRANSLATIONS[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.placeholder = TRANSLATIONS[lang][key];
        }
    });
    
    // Update active language button
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function getText(key) {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['en'][key] || key;
}

// ===========================
// Platform Configurations
// ===========================
const PLATFORMS = {
    youtube: {
        name: 'YouTube',
        title: 'YouTube Downloader',
        description: 'Download YouTube videos, shorts, music & playlists',
        placeholder: 'https://www.youtube.com/watch?v=... or playlist URL',
        color: '#ff0000',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    instagram: {
        name: 'Instagram',
        title: 'Instagram Downloader',
        description: 'Download Instagram reels, posts, and stories',
        placeholder: 'https://www.instagram.com/reel/...',
        color: '#e1306c',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`
    },
    facebook: {
        name: 'Facebook',
        title: 'Facebook Downloader',
        description: 'Download Facebook videos, reels, and watch content',
        placeholder: 'https://www.facebook.com/watch?v=...',
        color: '#1877f2',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    },
    tiktok: {
        name: 'TikTok',
        title: 'TikTok Downloader',
        description: 'Download TikTok videos without watermark',
        placeholder: 'https://www.tiktok.com/@user/video/...',
        color: '#ff0050',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`
    },
    twitter: {
        name: 'Twitter / X',
        title: 'Twitter/X Downloader',
        description: 'Download Twitter/X videos and GIFs',
        placeholder: 'https://twitter.com/user/status/...',
        color: '#1da1f2',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    other: {
        name: 'Other Sites',
        title: 'Universal Downloader',
        description: 'Download from 1000+ supported websites',
        placeholder: 'Paste any video URL...',
        color: '#6366f1',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
    }
};

// Supported sites list - FAMILY FRIENDLY ONLY
const SUPPORTED_SITES = [
    { name: 'YouTube', url: 'youtube.com' },
    { name: 'YouTube Music', url: 'music.youtube.com' },
    { name: 'YouTube Kids', url: 'youtubekids.com' },
    { name: 'Instagram', url: 'instagram.com' },
    { name: 'Facebook', url: 'facebook.com' },
    { name: 'Facebook Watch', url: 'fb.watch' },
    { name: 'TikTok', url: 'tiktok.com' },
    { name: 'Twitter / X', url: 'twitter.com, x.com' },
    { name: 'Vimeo', url: 'vimeo.com' },
    { name: 'Dailymotion', url: 'dailymotion.com' },
    { name: 'Twitch', url: 'twitch.tv' },
    { name: 'Reddit', url: 'reddit.com' },
    { name: 'SoundCloud', url: 'soundcloud.com' },
    { name: 'Bandcamp', url: 'bandcamp.com' },
    { name: 'Spotify (Podcasts)', url: 'spotify.com' },
    { name: 'Pinterest', url: 'pinterest.com' },
    { name: 'LinkedIn', url: 'linkedin.com' },
    { name: 'Bilibili', url: 'bilibili.com' },
    { name: 'Niconico', url: 'nicovideo.jp' },
    { name: 'VK', url: 'vk.com' },
    { name: 'OK.ru', url: 'ok.ru' },
    { name: 'Rumble', url: 'rumble.com' },
    { name: 'PeerTube', url: 'peertube instances' },
    { name: 'Odysee', url: 'odysee.com' },
    { name: 'Streamable', url: 'streamable.com' },
    { name: 'Imgur', url: 'imgur.com' },
    { name: 'Flickr', url: 'flickr.com' },
    { name: 'Mixcloud', url: 'mixcloud.com' },
    { name: 'Audiomack', url: 'audiomack.com' },
    { name: 'ESPN', url: 'espn.com' },
    { name: 'NBC', url: 'nbc.com' },
    { name: 'CBS', url: 'cbs.com' },
    { name: 'ABC', url: 'abc.com' },
    { name: 'Fox', url: 'fox.com' },
    { name: 'CNN', url: 'cnn.com' },
    { name: 'BBC', url: 'bbc.co.uk' },
    { name: 'Sky News', url: 'news.sky.com' },
    { name: 'Arte', url: 'arte.tv' },
    { name: 'ZDF', url: 'zdf.de' },
    { name: 'ARD', url: 'ard.de' },
    { name: 'France TV', url: 'france.tv' },
    { name: 'NHK', url: 'nhk.or.jp' },
    { name: 'Crunchyroll', url: 'crunchyroll.com' },
    { name: 'Nebula', url: 'nebula.tv' },
    { name: 'Floatplane', url: 'floatplane.com' },
    { name: 'Udemy', url: 'udemy.com' },
    { name: 'Coursera', url: 'coursera.org' },
    { name: 'Khan Academy', url: 'khanacademy.org' },
    { name: 'TED', url: 'ted.com' },
    { name: 'Skillshare', url: 'skillshare.com' },
    { name: 'Coub', url: 'coub.com' },
    { name: '9GAG', url: '9gag.com' },
    { name: 'Kick', url: 'kick.com' },
    { name: 'Trovo', url: 'trovo.live' },
    { name: 'DLive', url: 'dlive.tv' },
    { name: 'Nimo TV', url: 'nimo.tv' },
    { name: 'AfreecaTV', url: 'afreecatv.com' },
    { name: 'Weverse', url: 'weverse.io' },
    { name: 'SHOWROOM', url: 'showroom-live.com' },
    { name: 'Veoh', url: 'veoh.com' },
    { name: 'Metacafe', url: 'metacafe.com' },
    { name: 'Discovery+', url: 'discoveryplus.com' },
    { name: 'Paramount+', url: 'paramountplus.com' },
    { name: 'Peacock', url: 'peacocktv.com' },
    { name: 'Plex', url: 'plex.tv' },
    { name: 'Tubi', url: 'tubitv.com' },
    { name: 'Pluto TV', url: 'pluto.tv' },
    { name: 'Roku Channel', url: 'therokuchannel.com' },
    { name: 'Hotstar', url: 'hotstar.com' },
    { name: 'JioCinema', url: 'jiocinema.com' },
    { name: 'MX Player', url: 'mxplayer.in' },
    { name: 'Zee5', url: 'zee5.com' },
    { name: 'SonyLIV', url: 'sonyliv.com' },
    { name: 'Voot', url: 'voot.com' },
    { name: 'ALTBalaji', url: 'altbalaji.com' },
    { name: 'And many more...', url: 'Family-friendly sites only' }
];

// ===========================
// State
// ===========================
let currentPlatform = null;
let currentVideoInfo = null;
let selectedVideoFormat = null;
let downloadController = null;

// ===========================
// DOM Elements
// ===========================
const platformPage = document.getElementById('platform-page');
const sitesPage = document.getElementById('sites-page');
const tutorialPage = document.getElementById('tutorial-page');
const downloadPage = document.getElementById('download-page');

const platformCards = document.querySelectorAll('.platform-card');
const viewAllSitesBtn = document.getElementById('view-all-sites-btn');
const sitesBackBtn = document.getElementById('sites-back-btn');
const tutorialBackBtn = document.getElementById('tutorial-back-btn');
const downloadBackBtn = document.getElementById('download-back-btn');
const logoHome = document.getElementById('logo-home');
const tutorialBtn = document.getElementById('tutorial-btn');
const languageBtn = document.getElementById('language-btn');
const languageModal = document.getElementById('language-modal');
const languageModalClose = document.getElementById('language-modal-close');
const languageOptions = document.querySelectorAll('.language-option');

const sitesSearchInput = document.getElementById('sites-search-input');
const sitesList = document.getElementById('sites-list');
const sitesCountNumber = document.getElementById('sites-count-number');

const downloadPageTitle = document.getElementById('download-page-title');
const platformIndicator = document.getElementById('platform-indicator');
const platformIndicatorIcon = document.getElementById('platform-indicator-icon');
const platformIndicatorName = document.getElementById('platform-indicator-name');
const downloadDescription = document.getElementById('download-description');

const urlInput = document.getElementById('url-input');
const clearBtn = document.getElementById('clear-btn');
const fetchBtn = document.getElementById('fetch-btn');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const loadingState = document.getElementById('loading-state');
const videoSection = document.getElementById('video-section');
const videoThumbnail = document.getElementById('video-thumbnail');
const thumbnailPlaceholder = document.getElementById('thumbnail-placeholder');
const videoTitle = document.getElementById('video-title');
const videoChannel = document.getElementById('video-channel');
const videoDuration = document.getElementById('video-duration');
const videoQualityOptions = document.getElementById('video-quality-options');
const downloadVideoBtn = document.getElementById('download-video-btn');
const downloadThumbnailBtn = document.getElementById('download-thumbnail-btn');
const playVideoBtn = document.getElementById('play-video-btn');
const stopDownloadBtn = document.getElementById('stop-download-btn');
const downloadProgress = document.getElementById('download-progress');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressPercentage = document.getElementById('progress-percentage');
const progressSize = document.getElementById('progress-size');
const progressSpeed = document.getElementById('progress-speed');

// Playlist elements
const playlistSection = document.getElementById('playlist-section');
const playlistTitle = document.getElementById('playlist-title');
const playlistMeta = document.getElementById('playlist-meta');
const playlistVideos = document.getElementById('playlist-videos');

// Playlist control elements
const selectAllBtn = document.getElementById('select-all-btn');
const deselectAllBtn = document.getElementById('deselect-all-btn');
const selectedCountText = document.getElementById('selected-count-text');
const rangeStart = document.getElementById('range-start');
const rangeEnd = document.getElementById('range-end');
const applyRangeBtn = document.getElementById('apply-range-btn');
const batchQualitySelect = document.getElementById('batch-quality-select');
const downloadSelectedBtn = document.getElementById('download-selected-btn');
const downloadAllBtn = document.getElementById('download-all-btn');
const batchProgress = document.getElementById('batch-progress');
const batchProgressText = document.getElementById('batch-progress-text');
const batchProgressFill = document.getElementById('batch-progress-fill');
const batchCurrentVideo = document.getElementById('batch-current-video');
const stopBatchBtn = document.getElementById('stop-batch-btn');

// Playlist state
let currentPlaylistInfo = null;
let selectedVideos = new Set();
let batchDownloadActive = false;
let batchDownloadAborted = false;

// ===========================
// Page Navigation
// ===========================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function goToPlatformPage() {
    showPage('platform-page');
    resetDownloadPage();
}

function goToSitesPage() {
    showPage('sites-page');
    populateSitesList();
}

function goToTutorialPage() {
    showPage('tutorial-page');
}

function goToDownloadPage(platform) {
    currentPlatform = platform;
    const config = PLATFORMS[platform];
    
    // Update page UI
    downloadPageTitle.textContent = config.title;
    platformIndicatorIcon.innerHTML = config.icon;
    platformIndicatorIcon.style.color = config.color;
    platformIndicatorName.textContent = config.name;
    platformIndicator.className = `platform-indicator ${platform}`;
    downloadDescription.textContent = config.description;
    urlInput.placeholder = config.placeholder;
    
    // Reset state
    resetDownloadPage();
    
    showPage('download-page');
    urlInput.focus();
}

function resetDownloadPage() {
    urlInput.value = '';
    hideError();
    hideLoading();
    hideVideoSection();
    hidePlaylistSection();
    downloadProgress.classList.add('hidden');
    stopDownloadBtn.classList.add('hidden');
    if (downloadThumbnailBtn) downloadThumbnailBtn.classList.add('hidden');
    downloadVideoBtn.disabled = false;
    downloadVideoBtn.querySelector('span').textContent = 'Download Video';
    currentVideoInfo = null;
    currentPlaylistInfo = null;
}

// ===========================
// Event Listeners
// ===========================

// Platform cards
platformCards.forEach(card => {
    card.addEventListener('click', () => {
        const platform = card.dataset.platform;
        goToDownloadPage(platform);
    });
});

// View all sites button
viewAllSitesBtn.addEventListener('click', goToSitesPage);

// Back buttons
sitesBackBtn.addEventListener('click', goToPlatformPage);
tutorialBackBtn.addEventListener('click', goToPlatformPage);
downloadBackBtn.addEventListener('click', goToPlatformPage);

// Logo click to go home
logoHome.addEventListener('click', goToPlatformPage);

// Tutorial button
tutorialBtn.addEventListener('click', goToTutorialPage);

// Language button and modal
languageBtn.addEventListener('click', () => {
    languageModal.classList.add('active');
});

languageModalClose.addEventListener('click', () => {
    languageModal.classList.remove('active');
});

languageModal.addEventListener('click', (e) => {
    if (e.target === languageModal) {
        languageModal.classList.remove('active');
    }
});

languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        setLanguage(lang);
        languageModal.classList.remove('active');
    });
});

// Sites search
sitesSearchInput.addEventListener('input', filterSites);

// Clear button
clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    urlInput.focus();
    hideError();
    hideVideoSection();
});

// Fetch button
fetchBtn.addEventListener('click', handleFetchVideoInfo);

// Enter key on input
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleFetchVideoInfo();
    }
});

// Download button
downloadVideoBtn.addEventListener('click', handleDownload);

// Thumbnail download button
downloadThumbnailBtn.addEventListener('click', handleDownloadThumbnail);

// Play video button (single video preview)
if (playVideoBtn) {
    playVideoBtn.addEventListener('click', () => {
        console.log('Play button clicked', currentVideoInfo);
        if (currentVideoInfo && currentVideoInfo.url) {
            openVideoPlayer(currentVideoInfo.url, currentVideoInfo.title || 'Video');
        } else if (urlInput && urlInput.value) {
            openVideoPlayer(urlInput.value, currentVideoInfo?.title || 'Video');
        } else {
            console.log('No URL available');
        }
    });
}

// Stop button
stopDownloadBtn.addEventListener('click', handleStopDownload);

// ===========================
// Sites Page Functions
// ===========================
function populateSitesList(filter = '') {
    sitesList.innerHTML = '';
    
    const filteredSites = SUPPORTED_SITES.filter(site => 
        site.name.toLowerCase().includes(filter.toLowerCase()) ||
        site.url.toLowerCase().includes(filter.toLowerCase())
    );
    
    sitesCountNumber.textContent = filter ? filteredSites.length : '1000+';
    
    filteredSites.forEach(site => {
        const siteItem = document.createElement('div');
        siteItem.className = 'site-item';
        siteItem.innerHTML = `
            <span class="site-name">${site.name}</span>
            <span class="site-url">${site.url}</span>
        `;
        sitesList.appendChild(siteItem);
    });
}

function filterSites() {
    const filter = sitesSearchInput.value;
    populateSitesList(filter);
}

// ===========================
// Video Download Functions
// ===========================
function isPlaylistUrl(url) {
    return url.includes('list=') || url.includes('/playlist');
}

async function handleFetchVideoInfo() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a video URL');
        return;
    }
    
    if (!isValidUrl(url)) {
        showError('Please enter a valid URL');
        return;
    }
    
    // Check for blocked content
    if (isBlockedUrl(url)) {
        showError('This website is not supported due to content policy restrictions.');
        return;
    }
    
    // Show loading
    hideError();
    hideVideoSection();
    hidePlaylistSection();
    
    // Check if it's a playlist URL (YouTube only)
    if (currentPlatform === 'youtube' && isPlaylistUrl(url)) {
        await handleFetchPlaylistInfo(url);
        return;
    }
    
    showLoading(`Fetching ${PLATFORMS[currentPlatform].name} video info...`);
    
    try {
        const videoInfo = await callPythonAPI('getVideoInfo', { url });
        
        if (videoInfo.error) {
            throw new Error(videoInfo.error);
        }
        
        currentVideoInfo = videoInfo;
        currentVideoInfo.url = url; // Store the URL for video player
        
        // Update UI - handle thumbnail with fallback
        if (videoInfo.thumbnail) {
            videoThumbnail.src = videoInfo.thumbnail;
            videoThumbnail.style.display = 'block';
            if (thumbnailPlaceholder) thumbnailPlaceholder.style.display = 'none';
            // Show thumbnail download button for YouTube
            if (currentPlatform === 'youtube' && downloadThumbnailBtn) {
                downloadThumbnailBtn.classList.remove('hidden');
            }
        } else {
            videoThumbnail.style.display = 'none';
            if (thumbnailPlaceholder) thumbnailPlaceholder.style.display = 'flex';
            if (downloadThumbnailBtn) downloadThumbnailBtn.classList.add('hidden');
        }
        videoTitle.textContent = videoInfo.title || 'Unknown Title';
        videoChannel.textContent = `${PLATFORMS[currentPlatform].name} • ${videoInfo.channel || 'Unknown'}`;
        videoDuration.textContent = formatDuration(videoInfo.duration);
        
        // Populate quality options
        populateQualityOptions(videoInfo.formats || []);
        
        hideLoading();
        showVideoSection();
        
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
        const errorMsg = isCapacitor 
            ? 'Failed to fetch video info: ' + (error.message || 'Unknown error')
            : 'Failed to fetch video info. Make sure the backend server is running.';
        showError(errorMsg);
    }
}

function populateQualityOptions(formats) {
    videoQualityOptions.innerHTML = '';
    
    if (formats.length === 0) {
        // Add default option
        const defaultOption = createQualityOption('best', 'Best Quality', 'Auto', true);
        videoQualityOptions.appendChild(defaultOption);
        selectedVideoFormat = 'best';
        return;
    }
    
    formats.forEach((format, index) => {
        const option = createQualityOption(
            format.formatId,
            format.quality,
            `${format.ext}${format.filesize ? ' • ' + formatFilesize(format.filesize) : ''}`,
            index === 0
        );
        videoQualityOptions.appendChild(option);
        
        if (index === 0) {
            selectedVideoFormat = format.formatId;
        }
    });
}

function createQualityOption(value, name, resolution, checked) {
    const label = document.createElement('label');
    label.className = 'quality-option';
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'video-quality';
    input.value = value;
    input.checked = checked;
    
    input.addEventListener('change', () => {
        selectedVideoFormat = value;
    });
    
    const span = document.createElement('span');
    span.className = 'quality-label';
    span.innerHTML = `
        <span class="quality-name">${name}</span>
        <span class="quality-resolution">${resolution}</span>
    `;
    
    label.appendChild(input);
    label.appendChild(span);
    
    return label;
}

async function handleDownload() {
    if (!currentVideoInfo) return;
    
    const url = urlInput.value.trim();
    
    // For Capacitor (Android app), use Python directly
    if (isCapacitor && PythonBridge) {
        downloadVideoBtn.disabled = true;
        downloadVideoBtn.querySelector('span').textContent = 'Downloading...';
        downloadProgress.classList.remove('hidden');
        progressBarFill.style.width = '10%';
        progressPercentage.textContent = 'Processing...';
        progressSpeed.textContent = 'Please wait...';
        
        try {
            const result = await callPythonAPI('downloadVideo', {
                url: url,
                formatId: selectedVideoFormat || 'best'
            });
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            progressBarFill.style.width = '100%';
            progressPercentage.textContent = '100%';
            progressSpeed.textContent = 'Complete!';
            downloadVideoBtn.querySelector('span').textContent = 'Downloaded! ✓';
            
            // Show success message with file location
            if (result.filename) {
                progressSize.textContent = 'Saved to Downloads folder';
            }
            
            setTimeout(() => {
                downloadVideoBtn.querySelector('span').textContent = 'Download Video';
                downloadVideoBtn.disabled = false;
                downloadProgress.classList.add('hidden');
            }, 3000);
            
        } catch (error) {
            console.error('Download error:', error);
            showError('Download failed: ' + (error.message || 'Unknown error'));
            downloadVideoBtn.querySelector('span').textContent = 'Download Video';
            downloadVideoBtn.disabled = false;
            setTimeout(() => {
                downloadProgress.classList.add('hidden');
            }, 2000);
        }
        
        return;
    }
    
    // Web/Development mode - use HTTP streaming
    downloadController = new AbortController();
    
    // Update UI
    downloadVideoBtn.disabled = true;
    downloadVideoBtn.querySelector('span').textContent = 'Starting...';
    stopDownloadBtn.classList.remove('hidden');
    
    // Show progress
    downloadProgress.classList.remove('hidden');
    progressBarFill.style.width = '0%';
    progressPercentage.textContent = '0%';
    progressSize.textContent = '0 MB / 0 MB';
    progressSpeed.textContent = '0 KB/s';
    
    const startTime = Date.now();
    
    // Get expected size
    let expectedSize = 0;
    if (currentVideoInfo.formats) {
        const format = currentVideoInfo.formats.find(f => f.formatId === selectedVideoFormat);
        if (format?.filesize) expectedSize = format.filesize;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
                formatId: selectedVideoFormat,
                expectedSize
            }),
            signal: downloadController.signal
        });
        
        if (!response.ok) throw new Error('Download failed');
        
        // Get total size
        const contentLength = response.headers.get('Content-Length');
        const xExpectedSize = response.headers.get('X-Expected-Size');
        let total = parseInt(contentLength || xExpectedSize || expectedSize) || 0;
        
        downloadVideoBtn.querySelector('span').textContent = 'Downloading...';
        
        // Stream response
        const reader = response.body.getReader();
        const chunks = [];
        let loaded = 0;
        let lastLoaded = 0;
        let lastTime = startTime;
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            const now = Date.now();
            const timeDiff = (now - lastTime) / 1000;
            
            if (total > 0) {
                const percent = Math.min(100, Math.round((loaded / total) * 100));
                progressBarFill.style.width = `${percent}%`;
                progressPercentage.textContent = `${percent}%`;
                progressSize.textContent = `${formatFilesize(loaded)} / ${formatFilesize(total)}`;
            } else {
                progressSize.textContent = `${formatFilesize(loaded)} downloaded`;
            }
            
            if (timeDiff >= 0.5) {
                const speed = (loaded - lastLoaded) / timeDiff;
                progressSpeed.textContent = `${formatFilesize(speed)}/s`;
                lastLoaded = loaded;
                lastTime = now;
            }
        }
        
        // Complete
        progressBarFill.style.width = '100%';
        progressPercentage.textContent = '100%';
        progressSpeed.textContent = 'Complete!';
        
        // Create blob and download
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${(currentVideoInfo.title || 'video').replace(/[^\w\s-]/g, '')}.mp4`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
        
        downloadVideoBtn.querySelector('span').textContent = 'Downloaded! ✓';
        
        setTimeout(() => {
            downloadVideoBtn.querySelector('span').textContent = 'Download Video';
            downloadVideoBtn.disabled = false;
            stopDownloadBtn.classList.add('hidden');
            downloadProgress.classList.add('hidden');
        }, 3000);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            progressSpeed.textContent = 'Stopped';
            progressPercentage.textContent = 'Stopped';
        } else {
            console.error('Download error:', error);
            showError('Download failed. Please try again.');
        }
        
        downloadVideoBtn.querySelector('span').textContent = 'Download Video';
        downloadVideoBtn.disabled = false;
        stopDownloadBtn.classList.add('hidden');
        
        setTimeout(() => {
            downloadProgress.classList.add('hidden');
        }, 2000);
    } finally {
        downloadController = null;
    }
}

function handleStopDownload() {
    if (downloadController) {
        downloadController.abort();
        downloadController = null;
    }
}

// Thumbnail download function
async function handleDownloadThumbnail() {
    if (!currentVideoInfo || !currentVideoInfo.thumbnail) {
        showError('No thumbnail available');
        return;
    }
    
    try {
        // For Capacitor (Android app), use Python directly
        if (isCapacitor && PythonBridge) {
            const result = await callPythonAPI('downloadThumbnail', {
                url: currentVideoInfo.thumbnail,
                videoId: currentVideoInfo.id
            });
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            // Show success
            alert('Thumbnail saved to Pictures folder!');
            return;
        }
        
        // Web/Development mode - use HTTP API
        // For YouTube, get the highest quality thumbnail
        let thumbnailUrl = currentVideoInfo.thumbnail;
        
        // Try to get maxresdefault for YouTube
        if (currentVideoInfo.id && currentPlatform === 'youtube') {
            thumbnailUrl = `https://i.ytimg.com/vi/${currentVideoInfo.id}/maxresdefault.jpg`;
        }
        
        // Fetch the image through a proxy to avoid CORS
        const response = await fetch(`${API_BASE_URL}/download-thumbnail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url: thumbnailUrl,
                videoId: currentVideoInfo.id,
                title: currentVideoInfo.title
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to download thumbnail');
        }
        
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${currentVideoInfo.title || 'thumbnail'}_thumbnail.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        
    } catch (error) {
        console.error('Thumbnail download error:', error);
        // Fallback: open thumbnail in new tab
        window.open(currentVideoInfo.thumbnail, '_blank');
    }
}

// ===========================
// Playlist Functions (YouTube) - Advanced
// ===========================
async function handleFetchPlaylistInfo(url) {
    showLoading('Fetching playlist information...');
    
    try {
        const playlistInfo = await callPythonAPI('getPlaylistInfo', { url });
        
        if (playlistInfo.error) {
            throw new Error(playlistInfo.error);
        }
        
        currentPlaylistInfo = playlistInfo;
        
        // Reset selection state
        selectedVideos.clear();
        updateSelectedCount();
        
        // Update playlist UI
        playlistTitle.textContent = playlistInfo.title || 'YouTube Playlist';
        playlistMeta.textContent = `${playlistInfo.channel || 'Unknown'} • ${playlistInfo.videos?.length || 0} videos`;
        
        // Set range inputs max value
        if (rangeEnd) rangeEnd.max = playlistInfo.videos?.length || 1;
        if (rangeStart) rangeStart.max = playlistInfo.videos?.length || 1;
        
        // Populate playlist videos with checkboxes
        populatePlaylistVideos(playlistInfo.videos || []);
        
        hideLoading();
        showPlaylistSection();
        
    } catch (error) {
        console.error('Playlist error:', error);
        hideLoading();
        showError(error.message || 'Failed to fetch playlist info');
    }
}

function populatePlaylistVideos(videos) {
    playlistVideos.innerHTML = '';
    
    if (videos.length === 0) {
        playlistVideos.innerHTML = '<p class="no-videos">No videos found in this playlist</p>';
        return;
    }
    
    videos.forEach((video, index) => {
        const videoId = video.id || `video_${index}`;
        const videoUrl = video.url || (video.id ? `https://www.youtube.com/watch?v=${video.id}` : '');
        
        const videoItem = document.createElement('div');
        videoItem.className = 'playlist-video-item';
        videoItem.dataset.index = index;
        videoItem.dataset.videoId = videoId;
        videoItem.dataset.url = videoUrl;
        videoItem.dataset.title = video.title || 'Unknown';
        
        videoItem.innerHTML = `
            <label class="playlist-video-checkbox">
                <input type="checkbox" class="video-checkbox" data-index="${index}">
                <span class="checkmark"></span>
            </label>
            <button class="playlist-video-play" title="Play video" data-url="${videoUrl}" data-title="${video.title || 'Unknown'}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
            </button>
            <div class="playlist-video-number">${index + 1}</div>
            <div class="playlist-video-thumb">
                <img src="${video.thumbnail || ''}" alt="" onerror="this.parentElement.innerHTML='<div class=\\'thumb-placeholder\\'>🎬</div>'">
                <span class="video-duration">${formatDuration(video.duration).replace('Duration: ', '')}</span>
            </div>
            <div class="playlist-video-info">
                <h4 class="playlist-video-title">${video.title || 'Unknown'}</h4>
                <p class="playlist-video-channel">${video.channel || 'Unknown'}</p>
            </div>
            <div class="playlist-video-actions">
                <button class="playlist-video-download" title="Download this video">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Checkbox change handler
        const checkbox = videoItem.querySelector('.video-checkbox');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedVideos.add(index);
                videoItem.classList.add('selected');
            } else {
                selectedVideos.delete(index);
                videoItem.classList.remove('selected');
            }
            updateSelectedCount();
        });
        
        // Click on item to toggle selection
        videoItem.addEventListener('click', (e) => {
            if (e.target.closest('.playlist-video-download') || e.target.closest('.playlist-video-checkbox') || e.target.closest('.playlist-video-play')) return;
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
        
        // Play button handler
        const playBtn = videoItem.querySelector('.playlist-video-play');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openVideoPlayer(videoUrl, video.title || 'Video');
        });
        
        // Download button handler
        const downloadBtn = videoItem.querySelector('.playlist-video-download');
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const quality = batchQualitySelect?.value || 'best';
            downloadPlaylistVideo(videoUrl, video.title, quality, videoItem);
        });
        
        playlistVideos.appendChild(videoItem);
    });
}

function updateSelectedCount() {
    const count = selectedVideos.size;
    if (selectedCountText) {
        selectedCountText.textContent = `${count} selected`;
    }
    if (downloadSelectedBtn) {
        downloadSelectedBtn.disabled = count === 0;
    }
}

function selectAllVideos() {
    const checkboxes = playlistVideos.querySelectorAll('.video-checkbox');
    checkboxes.forEach((cb, index) => {
        cb.checked = true;
        selectedVideos.add(index);
        cb.closest('.playlist-video-item')?.classList.add('selected');
    });
    updateSelectedCount();
}

function deselectAllVideos() {
    const checkboxes = playlistVideos.querySelectorAll('.video-checkbox');
    checkboxes.forEach((cb) => {
        cb.checked = false;
        cb.closest('.playlist-video-item')?.classList.remove('selected');
    });
    selectedVideos.clear();
    updateSelectedCount();
}

function selectRange() {
    const start = parseInt(rangeStart?.value) || 1;
    const end = parseInt(rangeEnd?.value) || currentPlaylistInfo?.videos?.length || 1;
    
    if (start > end) {
        showError('Start must be less than or equal to End');
        return;
    }
    
    deselectAllVideos();
    
    const checkboxes = playlistVideos.querySelectorAll('.video-checkbox');
    for (let i = start - 1; i < end && i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
        selectedVideos.add(i);
        checkboxes[i].closest('.playlist-video-item')?.classList.add('selected');
    }
    updateSelectedCount();
}

async function downloadPlaylistVideo(videoUrl, videoTitle, quality = 'best', itemElement = null) {
    if (!videoUrl) {
        showError('Video URL not available');
        return;
    }
    
    // Show downloading state on item
    if (itemElement) {
        itemElement.classList.add('downloading');
    }
    
    try {
        const formatId = getFormatIdFromQuality(quality);
        
        // For Capacitor (Android app), use Python directly
        if (isCapacitor && PythonBridge) {
            const result = await callPythonAPI('downloadVideo', {
                url: videoUrl,
                formatId: formatId
            });
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            if (itemElement) {
                itemElement.classList.remove('downloading');
                itemElement.classList.add('downloaded');
            }
            
            return true;
        }
        
        // Web/Development mode - use HTTP API
        const response = await fetch(`${API_BASE_URL}/download-playlist-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url: videoUrl,
                formatId: formatId,
                quality: quality
            })
        });
        
        if (!response.ok) {
            throw new Error('Download failed');
        }
        
        // Get filename from content-disposition
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = videoTitle ? `${videoTitle}.${quality === 'audio' ? 'mp3' : 'mp4'}` : 'video.mp4';
        if (contentDisposition) {
            const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (matches && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename.replace(/[<>:"/\\|?*]/g, '_');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        
        if (itemElement) {
            itemElement.classList.remove('downloading');
            itemElement.classList.add('downloaded');
        }
        
        return true;
        
    } catch (error) {
        console.error('Playlist video download error:', error);
        if (itemElement) {
            itemElement.classList.remove('downloading');
            itemElement.classList.add('download-failed');
        }
        return false;
    }
}

function getFormatIdFromQuality(quality) {
    switch (quality) {
        case 'best': return 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
        case '1080': return 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080]';
        case '720': return 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720]';
        case '480': return 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480]';
        case '360': return 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360]';
        case 'audio': return 'bestaudio[ext=m4a]/bestaudio';
        default: return 'best';
    }
}

async function downloadSelectedVideos() {
    if (selectedVideos.size === 0) {
        showError('No videos selected');
        return;
    }
    
    batchDownloadActive = true;
    batchDownloadAborted = false;
    
    const quality = batchQualitySelect?.value || 'best';
    const videos = currentPlaylistInfo?.videos || [];
    const selectedIndices = Array.from(selectedVideos).sort((a, b) => a - b);
    
    // Show batch progress
    batchProgress?.classList.remove('hidden');
    downloadSelectedBtn.disabled = true;
    downloadAllBtn.disabled = true;
    
    let completed = 0;
    const total = selectedIndices.length;
    
    for (const index of selectedIndices) {
        if (batchDownloadAborted) break;
        
        const video = videos[index];
        if (!video) continue;
        
        const videoUrl = video.url || (video.id ? `https://www.youtube.com/watch?v=${video.id}` : '');
        const itemElement = playlistVideos.querySelector(`[data-index="${index}"]`);
        
        // Update progress UI
        batchProgressText.textContent = `Downloading ${completed + 1} of ${total}`;
        batchCurrentVideo.textContent = video.title?.substring(0, 50) + (video.title?.length > 50 ? '...' : '');
        batchProgressFill.style.width = `${(completed / total) * 100}%`;
        
        await downloadPlaylistVideo(videoUrl, video.title, quality, itemElement);
        completed++;
        
        // Small delay between downloads
        if (!batchDownloadAborted && completed < total) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
    
    // Complete
    batchProgressFill.style.width = '100%';
    batchProgressText.textContent = batchDownloadAborted ? 'Download stopped' : `Completed ${completed} of ${total}`;
    batchCurrentVideo.textContent = batchDownloadAborted ? 'Download was cancelled' : 'All downloads complete!';
    
    setTimeout(() => {
        batchProgress?.classList.add('hidden');
        downloadSelectedBtn.disabled = selectedVideos.size === 0;
        downloadAllBtn.disabled = false;
        batchDownloadActive = false;
    }, 3000);
}

async function downloadAllVideos() {
    // Select all first, then download
    selectAllVideos();
    await downloadSelectedVideos();
}

function stopBatchDownload() {
    batchDownloadAborted = true;
    batchProgressText.textContent = 'Stopping...';
}

function showPlaylistSection() {
    if (playlistSection) playlistSection.classList.remove('hidden');
}

function hidePlaylistSection() {
    if (playlistSection) playlistSection.classList.add('hidden');
    currentPlaylistInfo = null;
    selectedVideos.clear();
    batchDownloadActive = false;
    batchDownloadAborted = false;
}

// Playlist control event listeners
if (selectAllBtn) selectAllBtn.addEventListener('click', selectAllVideos);
if (deselectAllBtn) deselectAllBtn.addEventListener('click', deselectAllVideos);
if (applyRangeBtn) applyRangeBtn.addEventListener('click', selectRange);
if (downloadSelectedBtn) downloadSelectedBtn.addEventListener('click', downloadSelectedVideos);
if (downloadAllBtn) downloadAllBtn.addEventListener('click', downloadAllVideos);
if (stopBatchBtn) stopBatchBtn.addEventListener('click', stopBatchDownload);

// ===========================
// Content Filtering (Client-Side)
// ===========================
const BLOCKED_DOMAINS = [
    'pornhub', 'xvideos', 'xnxx', 'xhamster', 'redtube', 'youporn', 'tube8',
    'spankbang', 'eporner', 'ixxx', 'tnaflix', 'porntrex', 'beeg', 'porn',
    'xxx', 'adult', 'nsfw', 'onlyfans', 'fansly', 'chaturbate', 'stripchat',
    'cam4', 'bongacams', 'livejasmin', 'camsoda', 'myfreecams', 'flirt4free',
    'jerkmate', 'pornmd', 'thumbzilla', 'hqporner', 'daftsex', 'sxyprn',
    'heavy-r', 'efukt', 'motherless', 'bestgore', 'kaotic', 'crazyshit',
    'theync', 'livegore', 'shockchan', 'rotten', 'ogrish', 'hentai', 'nhentai',
    'hanime', 'rule34', 'e621', 'furaffinity', 'gelbooru', 'danbooru',
    'sankaku', 'literotica', 'luscious', 'fakku', 'nudevista', 'fuq',
    'youjizz', 'drtuber', 'txxx', 'hdzog', 'hclips', 'upornia', 'vjav',
    'javhd', 'jav', 'r18', 'missav', 'supjav', 'liveleak', 'goregrish'
];

function isBlockedUrl(url) {
    const lowerUrl = url.toLowerCase();
    for (const domain of BLOCKED_DOMAINS) {
        if (lowerUrl.includes(domain)) {
            return true;
        }
    }
    return false;
}

// ===========================
// Helper Functions
// ===========================
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function formatDuration(seconds) {
    if (!seconds) return 'Duration: Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `Duration: ${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `Duration: ${minutes}:${String(secs).padStart(2, '0')}`;
}

function formatFilesize(bytes) {
    if (!bytes || bytes === 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i];
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showLoading(message = 'Loading...') {
    document.querySelector('.loading-text').textContent = message;
    loadingState.classList.remove('hidden');
}

function hideLoading() {
    loadingState.classList.add('hidden');
}

function showVideoSection() {
    videoSection.classList.remove('hidden');
}

function hideVideoSection() {
    videoSection.classList.add('hidden');
}

// ===========================
// Video Player Functions
// ===========================

const videoPlayerModal = document.getElementById('video-player-modal');
const videoPlayerIframe = document.getElementById('video-player-iframe');
const videoPlayerTitle = document.getElementById('video-player-title');
const videoPlayerModalClose = document.getElementById('video-player-modal-close');
const videoPlayerBackdrop = videoPlayerModal?.querySelector('.modal-backdrop');

function openVideoPlayer(videoUrl, title) {
    console.log('openVideoPlayer called:', videoUrl, title);
    
    // Since YouTube embeds don't work from local files or have restrictions,
    // open the video directly on YouTube in a new tab
    if (videoUrl) {
        window.open(videoUrl, '_blank');
    } else {
        showError('No video URL available');
    }
}

function closeVideoPlayer() {
    if (!videoPlayerModal || !videoPlayerIframe) return;
    
    videoPlayerIframe.src = ''; // Stop video playback
    videoPlayerModal.classList.remove('active');
    document.body.style.overflow = '';
}

function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
        videoId = watchMatch[1];
    }
    
    // Short URL: youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
        videoId = shortMatch[1];
    }
    
    // Embed URL: youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch) {
        videoId = embedMatch[1];
    }
    
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    
    return null;
}

// Video player modal event listeners
if (videoPlayerModalClose) {
    videoPlayerModalClose.addEventListener('click', closeVideoPlayer);
}

if (videoPlayerBackdrop) {
    videoPlayerBackdrop.addEventListener('click', closeVideoPlayer);
}

// Close video player with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoPlayerModal?.classList.contains('active')) {
        closeVideoPlayer();
    }
});

// ===========================
// Initialize
// ===========================
window.addEventListener('load', () => {
    showPage('platform-page');
    // Apply saved language or default to English
    setLanguage(currentLanguage);
});
