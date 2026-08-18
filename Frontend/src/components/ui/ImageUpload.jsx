import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  X,
  RefreshCw,
  Check,
} from "lucide-react";
import compressImage from "../../lib/compressImage";

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && /iPad|Macintosh/.test(ua))
  );
};

export default function ImageUpload({
  label,
  preview,
  onFileSelect,
  disabled = false,
  rounded = "rounded-3xl",
  className = "",
  triggerClassName = "",
  previewClassName = "",
  emptyClassName = "min-h-[180px]",
  icon: Icon = ImageIcon,
  uploadText = "Choose Photo",
  changeText = "Change Photo",
  helperText = "Choose from Gallery / Files or take a new photo",
  showHelperText = true,
  buttonStyle = "default",
  cameraFacing = "environment",
}) {
  const [open, setOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleSelect = async (file) => {
    if (!file) return;
    // Resize/compress high-res photos (camera + gallery) before upload to cut
    // payload size and server processing time.
    const optimized =
      file.type && file.type.startsWith("image/")
        ? await compressImage(file).catch(() => file)
        : file;
    onFileSelect(optimized);
    setOpen(false);
    setShowCamera(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const openPicker = () => {
    if (disabled) return;
    setOpen(true);
  };

  const handleGalleryClick = () => {
    setOpen(false);
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    setOpen(false);
    if (isMobileDevice()) {
      cameraInputRef.current?.click();
    } else {
      setShowCamera(true);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label ? (
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <div
          className={`relative overflow-hidden border-2 border-dashed transition-all ${
            preview ? "border-gold/50" : "border-white/10 hover:border-gold/30"
          } ${rounded} ${triggerClassName}`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              openPicker();
            }
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt={label || "Upload preview"}
              className={`w-full h-full object-cover ${previewClassName}`}
            />
          ) : (
            <div
              className={`h-full w-full flex flex-col items-center justify-center gap-3 bg-white/5 text-center px-6 ${emptyClassName}`}
            >
              <Icon size={42} className="text-white/15" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                {disabled ? "Upload disabled" : uploadText}
              </p>
              {showHelperText ? (
                <p className="text-[9px] text-white/20 max-w-[180px] leading-relaxed">
                  {helperText}
                </p>
              ) : null}
            </div>
          )}

          {!disabled && preview ? (
            <div className="absolute inset-0 bg-black/35 opacity-0 hover:opacity-100 transition-all flex items-end justify-end p-3">
              <span className="inline-flex items-center gap-2 bg-black/60 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl">
                <Camera size={14} /> {changeText}
              </span>
            </div>
          ) : null}
        </div>

        {open && !disabled ? (
          <div className="absolute z-30 mt-3 w-full rounded-3xl border border-white/10 bg-[#08111f] shadow-2xl overflow-hidden">
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-semibold hover:bg-white/5 transition-colors ${
                buttonStyle === "gold" ? "text-gold" : "text-white"
              }`}
              onClick={handleGalleryClick}
            >
              <ImageIcon size={18} />
              Choose from Gallery / Files
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-semibold text-white hover:bg-white/5 transition-colors border-t border-white/5"
              onClick={handleCameraClick}
            >
              <Camera size={18} />
              Take Photo with Camera
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-white/45 hover:bg-white/5 transition-colors border-t border-white/5"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
              Close
            </button>
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleSelect(e.target.files?.[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture={cameraFacing}
          className="hidden"
          onChange={(e) => handleSelect(e.target.files?.[0])}
        />
      </div>

      {showCamera && !disabled ? (
        <WebcamCapture
          facingMode={cameraFacing}
          onCapture={handleSelect}
          onClose={() => setShowCamera(false)}
          onFallback={() => cameraInputRef.current?.click()}
        />
      ) : null}
    </div>
  );
}

function WebcamCapture({
  facingMode = "environment",
  onCapture,
  onClose,
  onFallback,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(true);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      setStarting(true);
      setError("");
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Your browser does not support camera access.");
        setStarting(false);
        return;
      }

      const attempts = [{ video: { facingMode } }, { video: true }];
      let stream = null;
      for (const constraints of attempts) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (e) {
          stream = null;
        }
      }

      if (cancelled) {
        stream?.getTracks().forEach((track) => track.stop());
        return;
      }

      if (!stream) {
        setError(
          "Unable to access the camera. Allow camera permission or use the file picker instead."
        );
        setStarting(false);
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
          /* play() can be interrupted; ignore */
        }
      }
      setStarting(false);
    };

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [facingMode, stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        if (capturedUrl) URL.revokeObjectURL(capturedUrl);
        setCapturedBlob(blob);
        setCapturedUrl(URL.createObjectURL(blob));
      },
      "image/png",
      0.95
    );
  };

  const handleRetake = () => {
    setCapturedBlob(null);
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl(null);
  };

  const handleConfirm = () => {
    if (capturedBlob) {
      const file = new File([capturedBlob], `camera-${Date.now()}.png`, {
        type: "image/png",
      });
      onCapture(file);
    }
  };

  const handleClose = () => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    stopStream();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#08111f] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
            <Camera size={16} /> Take Photo with Camera
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Close camera"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative bg-black aspect-[4/3]">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-white/60 text-xs leading-relaxed">{error}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onFallback}
                  className="btn-gold px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest"
                >
                  Open File Picker
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : capturedUrl ? (
            <img
              src={capturedUrl}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
              {starting ? (
                <div className="absolute inset-0 flex items-center justify-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Starting camera...
                </div>
              ) : null}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex items-center justify-center gap-4 p-5">
          {capturedUrl ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                <RefreshCw size={14} /> Retake
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-black text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition-all"
              >
                <Check size={14} /> Use Photo
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCapture}
              disabled={starting || !!error}
              className="w-16 h-16 rounded-full border-4 border-gold/60 bg-gold/20 flex items-center justify-center hover:bg-gold/30 transition-all disabled:opacity-40"
              aria-label="Capture photo"
            >
              <span className="w-11 h-11 rounded-full bg-gold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
