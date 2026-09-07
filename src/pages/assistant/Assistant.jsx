import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, MessageSquare, Trash2, Search, Send, Square, 
  ChevronDown, ChevronRight, BookOpen, CheckCircle, Database, ShieldAlert, Loader2,
  Mic, MicOff, Volume2, VolumeX, Globe
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Assistant.css';
import logo from '../../assets/logo1.png';

const API_BASE_URL = "http://localhost:8000/api";

const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Hindi", code: "hi" },
  { name: "Marathi", code: "mr" },
  { name: "Tamil", code: "ta" },
  { name: "Telugu", code: "te" },
  { name: "Bengali", code: "bn" },
  { name: "Gujarati", code: "gu" },
  { name: "Kannada", code: "kn" },
  { name: "Malayalam", code: "ml" },
  { name: "Punjabi", code: "pa" }
];

export default function Assistant() {
  const [sessions, setSessions] = useState(() => {
    const defaultId = Math.random().toString(36).substring(2, 9);
    return {
      [defaultId]: { id: defaultId, title: "New Healthcare Chat", messages: [] }
    };
  });
  const [currentSessionId, setCurrentSessionId] = useState(() => Object.keys(sessions)[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ online: false, vectorCount: 0 });
  const [expandedCitations, setExpandedCitations] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Voice Recording & TTS States
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const currentAudioRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/status`);
        const data = await res.json();
        if (data.status === "online") {
          setSystemStatus({ online: true, vectorCount: data.vector_count });
        } else {
          setSystemStatus({ online: false, vectorCount: 0 });
        }
      } catch (err) {
        setSystemStatus({ online: false, vectorCount: 0 });
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSessionId, isGenerating, isTranscribing]);

  const activeSession = sessions[currentSessionId] || { title: "New Healthcare Chat", messages: [] };

  const handleNewChat = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    setSessions(prev => ({
      ...prev,
      [newId]: { id: newId, title: "New Healthcare Chat", messages: [] }
    }));
    setCurrentSessionId(newId);
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = { ...prev };
      delete updated[id];
      const keys = Object.keys(updated);
      if (keys.length === 0) {
        const freshId = Math.random().toString(36).substring(2, 9);
        updated[freshId] = { id: freshId, title: "New Healthcare Chat", messages: [] };
        setCurrentSessionId(freshId);
      } else if (currentSessionId === id) {
        setCurrentSessionId(keys[keys.length - 1]);
      }
      return updated;
    });
  };

  const toggleCitation = (msgIndex) => {
    setExpandedCitations(prev => ({
      ...prev,
      [msgIndex]: !prev[msgIndex]
    }));
  };

  // --------------------------------------------------
  // Voice Recording (STT via Whisper)
  // --------------------------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone permission is required for voice input.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice_input.webm");
      formData.append("language", selectedLanguage);

      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription failed.");

      const data = await response.json();
      if (data.text) {
        handleSendMessage(data.text);
      }
    } catch (err) {
      console.error("STT Error:", err);
      alert("Failed to transcribe voice input. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // --------------------------------------------------
  // Text-to-Speech (TTS via gTTS)
  // --------------------------------------------------
  const handlePlayTTS = async (text, msgIdx) => {
    if (playingAudioIndex === msgIdx) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setPlayingAudioIndex(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    try {
      setPlayingAudioIndex(msgIdx);
      const response = await fetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          language: selectedLanguage
        })
      });

      if (!response.ok) throw new Error("TTS Request failed.");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      currentAudioRef.current = audio;

      audio.onended = () => {
        setPlayingAudioIndex(null);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        setPlayingAudioIndex(null);
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error("TTS Error:", err);
      setPlayingAudioIndex(null);
    }
  };

  // --------------------------------------------------
  // Chat Execution (NDJSON Stream)
  // --------------------------------------------------
  const handleSendMessage = async (customQuery = null) => {
    const queryText = customQuery || inputQuery;
    if (!queryText.trim() || isGenerating) return;

    const targetSessionId = currentSessionId;
    setInputQuery("");
    setIsGenerating(true);

    const currentSess = sessions[targetSessionId] || { title: "New Healthcare Chat", messages: [] };

    if (currentSess.messages.length === 0) {
      const newTitle = queryText.length > 26 ? queryText.substring(0, 26) + "..." : queryText;
      setSessions(prev => ({
        ...prev,
        [targetSessionId]: { ...prev[targetSessionId], title: newTitle }
      }));
    }

    const userMsg = { role: "user", content: queryText };
    const initialAssistantMsg = { role: "assistant", content: "", citations: [] };

    setSessions(prev => ({
      ...prev,
      [targetSessionId]: {
        ...prev[targetSessionId],
        messages: [...(prev[targetSessionId]?.messages || []), userMsg, initialAssistantMsg]
      }
    }));

    abortControllerRef.current = new AbortController();

    try {
      const historyPayload = (currentSess.messages || []).map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          history: historyPayload,
          language: selectedLanguage,
          session_id: sessions[targetSessionId].backendSessionId || null
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        let errorMsg = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData && errData.detail) {
            errorMsg = `Server error: ${errData.detail}`;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        setSessions(prev => {
          const sess = prev[targetSessionId];
          if (!sess) return prev;
          const msgs = [...sess.messages];
          msgs[msgs.length - 1] = {
            ...msgs[msgs.length - 1],
            content: data.response,
            citations: data.citations || []
          };

          return {
            ...prev,
            [targetSessionId]: {
              ...sess,
              backendSessionId: data.session_id || sess.backendSessionId,
              messages: msgs
            }
          };
        });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const processLine = (line) => {
        if (!line.trim()) return;
        try {
          const data = JSON.parse(line);
          if (data.type === "session") {
            setSessions(prev => ({
              ...prev,
              [targetSessionId]: {
                ...prev[targetSessionId],
                backendSessionId: data.session_id
              }
            }));
            return;
          }

          if (data.type === "citations") {
            setSessions(prev => {
              const sess = prev[targetSessionId];
              if (!sess) return prev;
              const msgs = [...sess.messages];
              const lastIdx = msgs.length - 1;
              if (lastIdx >= 0) {
                msgs[lastIdx] = { ...msgs[lastIdx], citations: data.citations };
              }
              return { ...prev, [targetSessionId]: { ...sess, messages: msgs } };
            });
          } else if (data.type === "token") {
            setSessions(prev => {
              const sess = prev[targetSessionId];
              if (!sess) return prev;
              const msgs = [...sess.messages];
              const lastIdx = msgs.length - 1;
              if (lastIdx >= 0) {
                msgs[lastIdx] = {
                  ...msgs[lastIdx],
                  content: (msgs[lastIdx].content || "") + data.content
                };
              }
              return { ...prev, [targetSessionId]: { ...sess, messages: msgs } };
            });
          }
        } catch (e) {
          console.error("NDJSON parse error:", e);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) processLine(buffer);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          processLine(line);
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        const displayError = err.message && !err.message.includes("Failed to fetch")
          ? `⚠️ ${err.message}`
          : "⚠️ Cannot connect to RAG server. Please make sure backend server (server1.py) is running at http://localhost:8000.";

        setSessions(prev => {
          const sess = prev[targetSessionId];
          if (!sess) return prev;
          const msgs = [...sess.messages];
          const lastIdx = msgs.length - 1;
          if (lastIdx >= 0) {
            msgs[lastIdx] = {
              ...msgs[lastIdx],
              content: displayError
            };
          }
          return { ...prev, [targetSessionId]: { ...sess, messages: msgs } };
        });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const filteredSessions = Object.values(sessions).filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).reverse();

  return (
    <div className="assistant-container">
      {/* Sidebar */}
      <aside className="assistant-sidebar">
        <div className="assistant-sidebar-header">
          <div className="assistant-brand-title">Healthcare AI Assistant</div>
          <div className="assistant-brand-subtitle">Multilingual Voice RAG System</div>
        </div>

        <button className="assistant-new-chat-btn" onClick={handleNewChat}>
          <Plus size={16} /> New Chat
        </button>

        <div className="assistant-search-box">
          <Search size={14} className="assistant-search-icon" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="assistant-history-label">CONVERSATION HISTORY</div>

        <div className="assistant-history-list">
          {filteredSessions.map((s) => (
            <div 
              key={s.id} 
              className={`assistant-history-item ${s.id === currentSessionId ? 'active' : ''}`}
              onClick={() => setCurrentSessionId(s.id)}
            >
              <MessageSquare size={14} />
              <span className="assistant-item-title">{s.title}</span>
              <button className="assistant-delete-btn" onClick={(e) => handleDeleteSession(s.id, e)}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="assistant-sidebar-footer">
          {systemStatus.online ? (
            <div className="assistant-status-indicator online">
              <Database size={13} /> System Online | {systemStatus.vectorCount} Vectors
            </div>
          ) : (
            <div className="assistant-status-indicator offline">
              <ShieldAlert size={13} /> RAG Database Offline
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="assistant-main-content">
        <header className="assistant-top-header">
          <div className="assistant-header-title">
            <h2>AI Multilingual Assistant</h2>
            <span>Rural Health, Clinical Protocols & Multilingual Communication</span>
          </div>

          <div className="assistant-header-actions">
            <div className="assistant-language-selector">
              <Globe size={15} className="assistant-lang-icon" />
              <select 
                className="assistant-language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="header-badges">
              <span className="assistant-pill-badge">Voice: Whisper & gTTS</span>
            </div>
          </div>
        </header>

        <div className="assistant-chat-viewport">
          {activeSession.messages.length === 0 ? (
            <div className="assistant-empty-state">
              <div className="assistant-empty-logo">
                <img src={logo} alt="Healthcare Logo" style={{ width: '110px', height: 'auto' }} />
              </div>
              <h3>Rural Healthcare AI Assistant</h3>
              <p>Ask health questions in English, Hindi, Marathi, Tamil, Telugu, or speak using the microphone!</p>
            </div>
          ) : (
            activeSession.messages.map((msg, idx) => (
              <div key={idx} className={`assistant-message-row ${msg.role}`}>
                <div className="assistant-message-bubble">
                  {msg.role === "assistant" && (
                    <div className="assistant-meta">
                      <span className="assistant-model-tag">Pinecone RAG + Gemma3</span>
                      {msg.content && !msg.content.startsWith("⚠️") && (
                        <button 
                          className={`assistant-tts-btn ${playingAudioIndex === idx ? 'playing' : ''}`}
                          onClick={() => handlePlayTTS(msg.content, idx)}
                          title="Listen to response"
                        >
                          {playingAudioIndex === idx ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          {playingAudioIndex === idx ? "Stop" : "Listen"}
                        </button>
                      )}
                    </div>
                  )}

                  {msg.role === "assistant" ? (
                    <div className="assistant-message-text">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || "..."}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div>{msg.content}</div>
                  )}

                  {/* Citations Drawer */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="assistant-citations-accordion">
                      <button 
                        className="assistant-citations-toggle"
                        onClick={() => toggleCitation(idx)}
                      >
                        <BookOpen size={13} />
                        {msg.citations.length} Clinical Reference Sources
                        {expandedCitations[idx] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      </button>

                      {expandedCitations[idx] && (
                        <div className="assistant-citations-list">
                          {msg.citations.map((cit, cIdx) => (
                            <div key={cIdx} className="assistant-citation-card">
                              <div className="assistant-citation-title">📄 {cit.source || "Clinical Guidance"} (Match score: {(cit.score * 100).toFixed(1)}%)</div>
                              <div className="assistant-citation-snippet">{(cit.text || cit.snippet || "").substring(0, 300)}...</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="assistant-bottom-deck">
          <div className="assistant-input-wrapper">
            <button 
              className={`assistant-mic-btn ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing || isGenerating}
              title={isRecording ? "Stop Recording" : "Speak Query"}
            >
              {isTranscribing ? (
                <Loader2 size={18} className="spin-icon" />
              ) : isRecording ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}
            </button>

            <input 
              type="text" 
              className="assistant-chat-input" 
              placeholder={isTranscribing ? "Transcribing voice audio..." : `Ask healthcare question in ${selectedLanguage}...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isGenerating || isTranscribing}
            />

            {isGenerating ? (
              <button className="assistant-action-btn stop" onClick={handleStopGeneration}>
                <Square size={14} /> Stop
              </button>
            ) : (
              <button 
                className="assistant-action-btn send" 
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim() || isTranscribing}
              >
                <Send size={14} /> Ask AI
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
