import React, { useState, useEffect, useRef } from 'react';

// Helper function to parse markdown-like text for better rendering
const SimpleMarkdown = ({ text }) => {
    if (!text) return null;
    let formattedText = text;
    // Handle Markdown style links like [text](url)
    formattedText = formattedText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>');
    
    // Handle bullet points specifically for research questions
    formattedText = formattedText.replace(/^\s*[\*\-]\s*(.*)/gm, '<li>$1</li>');
    if (formattedText.includes('<li>')) {
        formattedText = `<ul>${formattedText}</ul>`;
    }
    // Handle bold and italic
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Handle code blocks
    formattedText = formattedText.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 p-2 rounded-md my-2 text-sm whitespace-pre-wrap"><code>$1</code></pre>');
    formattedText = formattedText.replace(/`(.*?)`/g, '<code class="bg-gray-900 px-1 py-0.5 rounded-md">$1</code>');
    // Handle standalone URLs
    const urlRegex = /(?<!href=")(?<!\]\()https?:\/\/[^\s)]+/g;
    formattedText = formattedText.replace(urlRegex, '<a href="$&" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$&</a>');
    // Handle newlines and list item cleanup
    formattedText = formattedText.replace(/\n/g, '<br />').replace(/<\/li><br \/>/g, '</li>');
    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

// --- SVG Icons ---
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>);
const ImageIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-12zM19 14l-4.5-6-3.5 4.51-2.5-3.01L5 14h14z" /></svg>);
const PencilIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>);
const BookIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" /></svg>);
const UserIcon = ({ initials }) => (<div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-lg">{initials}</div>);
const AiIcon = () => (<div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.08V7.92c0-.41.47-.65.8-.4l4.52 3.08c.33.22.33.77 0 1l-4.52 3.08c-.33.23-.8.01-.8-.4z" /></svg></div>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const LibraryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>);
const RareAiIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M5 10v4m-2-2h4m6-6v4m-2-2h4m-2 7v4m-2-2h4m6-11v4m-2-2h4" /></svg>);
const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>);
const EqualizerIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const PhotosIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const FilesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
const TelescopeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-3 3 3 3" /></svg>);
const StudyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const WebSearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const ThoughtBubbleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 12H5v-2h14v2zm0-3H5V9h14v2zm0-3H5V6h14v2z"/></svg>);
const UserLogoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" /></svg>);
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.32 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 12 2.04Z" /></svg>);
const WhatsAppIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 12C2.13 14.06 2.69 16.03 3.68 17.72L2 22L6.45 20.39C8.06 21.32 9.98 21.88 12.04 21.88C17.5 21.88 21.95 17.43 21.95 12C21.95 6.55 17.5 2 12.04 2M12.04 3.63C16.56 3.63 20.22 7.29 20.22 12C20.22 16.71 16.56 20.37 12.04 20.37C10.23 20.37 8.53 19.84 7.12 18.91L6.77 18.7L4.23 19.41L5 16.94L4.79 16.58C3.92 15.14 3.42 13.4 3.42 12C3.42 7.29 7.08 3.63 12.04 3.63M9.13 7.89C8.93 7.45 8.73 7.44 8.56 7.43H8.22C8.06 7.43 7.8 7.49 7.56 7.73C7.32 7.97 6.67 8.55 6.67 9.71C6.67 10.87 7.59 11.99 7.74 12.17C7.89 12.35 9.22 14.54 11.37 15.45C13.52 16.36 13.52 16.24 13.88 16.21C14.24 16.18 15.22 15.65 15.45 15.08C15.68 14.51 15.68 14.06 15.61 13.97C15.54 13.88 15.38 13.82 15.14 13.7C14.9 13.58 13.78 13.03 13.56 12.94C13.34 12.85 13.18 12.81 13.02 13.05C12.86 13.29 12.36 13.87 12.22 14.05C12.08 14.23 11.94 14.24 11.7 14.12C11.46 14 10.74 13.76 9.82 12.93C9.1 12.28 8.62 11.45 8.47 11.18C8.32 10.91 8.44 10.79 8.56 10.67C8.68 10.55 8.83 10.37 8.95 10.23C9.07 10.09 9.12 9.97 9.22 9.78C9.32 9.59 9.26 9.42 9.19 9.3C9.12 9.18 8.93 8.78 9.13 7.89Z" /></svg>);


// --- Standalone Components ---
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, handleNewChat }) => (
    <div className={`absolute md:relative z-20 h-full w-72 bg-black text-gray-300 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 flex-grow">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleNewChat} className="p-2 rounded-md hover:bg-gray-800"><PencilIcon className="w-5 h-5" /></button>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-800 md:hidden"><MenuIcon /></button>
            </div>
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                <input type="text" placeholder="Search" className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 focus:outline-none" />
            </div>
            <nav className="space-y-2">
                <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800"><ChatIcon /> Chats</a>
                <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800"><LibraryIcon /> Library</a>
                <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800"><RareAiIcon /> Rare AI</a>
            </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
                <UserLogoIcon />
                <span className="font-semibold">Sign in</span>
            </div>
        </div>
    </div>
);

const AttachmentMenu = ({ handleTaskSelect }) => {
    const tasks = [
        { id: 'camera', name: 'Camera', icon: <CameraIcon />, promptPrefix: "Analyze the image from the camera" },
        { id: 'photos', name: 'Photos', icon: <PhotosIcon />, promptPrefix: "Analyze the photo" },
        { id: 'files', name: 'Files', icon: <FilesIcon />, promptPrefix: "Analyze the file" },
    ];
    const actions = [
        { id: 'think_longer', name: 'Think longer', icon: <LightbulbIcon />, promptPrefix: "Think longer about" },
        { id: 'deep_research', name: 'Deep research', icon: <TelescopeIcon />, promptPrefix: "Do deep research on" },
        { id: 'study_learn', name: 'Study and learn', icon: <StudyIcon />, promptPrefix: "Help me study and learn about" },
        { id: 'create_image', name: 'Create image', icon: <ImageIcon className="w-5 h-5" />, promptPrefix: "Create an image of" },
        { id: 'web_search', name: 'Web search', icon: <WebSearchIcon />, promptPrefix: "Do a web search for" },
    ];

    return (
        <div className="absolute bottom-20 left-0 right-0 p-4 z-10">
            <div className="max-w-4xl mx-auto bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-xl p-4 text-white">
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    {tasks.map(task => (
                        <button key={task.id} onClick={() => handleTaskSelect(task)} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700">{task.icon}<span>{task.name}</span></button>
                    ))}
                </div>
                <div className="space-y-4">
                    {actions.map(action => (
                         <button key={action.id} onClick={() => handleTaskSelect(action)} className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700">{action.icon}<span>{action.name}</span></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ResearchingAnimation = () => {
    const [action, setAction] = useState("Starting research...");
    const actions = [
        "Reading reuters.com...",
        "Analyzing market data...",
        "Checking sources for accuracy...",
        "Searching for historical trends...",
        "Compiling information...",
        "Reading bloomberg.com..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setAction(actions[Math.floor(Math.random() * actions.length)]);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-start gap-4">
            <AiIcon />
            <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200">
                <div className="flex items-center gap-3">
                    <span className="w-48 truncate">{action}</span>
                    <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full animate-research-progress"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WebSearchAnimation = () => (
    <div className="flex items-start gap-4">
        <AiIcon />
        <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 text-white">
                    <WebSearchIcon />
                </div>
                <span>Searching the web</span>
            </div>
        </div>
    </div>
);

const SourceLogos = ({ sources }) => {
    const getLogo = (sourceName) => {
        const name = sourceName.toLowerCase();
        if (name.includes('wikipedia')) return 'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg';
        if (name.includes('reuters')) return 'https://www.reuters.com/pf/resources/images/reuters/logo-vertical-dark-z.svg?d=134';
        if (name.includes('bloomberg')) return 'https://www.bloomberg.com/favicon.ico';
        return `https://www.google.com/s2/favicons?domain=${sourceName}&sz=32`;
    };

    return (
        <div className="mt-4 pt-2 border-t border-gray-600">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Sources:</h4>
            <div className="flex items-center gap-3">
                {sources.map((source, index) => (
                    <a href={source.url} key={index} target="_blank" rel="noopener noreferrer" title={source.name} className="flex items-center justify-center p-1 bg-gray-600 rounded-full hover:bg-gray-500">
                        <img src={getLogo(source.name)} alt={`${source.name} logo`} className="w-6 h-6 rounded-full" />
                    </a>
                ))}
            </div>
        </div>
    );
};

