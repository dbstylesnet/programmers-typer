import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const PROMO_VIDEO_ID = 'promo-video';
const PROMO_VIDEO_SRC = '/promo.mp4';
const WATCH_VIDEO_THUMB = '/watch-video-thumb.png';

let openPromoVideoPlayer: (() => void) | null = null;

export function playPromoVideo(): void {
  openPromoVideoPlayer?.();
}

function PromoVideoPlayer({ onClose }: { onClose: () => void }): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play();
  }, []);

  return createPortal(
    <div className="promo-video-player" id={PROMO_VIDEO_ID} role="dialog" aria-label="Promo video">
      <button type="button" className="promo-video-player-close" onClick={onClose} aria-label="Close video">
        ×
      </button>
      <video
        ref={videoRef}
        className="promo-video-player-video"
        src={PROMO_VIDEO_SRC}
        controls
        playsInline
        preload="metadata"
      />
    </div>,
    document.body,
  );
}

export function PromoVideo(): JSX.Element {
  const [playerOpen, setPlayerOpen] = useState(false);

  const openPlayer = useCallback(() => {
    setPlayerOpen(true);
  }, []);

  const closePlayer = useCallback(() => {
    setPlayerOpen(false);
  }, []);

  useEffect(() => {
    openPromoVideoPlayer = openPlayer;
    return () => {
      if (openPromoVideoPlayer === openPlayer) {
        openPromoVideoPlayer = null;
      }
    };
  }, [openPlayer]);

  return (
    <>
      <div className="main-header-promo">
        <button
          type="button"
          className="main-header-promo-trigger"
          onClick={openPlayer}
          aria-label="Watch video"
        >
          <img src={WATCH_VIDEO_THUMB} alt="Watch video" className="main-header-promo-thumb" />
        </button>
      </div>
      {playerOpen && <PromoVideoPlayer onClose={closePlayer} />}
    </>
  );
}
