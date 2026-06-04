import { useRef, useState } from 'react';

const SignaturePad = ({ onChange }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches?.[0];
    const clientX = touch ? touch.clientX : event.clientX;
    const clientY = touch ? touch.clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const start = (event) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const point = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext('2d');
    const point = getPoint(event);

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2f49';
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    onChange(canvasRef.current.toDataURL('image/png'));
  };

  const stop = () => {
    if (!drawing) return;
    setDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    onChange(canvasRef.current.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={560}
        height={180}
        className="customer-signature-canvas"
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
      />
      <button type="button" className="customer-secondary-btn" onClick={clear}>
        Clear Signature
      </button>
    </div>
  );
};

export default SignaturePad;
