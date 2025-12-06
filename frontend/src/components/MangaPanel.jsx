import React from "react";

const MangaPanel = ({ manga }) => {
  if (!manga) return null;

  const imageSrc = manga.image_url || manga.image_data_url || "";
  return (
    <div className="card">
      <div className="card-head">
        <div className="eyebrow">Nano Banana Pro</div>
        <h3>Manga preview</h3>
      </div>
      <div className="manga-frame">
        {imageSrc ? (
          <img src={imageSrc} alt="Generated manga page" />
        ) : (
          <div className="manga-placeholder">No image yet</div>
        )}
      </div>

      {manga.panels?.length ? (
        <div className="section">
          <div className="eyebrow">Dialogue on page</div>
          <div className="panel-list">
            {manga.panels.map((panel) => (
              <div key={panel.panel} className="panel-line">
                <span className="badge">#{panel.panel}</span>
                <div className="panel-text">
                  <div className="jp">{panel.jp}</div>
                  <div className="romaji">{panel.romaji}</div>
                  <div className="en">{panel.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {manga.notes && <p className="footnote">{manga.notes}</p>}
    </div>
  );
};

export default MangaPanel;