const ThinkingMessage = ({ thought }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-start gap-4">
            <AiIcon />
            <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 pb-2 border-b border-gray-600">
                    <ThoughtBubbleIcon />
                    <span>Thought for {elapsed} seconds</span>
                </div>
                <SimpleMarkdown text={thought} />
            </div>
        </div>
    );
};

const CeoBio = () => (
    <div className="flex items-start gap-4">
        <AiIcon />
        <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200">
            <SimpleMarkdown text="I am Rare AI, an advanced language model created by Nisar Khan. At 20 years old, Nisar, from Pakistan, developed me with the vision of creating a helpful and accessible AI for everyone. His goal is to empower users with a powerful tool for research, creativity, and learning." />
            <div className="mt-4 pt-2 border-t border-gray-600 flex items-center gap-4">
                <a href="https://www.instagram.com/rare_tips69/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><InstagramIcon /></a>
                <a href="https://www.facebook.com/share/1FCqAG7GnK/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><FacebookIcon /></a>
                <a href="https://wa.me/923409796147" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><WhatsAppIcon /></a>
            </div>
        </div>
    </div>
);


const ChatView = ({ setIsSidebarOpen, messages, isLoading, showAttachmentMenu, setShowAttachmentMenu, activeTask, setActiveTask, input, setInput, handleFormSubmit, handleTaskSelect, inputRef, messagesEndRef, deepResearchState }) => (
    <div className="flex-1 flex flex-col bg-gray-800 h-full relative">
        <header className="p-4 flex items-center justify-between text-white bg-gray-800">
            <button onClick={() => setIsSidebarOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-700">
                <MenuIcon />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700">
                <PlusIcon />
                <span>Get Plus</span>
            </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                {messages.length === 0 && !isLoading && (
                    <div className="text-center text-white my-12">
                        <h1 className="text-5xl font-bold mb-8">What can I help with?</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-lg">
                            <button onClick={() => handleTaskSelect({id: 'create_image', name: 'Create Image', promptPrefix: 'Create an image of'})} className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"><ImageIcon className="w-6 h-6 text-green-400" /><span>Create image</span></button>
                            <button onClick={() => handleTaskSelect({id: 'write', name: 'Help me write', promptPrefix: 'Help me write'})} className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"><PencilIcon className="w-6 h-6 text-purple-400" /><span>Help me write</span></button>
                            <button onClick={() => handleTaskSelect({id: 'summarize', name: 'Summarize text', promptPrefix: 'Summarize the following text'})} className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"><BookIcon className="w-6 h-6 text-orange-400" /><span>Summarize text</span></button>
                        </div>
                    </div>
                )}
                <div className="space-y-6">
                    {messages.map((msg, index) => {
                        if (msg.role === 'system') {
                            return <div key={index} className="text-center text-sm text-gray-400 italic my-2">--- {msg.text} ---</div>
                        }
                        if (msg.isThought) {
                            return <ThinkingMessage key={index} thought={msg.text} />;
                        }
                        if (msg.isBio) {
                            return <CeoBio key={index} />;
                        }
                        return (
                            <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'assistant' && <AiIcon />}
                                <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                    {msg.isImage ? 
                                        <img src={msg.text} alt="Generated by AI" className="rounded-lg" /> : 
                                        <SimpleMarkdown text={msg.text} />
                                    }
                                    {msg.sources && msg.sources.length > 0 && <SourceLogos sources={msg.sources} />}
                                    
                                    {msg.role === 'assistant' && msg.model && (
                                        <p className="text-xs text-gray-400 mt-2 opacity-75">{msg.model}</p>
                                    )}
                                </div>
                                {msg.role === 'user' && <UserIcon initials="U" />}
                            </div>
                        )
                    })}
                    {isLoading && deepResearchState === 'researching' && <ResearchingAnimation />}
                    {isLoading && activeTask?.id === 'web_search' && <WebSearchAnimation />}
                    {isLoading && !deepResearchState && activeTask?.id !== 'web_search' && (
                         <div className="flex items-start gap-4">
                            <AiIcon />
                            <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </main>

        {showAttachmentMenu && <AttachmentMenu handleTaskSelect={handleTaskSelect} />}

        <footer className="p-4 md:p-6 bg-gray-800">
            <div className="max-w-3xl mx-auto">
                {activeTask && (
                    <div className="flex justify-center mb-2">
                        <div className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
                            <span>{activeTask.name}</span>
                            <button onClick={() => setActiveTask(null)} className="bg-purple-800 rounded-full p-0.5 hover:bg-purple-900"><CloseIcon /></button>
                        </div>
                    </div>
                )}
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2 p-2 bg-gray-700 rounded-full">
                    <button type="button" onClick={() => setShowAttachmentMenu(prev => !prev)} className="p-2 text-gray-400 hover:text-white">
                        <ImageIcon className="w-6 h-6" />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setShowAttachmentMenu(false)}
                        placeholder={activeTask ? `Describe what to ${activeTask.id.replace('_', ' ')}...` : "Ask anything..."}
                        className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-2"
                        disabled={isLoading}
                    />
                    <button type="button" className="p-2 text-gray-400 hover:text-white"><MicIcon /></button>
                    <button type="submit" disabled={!input.trim() || isLoading} className="p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-500 disabled:cursor-not-allowed">
                        <EqualizerIcon />
                    </button>
                </form>
            </div>
        </footer>
    </div>
);


// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [deepResearchState, setDeepResearchState] = useState(null); 
    const [researchTopic, setResearchTopic] = useState('');
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // --- Effects ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Functions ---
    const handleTaskSelect = (task) => {
        setActiveTask(task);
        setShowAttachmentMenu(false);
        setMessages(prev => [...prev, { role: 'system', text: `${task.name} mode activated.` }]);
        if (task.id === 'deep_research') {
            setDeepResearchState('awaiting_topic');
        }
        inputRef.current?.focus();
    };

    const parseResponseWithSources = (responseText) => {
        const sourcesHeader = "Sources:";
        const sourcesIndex = responseText.indexOf(sourcesHeader);
        if (sourcesIndex === -1) {
            return { mainText: responseText, sources: [] };
        }
        
        const mainText = responseText.substring(0, sourcesIndex).trim();
        const sourcesText = responseText.substring(sourcesIndex + sourcesHeader.length);
        
        const sources = [];
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(sourcesText)) !== null) {
            sources.push({ name: match[1], url: match[2] });
        }
        
        return { mainText, sources };
    };
    
    const handleSendMessage = async () => {
        const promptText = input;
        if (!promptText.trim() || isLoading) return;
        
        setShowAttachmentMenu(false);
        
        const newUserMessage = { role: 'user', text: promptText };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const bioKeywords = ['who are you', 'who made you', 'ceo of rare ai', 'nisar khan'];
            const isBioQuery = bioKeywords.some(keyword => promptText.toLowerCase().includes(keyword));

            if (isBioQuery) {
                setMessages(prev => [...prev, { role: 'assistant', isBio: true }]);
                setIsLoading(false);
                return;
            }

            const GOOGLE_API_KEY = "AIzaSyDMoIRp7NwBJb-ej262R3_p0ytzVEzlgbQ"; 
            
            if (activeTask && activeTask.id === 'deep_research') {
                if (deepResearchState === 'awaiting_topic') {
                    setResearchTopic(promptText);
                    const questionPrompt = `A user wants to do deep research on: "${promptText}". Ask 4-5 short, clarifying, bullet-point questions to understand their needs. For example: "Are you interested in historical trends or forecasts?"`;
                    
                    const response = await callGeminiAPI(questionPrompt, GOOGLE_API_KEY);
                    setMessages(prev => [...prev, { role: 'assistant', text: response, model: "Rare AI" }]);
                    setDeepResearchState('clarifying');
                } else if (deepResearchState === 'clarifying') {
                    setMessages(prev => [...prev, { role: 'system', text: "Got it. This is a complex topic, so I will take a few minutes to conduct a thorough search and compile the results for you." }]);
                    setDeepResearchState('researching');
                    await new Promise(resolve => setTimeout(resolve, 5000)); 

                    const finalResearchPrompt = `Gather the latest information from all over the world for a detailed report. The original topic was "${researchTopic}". The user provided these clarifications: "${promptText}". At the end of your answer, please list the direct URLs of the top 3-4 websites you used as sources under a "Sources:" heading in the format: - [Website Name](URL)`;
                    
                    const rawResponse = await callGeminiAPI(finalResearchPrompt, GOOGLE_API_KEY);
                    const { mainText, sources } = parseResponseWithSources(rawResponse);
                    setMessages(prev => [...prev, { role: 'assistant', text: mainText, sources: sources, model: "Rare AI", source: 'web' }]);
                    setDeepResearchState(null);
                    setActiveTask(null);
                }
            } else if (activeTask && activeTask.id === 'think_longer') {
                const thinkPrompt = `Think step-by-step about the user's request: "${promptText}". Write down your internal monologue.`;
                const thought = await callGeminiAPI(thinkPrompt, GOOGLE_API_KEY);
                
                setMessages(prev => [...prev, { role: 'assistant', text: thought, isThought: true }]);
                
                const answerPrompt = `Based on the following thought process:\n\n${thought}\n\nNow, provide a final, concise answer to the user's original request: "${promptText}"`;
                const answer = await callGeminiAPI(answerPrompt, GOOGLE_API_KEY);

                const finalAnswerMessage = { role: 'assistant', text: answer, model: "Rare AI" };
                setMessages(prev => [...prev, finalAnswerMessage]);
                setActiveTask(null);

            } else {
                let finalPrompt = promptText;
                if (activeTask) {
                    finalPrompt = `${activeTask.promptPrefix}: "${promptText}"`;
                }

                let newModelMessage;
                if (activeTask && activeTask.id === 'create_image') {
                    setMessages(prev => [...prev, { role: 'system', text: "Okay, I'm starting the image generation process. This can take a few moments to create a high-quality result." }]);
                    await new Promise(resolve => setTimeout(resolve, 3000)); 
                    const imageUrl = await callImagenAPI(finalPrompt, GOOGLE_API_KEY);
                    newModelMessage = { role: 'assistant', text: imageUrl, isImage: true, model: "Rare AI (Imagen 3)" };
                } else {
                    const webSearchTasks = ['web_search'];
                    const isWebSearchTask = activeTask && webSearchTasks.includes(activeTask.id);
                    if (isWebSearchTask) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        finalPrompt = `Gather the latest information from all over the world to answer this: ${finalPrompt}. At the end of your answer, please list the direct URLs of the top 3-4 websites you used as sources under a "Sources:" heading in the format: - [Website Name](URL)`;
                    }
                    const rawResponse = await callGeminiAPI(finalPrompt, GOOGLE_API_KEY);
                    const { mainText, sources } = parseResponseWithSources(rawResponse);
                    newModelMessage = { 
                        role: 'assistant', 
                        text: mainText, 
                        sources: sources,
                        model: "Rare AI",
                        source: isWebSearchTask ? 'web' : null
                    };
                }
                setActiveTask(null);
                setMessages(prev => [...prev, newModelMessage]);
            }

        } catch (error) {
            console.error("API call failed:", error);
            const errorMessage = { role: 'assistant', text: `An error occurred: ${error.message}`, model: "System" };
            setMessages(prev => [...prev, errorMessage]);
            setDeepResearchState(null);
            setActiveTask(null);
        } finally {
            setIsLoading(false);
        }
    };

    const callGeminiAPI = async (prompt, apiKey) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Error: ${errorData.error.message}`);
        }
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    };
    
    const callImagenAPI = async (prompt, apiKey) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Imagen API Error: ${errorData.error.message}`);
        }
        const result = await response.json();
        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
            const base64Image = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
            return await addWatermark(base64Image);
        } else {
            throw new Error("Image data not found in API response.");
        }
    };
    
    const addWatermark = (base64Image) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const fontSize = Math.max(12, Math.min(img.width / 40, img.height / 30));
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';

                ctx.fillText('Created by Rare AI', canvas.width - 10, canvas.height - 10);
                
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = base64Image;
        });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSendMessage();
    };

    const handleNewChat = () => {
        setMessages([]);
        setShowAttachmentMenu(false);
        setIsSidebarOpen(false);
        setActiveTask(null);
        setDeepResearchState(null);
    };

    return (
        <div className="h-screen w-screen bg-black font-sans flex overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleNewChat={handleNewChat}
            />
            <div className="flex-1 flex flex-col">
                <ChatView
                    setIsSidebarOpen={setIsSidebarOpen}
                    messages={messages}
                    isLoading={isLoading}
                    showAttachmentMenu={showAttachmentMenu}
                    setShowAttachmentMenu={setShowAttachmentMenu}
                    activeTask={activeTask}
                    setActiveTask={setActiveTask}
                    input={input}
                    setInput={setInput}
                    handleFormSubmit={handleFormSubmit}
                    handleTaskSelect={handleTaskSelect}
                    inputRef={inputRef}
                    messagesEndRef={messagesEndRef}
                    deepResearchState={deepResearchState}
                />
            </div>
        </div>
    );
}

const styles = `
@keyframes research-progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
.animate-research-progress {
    animation: research-progress 1.5s ease-in-out infinite;
}
.prose ul { list-style-type: disc; margin-left: 1.5rem; }
.prose li { margin-bottom: 0.25rem; }
.prose ul { padding-left: 1.25rem; }
.prose a { color: #60a5fa; } 
.prose a:hover { text-decoration: underline; }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
