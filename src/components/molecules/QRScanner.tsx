// components/QRScanner.tsx
'use client';

import React, { SetStateAction, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../atoms/button';

type Props = {
    setScannedQRData:React.Dispatch<React.SetStateAction<string | null>>
}

const QRScanner = ({setScannedQRData}:Props) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    if (!scanning && scannerRef.current) {
      const html5QrCode = new Html5Qrcode(scannerRef.current.id);

      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setScanning(true);

          html5QrCode.start(
            { facingMode: 'environment' }, // use back camera
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText, decodedResult) => {
              setResult(decodedText);
              setScannedQRData(decodedText);
              html5QrCode.stop();
              setScanning(false);
            },
            (errorMessage) => {
              // console.log(`QR Code no match: ${errorMessage}`);
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
      <Button className='bg-blue-500 hover:bg-blue-400' onClick={startScanner}>
        {scanning ? 'Scanning...' : 'Scan QR Code'}
      </Button>

      <div id="reader" ref={scannerRef} style={{ width: '300px', marginTop: '20px' }}></div>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <strong>Scanned QR:{result?"Fetched Successfully":"Data Fetching Failed"}</strong>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
