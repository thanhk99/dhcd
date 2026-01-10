'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
    onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanFailure, onClose }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isPermissionsGranted, setIsPermissionsGranted] = useState(false);
    const [cameras, setCameras] = useState<any[]>([]);
    const [activeCameraId, setActiveCameraId] = useState<string | object | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        // Initialize logic
        const initScanner = async () => {
            try {
                // Request camera permissions first to get list of cameras
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length) {
                    setCameras(devices);
                    // Prefer back camera (environment) if available, or just the last one
                    // Usually the last one in the list is the back camera on mobile
                    const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
                    const cameraId = backCamera ? backCamera.id : devices[devices.length - 1].id;

                    setActiveCameraId(cameraId);
                    setIsPermissionsGranted(true);
                } else {
                    // Fallback if no cameras found by enumeration (rare but possible)
                    console.warn("No cameras found via enumeration, trying default facing mode.");
                    setActiveCameraId({ facingMode: "environment" });
                    setIsPermissionsGranted(true);
                }
            } catch (err) {
                console.error("Camera permission or enumeration error:", err);
                // On HTTP, getCameras usually throws. We try to fallback to direct start.
                console.warn("Trying fallback to direct start (environment mode).");
                setActiveCameraId({ facingMode: "environment" });
                setIsPermissionsGranted(false); // We don't know yet
            }
        };

        initScanner();

        return () => {
            // Cleanup on unmount
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().then(() => {
                        scannerRef.current?.clear();
                    }).catch(err => console.error("Failed to stop scanner", err));
                } else {
                    scannerRef.current.clear();
                }
            }
        };
    }, []);

    // Start scanning when camera ID is set
    useEffect(() => {
        if (!activeCameraId) return;

        const startScanning = async () => {
            // Create instance if not exists
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("reader", {
                    verbose: false,
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
                });
            }

            try {
                // Determine qr box size based on window width
                const size = Math.min(window.innerWidth - 64, 300);

                await scannerRef.current.start(
                    activeCameraId as any, // Cast to any to satisfy TS (library accepts config object)
                    {
                        fps: 10,
                        qrbox: { width: size, height: size },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        // Success callback
                        if (scannerRef.current?.isScanning) {
                            scannerRef.current.stop().then(() => {
                                onScanSuccess(decodedText);
                            }).catch(e => console.error(e));
                        } else {
                            onScanSuccess(decodedText);
                        }
                    },
                    (errorMessage) => {
                        // Failure callback (called for every frame failed to decode)
                        if (onScanFailure) onScanFailure(errorMessage);
                    }
                );
            } catch (err) {
                console.error("Error starting scanner:", err);
                const isHttp = window.location.protocol === 'http:' && window.location.hostname !== 'localhost';
                if (isHttp) {
                    setErrorMsg("Camera không hoạt động trên HTTP. Vui lòng sử dụng HTTPS hoặc Localhost.");
                } else {
                    setErrorMsg("Không thể khởi động máy ảnh. Vui lòng cấp quyền truy cập.");
                }
            }
        };

        // Add a small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            startScanning();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [activeCameraId]);

    const handleSwitchCamera = () => {
        if (cameras.length <= 1 || !scannerRef.current) return;

        // Find next camera index
        const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        const nextCameraId = cameras[nextIndex].id;

        // Stop current scan and restart with new ID
        scannerRef.current.stop().then(() => {
            setActiveCameraId(nextCameraId);
        }).catch(err => {
            console.error("Failed to stop for switch", err);
            // Force update ID anyway
            setActiveCameraId(nextCameraId);
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0f1115] shadow-2xl border border-white/10 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#16191f]">
                    <div className="flex items-center gap-2 text-white font-medium">
                        <Camera size={20} className="text-blue-500" />
                        <span>Trình quét QR</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="relative aspect-square w-full bg-black flex flex-col items-center justify-center overflow-hidden group">
                    <div id="reader" className="w-full h-full object-cover"></div>

                    {/* Error State */}
                    {errorMsg && (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-20 bg-black/80">
                            <p className="text-red-400 font-medium">{errorMsg}</p>
                        </div>
                    )}

                    {/* Custom Overlay / Scan Frame */}
                    {!errorMsg && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
                            <div className="relative w-[70%] h-[70%] border-2 border-transparent">
                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

                                {/* Scanning Line Animation */}
                                <div className="absolute left-0 w-full h-0.5 bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-scan"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Controls */}
                <div className="p-5 bg-[#16191f] text-center border-t border-white/5">
                    <p className="text-sm text-gray-400 mb-4">
                        Di chuyển camera đến vùng mã QR để tự động quét
                    </p>

                    {cameras.length > 1 && (
                        <Button
                            variant="secondary"
                            className="bg-white/5 hover:bg-white/10"
                            onClick={handleSwitchCamera}
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Đổi camera
                        </Button>
                    )}
                </div>
            </div>

            {/* Global styles for this component to customize the video element if needed */}
            <style jsx global>{`
                #reader, #reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    );
};
