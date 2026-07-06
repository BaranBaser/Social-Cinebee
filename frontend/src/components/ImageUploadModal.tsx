'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  type: 'avatar' | 'banner';
  uploading: boolean;
}

export default function ImageUploadModal({ open, onClose, onUpload, type, uploading }: ImageUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [imgOffsetX, setImgOffsetX] = useState(0);
  const [imgOffsetY, setImgOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAvatar = type === 'avatar';

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setOriginalFile(null);
      setZoom(1);
      setImgOffsetX(0);
      setImgOffsetY(0);
    }
  }, [open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);
    setPreview(URL.createObjectURL(file));
    setZoom(1);
    setImgOffsetX(0);
    setImgOffsetY(0);
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOffsetX: imgOffsetX, startOffsetY: imgOffsetY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    setImgOffsetX(dragRef.current.startOffsetX + (e.clientX - dragRef.current.startX));
    setImgOffsetY(dragRef.current.startOffsetY + (e.clientY - dragRef.current.startY));
  }

  function handleMouseUp() { setDragging(false); }

  function handleUpload() {
    if (!preview || !originalFile) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const outW = isAvatar ? 400 : 1200;
      const outH = isAvatar ? 400 : 270;

      canvas.width = outW;
      canvas.height = outH;

      if (isAvatar) {
        const imgSize = Math.min(img.width, img.height);
        const sx = (img.width - imgSize) / 2;
        const sy = (img.height - imgSize) / 2;
        const scaledSize = imgSize * zoom;
        const dx = (outW - scaledSize) / 2 + imgOffsetX;
        const dy = (outH - scaledSize) / 2 + imgOffsetY;
        ctx.drawImage(img, sx, sy, imgSize, imgSize, dx, dy, scaledSize, scaledSize);
      } else {
        const imgAspect = img.width / img.height;
        const targetAspect = outW / outH;
        let sx: number, sy: number, sw: number, sh: number;

        if (imgAspect > targetAspect) {
          sh = img.height;
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / targetAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }

        const drawW = outW * zoom;
        const drawH = outH * zoom;
        const dx = (outW - drawW) / 2 + imgOffsetX * 2;
        const dy = (outH - drawH) / 2 + imgOffsetY * 2;

        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, drawW, drawH);
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], originalFile.name || 'upload.png', { type: 'image/png' });
        onUpload(file);
      }, 'image/png', 0.92);
    };
    img.src = preview;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface rounded-2xl border border-white/[0.08] shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-base font-bold text-white">
            {isAvatar ? 'Profil Resmi Yukle' : 'Banner Yukle'}
          </h3>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <div className="p-6">
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/[0.1] rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-honey/30 hover:bg-honey/[0.02] transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-honey/10 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-white mb-1">Dosya secin</p>
              <p className="text-xs text-muted">PNG, JPG, GIF veya WebP (maks 5MB)</p>
            </div>
          ) : (
            <>
              {isAvatar ? (
                <div
                  ref={containerRef}
                  className="relative overflow-hidden rounded-xl bg-ink border border-white/[0.06] select-none aspect-square mx-auto"
                  style={{ maxWidth: 400 }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ transform: `scale(${zoom}) translate(${imgOffsetX / zoom}px, ${imgOffsetY / zoom}px)` }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/4 h-3/4 rounded-full border-2 border-white/30" />
                  </div>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="relative overflow-hidden rounded-xl bg-ink border border-white/[0.06] select-none aspect-[9/2]"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ transform: `scale(${zoom}) translate(${imgOffsetX / zoom}px, ${imgOffsetY / zoom}px)` }}
                    draggable={false}
                  />
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted w-8">Yakin</span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-honey"
                  />
                  <span className="text-xs text-muted w-10 text-right">{Math.round(zoom * 100)}%</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  {isAvatar ? 'Gorseli surukleyerek konumunu ayarlayin' : 'Sari cizgi arasindaki kismi goruntelemek icin surukleyin ve yakinlastirin'}
                </p>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setPreview(null); setOriginalFile(null); setZoom(1); setImgOffsetX(0); setImgOffsetY(0); }}
                  className="flex-1 px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-muted hover:text-white hover:bg-white/[0.1] transition-all"
                >
                  Farkli Dosya
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 px-4 py-2.5 bg-honey text-ink text-sm font-bold rounded-xl hover:bg-honey-light transition-all disabled:opacity-40"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Yukleniyor...
                    </span>
                  ) : 'Kaydet'}
                </button>
              </div>
            </>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
}
