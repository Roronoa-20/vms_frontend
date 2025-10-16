'use client';

import React, { useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Button } from '../atoms/button';

type Props = {
  setScannedQRData: React.Dispatch<React.SetStateAction<string | null>>;
};

const QRScanner = ({ setScannedQRData }: Props) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    if (!scanning && scannerRef.current) {
      const scannerId = scannerRef.current.id;

      const html5QrCode = new Html5Qrcode(scannerId, {
        verbose: false, // Set to true if debugging is needed
      });

      html5QrCodeRef.current = html5QrCode;

      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setScanning(true);

          html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 15, // Higher FPS for more attempts per second
              qrbox: { width: 300, height: 300 }, // Increase QR box size
              disableFlip: false,
              aspectRatio: 1.0,
            },
            (decodedText, decodedResult) => {
              if (decodedText !== result) {
                setResult(decodedText);
                setScannedQRData(decodedText);
              }

              // Gracefully stop scanner after a brief delay
              setTimeout(() => {
                html5QrCode
                  .stop()
                  .then(() => {
                    html5QrCode.clear();
                    setScanning(false);
                  })
                  .catch((err) => {
                    console.error('Stop failed:', err);
                  });
              }, 500); // Slight delay ensures better accuracy
            },
            (errorMessage) => {
              // Optional: Log scan attempts
              // console.log(`Scan attempt failed: ${errorMessage}`);
            }
          );
        } else {
          alert('No camera found');
        }
      } catch (err) {
        console.error('Camera start error:', err);
        alert('Failed to access camera');
      }
    }
  };

  return (
    <div>
      <Button className="bg-blue-500 hover:bg-blue-400" onClick={startScanner}>
        {scanning ? 'Scanning...' : 'Scan QR Code'}
      </Button>

      <div
        id="reader"
        ref={scannerRef}
        style={{ width: '320px', height: '320px', marginTop: '20px' }}
      ></div>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <strong>Scanned QR: {result ? 'Fetched Successfully' : 'Data Fetching Failed'}</strong>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
