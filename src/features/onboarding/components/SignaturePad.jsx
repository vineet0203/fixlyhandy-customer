// features/onboarding/components/SignaturePad.jsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';

/**
 * A simple canvas-based signature pad.
 * Returns a PNG data URL via onChange when the user finishes drawing.
 */
const SignaturePad = ({ label = 'Signature', onChange, width = 400, height = 150, disabled = false }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const startDraw = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, [disabled, getCoords]);

  const draw = useCallback((e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [isDrawing, disabled, getCoords]);

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSignature(true);
    if (onChange && canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'));
    }
  }, [isDrawing, onChange]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    if (onChange) onChange(null);
  }, [onChange]);

  // Setup canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
        {label}
      </Typography>
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 1,
          overflow: 'hidden',
          width: '100%',
          maxWidth: width,
          cursor: disabled ? 'not-allowed' : 'crosshair',
          touchAction: 'none',
          bgcolor: disabled ? '#f5f5f5' : '#fff',
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ display: 'block', width: '100%', height: 'auto' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
        <Button size="small" onClick={clear} disabled={!hasSignature || disabled}>
          Clear
        </Button>
      </Stack>
    </Box>
  );
};

export default SignaturePad;
