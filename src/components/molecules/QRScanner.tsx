import React, { useRef, useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../atoms/button';

type Props = {
  setScannedQRData: React.Dispatch<React.SetStateAction<string | null>>;
};

const QRScanner = ({ setScannedQRData }: Props) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Start scanner after the scanner div is mounted
  useEffect(() => {
    if (scanning && scannerRef.current) {
      const scannerId = scannerRef.current.id;

      const html5QrCode = new Html5Qrcode(scannerId, {
        verbose: false,
      });

      html5QrCodeRef.current = html5QrCode;

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            html5QrCode
              .start(
                { facingMode: 'environment' },
                {
                  fps: 15,
                  qrbox: { width: 300, height: 300 },
                  disableFlip: false,
                  aspectRatio: 1.0,
                },
                (decodedText) => {
                  if (decodedText !== result) {
                    setResult(decodedText);
                    setScannedQRData(decodedText);
                  }

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
                  }, 500);
                },
                (errorMessage) => {
                  // Optional: console.log('Scan error', errorMessage);
                }
              )
              .catch((err) => {
                console.error('Start failed:', err);
                setScanning(false);
              });
          } else {
            alert('No camera found');
            setScanning(false);
          }
        })
        .catch((err) => {
          console.error('Camera access error:', err);
          alert('Failed to access camera');
          setScanning(false);
        });
    }

    // Cleanup on unmount or scanning stopped
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => html5QrCodeRef.current?.clear())
          .catch(() => {});
      }
    };
  }, [scanning]);

  return (
    <div>
      <Button
        className="bg-blue-500 hover:bg-blue-400"
        onClick={() => {
          if (!scanning) {
            setResult(null);
            setScanning(true);
          }
        }}
      >
        {scanning ? 'Scanning...' : 'Scan QR Code'}
      </Button>

      {scanning && (
        <div
          id="reader"
          ref={scannerRef}
          style={{ width: '320px', height: '320px', marginTop: '20px' }}
        ></div>
      )}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <strong>Scanned QR: Fetched Successfully</strong>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
