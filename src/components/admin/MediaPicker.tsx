'use client';
import type { Media } from '@/lib/types';
import { MediaLibrary } from './MediaLibrary';

export function MediaPicker({ onPick, onClose }: { onPick: (m: Media) => void; onClose: () => void }) {
  return (
    <div className="ad-modal" onClick={onClose}>
      <div className="ad-modal__box" onClick={(e) => e.stopPropagation()}>
        <div className="ad-head" style={{ marginBottom: 12 }}><h1 style={{ fontSize: 20 }}>Choose an image</h1><button className="ad-btn" onClick={onClose}>Close</button></div>
        <MediaLibrary onPick={onPick} />
      </div>
    </div>
  );
}
