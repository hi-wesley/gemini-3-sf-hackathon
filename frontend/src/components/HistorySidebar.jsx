import React from "react";

const HistorySidebar = ({ history, onSelect, onDelete }) => {
    return (
        <aside className="history-sidebar">
            <div className="sidebar-header">
                <span className="eyebrow">Memory Lane</span>
            </div>

            {!history || history.length === 0 ? (
                <p className="muted" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                    The last 2 mangas you generate are saved to your browser's local storage and viewable here.
                </p>
            ) : (
                <div className="history-list">
                    {history.map((item, idx) => (
                        <div key={item.id || idx} className="history-item" onClick={() => onSelect(item)}>
                            <div className="history-head">
                                <div className="history-date">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item.id);
                                    }}
                                    title="Delete item"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="history-preview">
                                {item.entry.slice(0, 60)}...
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default HistorySidebar;
