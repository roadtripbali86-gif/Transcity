import React, { useState, useRef, useEffect } from 'react';
import { CustomBanner } from '../hooks/useCustomBanners';

interface BannerSettingsModalProps {
  banners: (CustomBanner | null)[];
  onClose: () => void;
  onSave: (banners: (CustomBanner | null)[]) => Promise<void>;
}

const BannerSettingsModal: React.FC<BannerSettingsModalProps> = ({
  banners,
  onClose,
  onSave
}) => {
  const [draftBanners, setDraftBanners] = useState<(CustomBanner | null)[]>(Array(7).fill(null));
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeIndexRef = useRef<number | null>(null);

  useEffect(() => {
    setDraftBanners([...banners]);
  }, [banners]);

  const handleFileClick = (index: number) => {
    activeIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = activeIndexRef.current;
    if (file && index !== null && index >= 0 && index < 7) {
      const newBanner: CustomBanner = {
        id: index.toString(),
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        file
      };
      
      setDraftBanners(prev => {
        const next = [...prev];
        next[index] = newBanner;
        return next;
      });
    }
    activeIndexRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    setDraftBanners(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(draftBanners);
      onClose();
    } catch (error) {
      console.error("Error saving banners:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1877F2] p-6 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-white font-black text-lg uppercase tracking-tight">Pengaturan Banner</h3>
            <p className="text-blue-100 text-[10px] uppercase tracking-widest font-bold mt-1">Kelola 7 Slot Foto & Video Beranda</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Hidden Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime" 
          className="hidden" 
        />

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50">
          {draftBanners.map((banner, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm">
              {/* Preview */}
              <div className="w-full sm:w-40 h-32 bg-slate-100 relative flex items-center justify-center">
                {banner ? (
                  banner.type === 'video' ? (
                    <video src={banner.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={banner.url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="text-slate-300 flex flex-col items-center">
                    <i className="fa-solid fa-image text-3xl mb-1"></i>
                    <span className="text-[8px] font-black uppercase tracking-widest">Kosong</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                  Slide {index + 1}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex-1 flex flex-col justify-center gap-2">
                {banner ? (
                  <>
                    <button 
                      onClick={() => handleFileClick(index)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-rotate"></i> Ganti
                    </button>
                    <button 
                      onClick={() => handleRemove(index)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-trash"></i> Hapus
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleFileClick(index)}
                    className="w-full h-full min-h-[60px] bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-dashed border-[#1877F2]/30 font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-upload"></i> Upload Gambar/Video
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full bg-[#1877F2] hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-colors shadow-xl shadow-[#1877F2]/20 active:scale-[0.98] flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <><i className="fa-solid fa-spinner animate-spin"></i> Menyimpan...</>
            ) : (
              'Simpan & Terapkan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerSettingsModal;
