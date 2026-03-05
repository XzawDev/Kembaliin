import React, { useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import OfficerLayout from '@/layouts/OfficerLayout'; // use OfficerLayout
import { BrowserQRCodeReader } from '@zxing/browser';

export default function VerifyQr() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReader = useRef(new BrowserQRCodeReader());
    const controlsRef = useRef<any>(null);

    const startScan = async () => {
        setScanning(true);
        try {
            const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
            const selectedDeviceId = videoInputDevices[0].deviceId;

            const controls = await codeReader.current.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current!,
                (result, error) => {
                    if (result) {
                        const text = result.getText();
                        setResult(text);
                        controls.stop();
                        setScanning(false);

                        // Extract token from URL (assuming URL ends with the token)
                        const token = text.split('/').pop();
                        if (token) {
                            // Navigate to token lookup route (will redirect to detail page)
                            router.get(`/officer/items/by-token/${token}`);
                        }
                    }
                    if (error) {
                        // Ignore scanning errors
                    }
                }
            );
            controlsRef.current = controls;
        } catch (err) {
            console.error(err);
            setScanning(false);
            alert('Could not access camera');
        }
    };

    const stopScan = () => {
        if (controlsRef.current) {
            controlsRef.current.stop();
        }
        setScanning(false);
    };

    return (
        <OfficerLayout>
            <Head title="Scan QR Code" />
            <div className="max-w-2xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Scan QR Code</h1>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    {!scanning ? (
                        <button
                            onClick={startScan}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
                        >
                            Start Camera
                        </button>
                    ) : (
                        <div>
                            <video ref={videoRef} className="w-full rounded-lg border" />
                            <button
                                onClick={stopScan}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Stop
                            </button>
                        </div>
                    )}
                    {result && <p className="mt-4 text-sm text-slate-600">Scanned: {result}</p>}
                </div>
            </div>
        </OfficerLayout>
    );
}