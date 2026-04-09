import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PuzzleContent } from '@/types/database';

interface PuzzleGameProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  pieceImages?: string[];
  discountCode: string;
  discountAmount: string;
  content?: PuzzleContent | null;
}

const COLS = 2;
const ROWS = 4;
const TOTAL_PIECES = COLS * ROWS;

function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  const colors = ['#fb923c', '#1e3a8a', '#f9fafb', '#f59e0b', '#3b82f6', '#ef4444', '#10b981'];
  const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string; rot: number; rv: number }[] = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 1) * 14 - 4,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 10,
    });
  }
  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rot += p.rv;
      const alpha = Math.max(0, 1 - frame / 120);
      if (alpha <= 0) return;
      alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    frame++;
    if (alive && frame < 150) requestAnimationFrame(animate);
    else canvas.remove();
  };
  requestAnimationFrame(animate);
}

export default function PuzzleGame({ isOpen, onClose, imageUrl, pieceImages, discountCode, discountAmount, content }: PuzzleGameProps) {
  const { t } = useLanguage();
  const [pieces, setPieces] = useState<number[]>([]);
  const [placedPieces, setPlacedPieces] = useState<Record<number, number>>({});
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shuffle = useCallback(() => {
    const arr = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setPieces(arr);
    setPlacedPieces({});
    setMoves(0);
    setWon(false);
  }, []);

  useEffect(() => {
    if (isOpen) shuffle();
  }, [isOpen, shuffle]);

  const handleDrop = (slotIdx: number) => {
    if (draggedPiece === null || placedPieces[slotIdx] !== undefined) return;
    setMoves((m) => m + 1);
    setHoverSlot(null);

    if (draggedPiece === slotIdx) {
      const newPlaced = { ...placedPieces, [slotIdx]: draggedPiece };
      setPlacedPieces(newPlaced);
      if (Object.keys(newPlaced).length === TOTAL_PIECES) {
        setTimeout(() => {
          setWon(true);
          launchConfetti();
        }, 400);
      }
    } else {
      setWrongSlot(slotIdx);
      setTimeout(() => setWrongSlot(null), 500);
    }
    setDraggedPiece(null);
  };

  // Touch support
  const touchPieceRef = useRef<number | null>(null);
  const touchGhostRef = useRef<HTMLDivElement | null>(null);

    const puzzleContent = content ?? {
    titleEn: 'Solve the Puzzle',
    titleBn: 'পাজল সমাধান করুন',
    introPrefixEn: 'Drag the pieces from the left and drop them into the correct slots on the right. Complete the image & win ',
    introPrefixBn: 'বাম দিক থেকে টুকরোগুলো টেনে ডান দিকে সঠিক জায়গায় ছাড়ুন। ছবিটি সম্পূর্ণ করুন এবং জিতে নিন ',
    introSuffixEn: ' off your first project!',
    introSuffixBn: ' ছাড় আপনার প্রথম প্রজেক্টে!',
    piecesLabelEn: 'Pieces',
    piecesLabelBn: 'টুকরো',
    boardLabelEn: 'Complete the image',
    boardLabelBn: 'ছবিটি সম্পূর্ণ করুন',
    howToPlayLabelEn: 'How to Play:',
    howToPlayLabelBn: 'কীভাবে খেলবেন:',
    instructionsEn: '1. Drag a piece from the left tray to a slot on the right board.\n2. Correct position locks the piece in. Wrong position bounces back.\n3. Place all 8 pieces correctly to win your bonus!\n4. Click "Shuffle" to restart.',
    instructionsBn: '১. বাম দিক থেকে একটি টুকরো টেনে ডান দিকের একটি ঘরে ছাড়ুন।\n২. সঠিক জায়গায় পড়লে লক হবে। ভুল হলে ফিরে আসবে।\n৩. সব ৮টি টুকরো সঠিকভাবে বসান এবং বোনাস আনলক করুন!\n৪. নতুন করে শুরু করতে "এলোমেলো করুন" বাটন ক্লিক করুন।',
    attemptsLabelEn: 'Attempts:',
    attemptsLabelBn: 'চেষ্টা:',
    shuffleLabelEn: 'Shuffle',
    shuffleLabelBn: 'এলোমেলো করুন',
    solvedTitleEn: 'You solved it!',
    solvedTitleBn: 'আপনি সমাধান করেছেন!',
    solvedDescEn: "Here's your exclusive bonus code. Use it when contacting us for your first project.",
    solvedDescBn: 'এই এক্সক্লুসিভ বোনাস কোডটি সংরক্ষণ করুন। আপনার প্রথম প্রজেক্টে যোগাযোগের সময় এটি ব্যবহার করুন।',
    copiedEn: '✓ Copied!',
    copiedBn: '✓ কপি হয়েছে!',
  };

  const hasCustomPieces = Array.isArray(pieceImages) && pieceImages.filter(Boolean).length === TOTAL_PIECES;

  const getPieceStyle = (pieceIdx: number, size: number) => {
    if (hasCustomPieces) {
      return {
        backgroundImage: `url(${pieceImages?.[pieceIdx]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    const col = pieceIdx % COLS;
    const row = Math.floor(pieceIdx / COLS);

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${COLS * size}px ${ROWS * size}px`,
      backgroundPosition: `-${col * size}px -${row * size}px`,
    };
  };

  const handleTouchStart = (e: React.TouchEvent, pieceIdx: number) => {
    e.preventDefault();
    touchPieceRef.current = pieceIdx;
    setDraggedPiece(pieceIdx);

    const touch = e.touches[0];
    const ghost = document.createElement('div');
    ghost.style.cssText = `position:fixed;z-index:99999;width:120px;height:120px;opacity:0.8;pointer-events:none;border-radius:4px;left:${touch.clientX - 60}px;top:${touch.clientY - 60}px;`;
    const ghostStyle = getPieceStyle(pieceIdx, 120);
    ghost.style.backgroundImage = ghostStyle.backgroundImage;
    ghost.style.backgroundSize = ghostStyle.backgroundSize ?? 'cover';
    ghost.style.backgroundPosition = ghostStyle.backgroundPosition ?? 'center';
    ghost.style.backgroundRepeat = 'no-repeat';
    document.body.appendChild(ghost);
    touchGhostRef.current = ghost;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touchGhostRef.current) {
      touchGhostRef.current.style.left = (touch.clientX - 60) + 'px';
      touchGhostRef.current.style.top = (touch.clientY - 60) + 'px';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchGhostRef.current) {
      touchGhostRef.current.remove();
      touchGhostRef.current = null;
    }
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = dropTarget?.closest('[data-slot-idx]');
    if (slot) {
      const slotIdx = parseInt(slot.getAttribute('data-slot-idx') || '');
      if (!isNaN(slotIdx)) handleDrop(slotIdx);
    }
    touchPieceRef.current = null;
    setDraggedPiece(null);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pieceW = 120;
  const pieceH = 120;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(10,20,50,0.97)] z-[5000] flex items-start md:items-center justify-center overflow-y-auto p-6 md:p-10">
      <button
        onClick={onClose}
        className="fixed top-6 right-8 text-primary-foreground/40 text-2xl hover:text-accent transition-colors z-[5001] bg-transparent border-none"
      >
        ✕
      </button>

      {!won ? (
        <div className="w-full max-w-[800px]" ref={containerRef}>
          <div className="text-center mb-6">
              <h2 className="font-heading text-3xl text-primary-foreground font-light mb-2">
                {t(puzzleContent.titleEn ?? 'Solve the Puzzle', puzzleContent.titleBn ?? 'পাজল সমাধান করুন')}
            </h2>
            <p className="text-[13px] text-primary-foreground/50 max-w-[600px] mx-auto leading-relaxed">
                {t(puzzleContent.introPrefixEn ?? 'Drag the pieces from the left and drop them into the correct slots on the right. Complete the image & win ', puzzleContent.introPrefixBn ?? 'বাম দিক থেকে টুকরোগুলো টেনে ডান দিকে সঠিক জায়গায় ছাড়ুন। ছবিটি সম্পূর্ণ করুন এবং জিতে নিন ')}
              <strong className="text-accent">{discountAmount} {t('BDT', 'টাকা')}</strong>
                {t(puzzleContent.introSuffixEn ?? ' off your first project!', puzzleContent.introSuffixBn ?? ' ছাড় আপনার প্রথম প্রজেক্টে!')}
            </p>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-10 items-center md:items-start justify-center">
            {/* Pieces tray */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] tracking-[2px] uppercase text-primary-foreground/35 mb-2">
                {t(puzzleContent.piecesLabelEn ?? 'Pieces', puzzleContent.piecesLabelBn ?? 'টুকরো')}
              </span>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
                {pieces.map((pieceIdx) => {
                  const isPlaced = Object.values(placedPieces).includes(pieceIdx);
                  return (
                    <div
                      key={pieceIdx}
                      draggable={!isPlaced}
                      onDragStart={() => setDraggedPiece(pieceIdx)}
                      onTouchStart={(e) => !isPlaced && handleTouchStart(e, pieceIdx)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className={`w-[75px] h-[75px] md:w-[120px] md:h-[120px] rounded border-2 transition-all duration-200 ${
                        isPlaced
                          ? 'opacity-30 pointer-events-none border-primary-foreground/5'
                          : 'cursor-grab border-primary-foreground/15 hover:scale-105 hover:shadow-[0_8px_24px_rgba(251,146,60,0.3)] hover:border-accent active:cursor-grabbing'
                      }`}
                      style={{ ...getPieceStyle(pieceIdx, 75), backgroundRepeat: 'no-repeat' }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Board */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] tracking-[2px] uppercase text-primary-foreground/35 mb-2">
                {t(puzzleContent.boardLabelEn ?? 'Complete the image', puzzleContent.boardLabelBn ?? 'ছবিটি সম্পূর্ণ করুন')}
              </span>
              <div
                className="grid gap-1 bg-primary-foreground/5 border-2 border-primary-foreground/10 rounded-md p-2"
                style={{ gridTemplateColumns: `repeat(${COLS}, 80px)`, gridTemplateRows: `repeat(${ROWS}, 80px)` }}
              >
                {Array.from({ length: TOTAL_PIECES }, (_, slotIdx) => {
                  const isFilled = placedPieces[slotIdx] !== undefined;
                  const col = slotIdx % COLS;
                  const row = Math.floor(slotIdx / COLS);
                  return (
                    <div
                      key={slotIdx}
                      data-slot-idx={slotIdx}
                      onDragOver={(e) => { e.preventDefault(); setHoverSlot(slotIdx); }}
                      onDragLeave={() => setHoverSlot(null)}
                      onDrop={() => handleDrop(slotIdx)}
                      className={`w-[80px] h-[80px] rounded flex items-center justify-center transition-all duration-300 ${
                        wrongSlot === slotIdx
                          ? 'border-2 border-destructive bg-destructive/10'
                          : hoverSlot === slotIdx
                          ? 'border-2 border-accent bg-accent/10'
                          : isFilled
                          ? 'border-2 border-accent/40'
                          : 'border-2 border-dashed border-primary-foreground/10'
                      }`}
                      style={wrongSlot === slotIdx ? { animation: 'wrongShake 0.4s' } : undefined}
                    >
                      {isFilled ? (
                        <div
                          className="w-full h-full rounded-sm"
                          style={{ ...getPieceStyle(slotIdx, 80), backgroundRepeat: 'no-repeat' }}
                        />
                      ) : (
                        <span className="font-heading text-2xl text-primary-foreground/5 font-light">
                          {slotIdx + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* How to play */}
          <div className="text-xs text-accent/70 tracking-wider leading-[1.8] max-w-[620px] mx-auto mt-4 px-4">
            <strong>💡 {t(puzzleContent.howToPlayLabelEn ?? 'How to Play:', puzzleContent.howToPlayLabelBn ?? 'কীভাবে খেলবেন:')}</strong><br />
            {t(puzzleContent.instructionsEn ?? '1. Drag a piece from the left tray to a slot on the right board.\n2. Correct position locks the piece in. Wrong position bounces back.\n3. Place all 8 pieces correctly to win your bonus!\n4. Click "Shuffle" to restart.', puzzleContent.instructionsBn ?? '১. বাম দিক থেকে একটি টুকরো টেনে ডান দিকের একটি ঘরে ছাড়ুন।\n২. সঠিক জায়গায় পড়লে লক হবে। ভুল হলে ফিরে আসবে।\n৩. সব ৮টি টুকরো সঠিকভাবে বসান এবং বোনাস আনলক করুন!\n৪. নতুন করে শুরু করতে "এলোমেলো করুন" বাটন ক্লিক করুন।').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
          </div>

          <div className="text-center mt-4 space-y-3">
            <p className="text-xs tracking-[2px] uppercase text-primary-foreground/40">
              {t(puzzleContent.attemptsLabelEn ?? 'Attempts:', puzzleContent.attemptsLabelBn ?? 'চেষ্টা:')} {moves}
            </p>
            <button
              onClick={shuffle}
              className="px-7 py-2.5 bg-transparent border border-primary-foreground/20 text-primary-foreground/60 text-[11px] tracking-[2px] uppercase rounded-sm transition-all duration-300 hover:border-accent hover:text-accent"
            >
              {t(puzzleContent.shuffleLabelEn ?? 'Shuffle', puzzleContent.shuffleLabelBn ?? 'এলোমেলো করুন')}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-5xl mb-4" style={{ animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
            🎉
          </div>
          <h3 className="font-heading text-3xl text-primary-foreground font-light mb-2">
            {t(puzzleContent.solvedTitleEn ?? 'You solved it!', puzzleContent.solvedTitleBn ?? 'আপনি সমাধান করেছেন!')}
          </h3>
          <p className="text-sm text-primary-foreground/60 mb-5 leading-relaxed">
            {t(puzzleContent.solvedDescEn ?? "Here's your exclusive bonus code. Use it when contacting us for your first project.", puzzleContent.solvedDescBn ?? 'এই এক্সক্লুসিভ বোনাস কোডটি সংরক্ষণ করুন। আপনার প্রথম প্রজেক্টে যোগাযোগের সময় এটি ব্যবহার করুন।')}
          </p>
          <button
            onClick={copyCode}
            className="inline-block px-8 py-4 bg-accent/10 border-2 border-dashed border-accent rounded font-heading text-2xl font-medium text-accent tracking-[4px] mb-5 cursor-pointer transition-colors hover:bg-accent/20"
          >
              {copied ? t(puzzleContent.copiedEn ?? '✓ Copied!', puzzleContent.copiedBn ?? '✓ কপি হয়েছে!') : discountCode}
          </button>
          <p className="text-[11px] tracking-[2px] uppercase text-primary-foreground/30">
            {t('📋 Click to copy', '📋 ক্লিক করে কপি করুন')}
          </p>
        </div>
      )}
    </div>
  );
}
