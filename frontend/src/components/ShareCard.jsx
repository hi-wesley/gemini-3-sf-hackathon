import React, { forwardRef } from "react";

const ShareCard = forwardRef(({ result, entry }, ref) => {
    if (!result) return null;

    const { manga, teaching } = result;

    // Use first Japanese line as the "Title"
    const titleLine = result.script?.panels?.[0]?.jp || "日曜日";

    // Use image source safely
    const imageSrc = manga.image_url || manga.image_data_url || "";

    return (
        <div className="share-card-container" ref={ref}>
            <div className="share-card-content">
                <div className="share-header">
                    <span className="share-brand">Nichijou (Your everyday life)</span>
                    <span className="share-date">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="share-image-frame">
                    {imageSrc && <img src={imageSrc} alt="Manga" />}
                </div>

                <div className="share-text-block">
                    {result.script?.panels?.map((panel, idx) => (
                        <div key={idx} className="share-panel-line">
                            <span className="share-panel-num">{idx + 1}.</span>
                            <p className="share-panel-text">{panel.en}</p>
                        </div>
                    ))}
                </div>

                <div className="share-footer">
                    <div className="share-chip">Gemini 3 Pro</div>
                    <div className="share-chip">Nano Banana Pro</div>
                </div>
            </div>
        </div>
    );
});

export default ShareCard;
