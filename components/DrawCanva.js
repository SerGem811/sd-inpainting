import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import Loader from './Loader'

const DrawCanva = ({
  imageUrl,
  width,
  height,
  onDraw,
  isGenerating = true
}) => {
  const [brush, setBrush] = useState([40])

  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef?.current) {
      handleClear()
    }
  }, [imageUrl])

  const handleDraw = async () => {
    const paths = await canvasRef.current.exportPaths()

    if (paths?.length) {
      const data = await canvasRef.current.exportImage('svg')
      onDraw(data)
    } else {
      onDraw(null)
    }
  }

  const handleRedo = () => {
    if (isGenerating) return
    canvasRef.current.redo()
  }

  const handleUndo = () => {
    if (isGenerating) return
    canvasRef.current.undo()
  }

  const handleClear = () => {
    if (isGenerating) return
    canvasRef.current.clearCanvas()
    canvasRef.current.resetCanvas()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="min-w-[400px] min-h-[400px] max-w-[512px] max-h-[512px] max-w-full max-h-full border-2 border-gray-300 relative">
        {imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt="preview image"
              width={width}
              height={height}
            />
            <div className="absolute top-0 left-0 w-full h-full cursor-crosshair opacity-50">
              <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={brush[0]}
                strokeColor={'white'}
                canvasColor="black"
                onChange={handleDraw}
              />
            </div>
          </>
        )}
        {isGenerating && (
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10 flex items-center justify-center text-white">
            <Loader />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span>Brush stroke: {brush[0]}</span>
          <div className="flex items-center gap-1">
            <span
              className="bg-gray-300 px-2 py-1 hover:opacity-50 cursor-pointer"
              onClick={handleRedo}
            >
              Redo
            </span>
            <span
              className="bg-gray-300 px-2 py-1 hover:opacity-50 cursor-pointer"
              onClick={handleUndo}
            >
              Undo
            </span>
            <span
              className="bg-gray-300 px-2 py-1 hover:opacity-50 cursor-pointer"
              onClick={handleClear}
            >
              Clear
            </span>
          </div>
        </div>
        <Range
          step={1}
          min={5}
          max={100}
          values={brush}
          onChange={v => setBrush(v)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '3px',
                width: '100%',
                borderRadius: '10px',
                background: getTrackBackground({
                  values: brush,
                  min: 5,
                  max: 100,
                  colors: ['#513bf6', '#ccc']
                })
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '16px',
                width: '16px',
                borderRadius: '100%',
                backgroundColor: '#513bf6'
              }}
            />
          )}
        />
      </div>
    </div>
  )
}

export default DrawCanva
