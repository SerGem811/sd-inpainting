import { useState } from 'react'
import Dropzone from '@/components/Dropzone'
import { Range, getTrackBackground } from 'react-range'
import Loader from './Loader'

const PropertyBox = ({ onImageDrop, onGenerate, isGenerating = false }) => {
  const [prompt, setPrompt] = useState('')
  const [negative, setNegative] = useState('')
  const [guidanceScale, setGuidanceScale] = useState([7.5])
  const [steps, setSteps] = useState([30])
  const [error, setError] = useState(null)

  const handleGenerate = () => {
    if (!prompt) {
      setError({
        prompt: `Prompt is required!`
      })
      return
    }
    onGenerate({
      prompt,
      negative,
      guidance_scale: guidanceScale[0],
      steps: steps[0]
    })
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 border-1 border-gray-500 bg-slate-300">
      <Dropzone onImageDrop={onImageDrop} />
      <div className="flex flex-col gap-1">
        <p className="text-gray-500">Prompt</p>
        <textarea
          className={`w-full px-4 py-1 rounded-md border-[1px] bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus-visible:outline-none`}
          value={prompt}
          placeholder={`Your prompt here...`}
          onChange={e => {
            setError(null)
            setPrompt(e.target.value)
          }}
        />
        {error?.prompt && (
          <p className="text-red-500 text-sm">{error.prompt}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-500">Negative</p>
        <textarea
          className={`w-full px-4 py-1 rounded-md border-[1px] bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus-visible:outline-none`}
          value={negative}
          placeholder={`Your negative here...`}
          onChange={e => setNegative(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span>Guidance scale</span>
          <span>{guidanceScale[0]}</span>
        </div>
        <Range
          step={0.5}
          min={1}
          max={30}
          values={guidanceScale}
          onChange={v => setGuidanceScale(v)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '3px',
                width: '100%',
                borderRadius: '10px',
                background: getTrackBackground({
                  values: guidanceScale,
                  min: 1,
                  max: 30,
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
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span>Inference steps</span>
          <span>{steps[0]}</span>
        </div>
        <Range
          step={1}
          min={1}
          max={50}
          values={steps}
          onChange={v => setSteps(v)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '3px',
                width: '100%',
                borderRadius: '10px',
                background: getTrackBackground({
                  values: steps,
                  min: 1,
                  max: 50,
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
      <button
        type="button"
        className={`bg-blue-600 hover:bg-blue-700 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-100 px-4 py-2 text-md w-full inline-block rounded-md hover:opacity-75 duration-300 mt-2`}
        disabled={isGenerating}
        onClick={() => handleGenerate()}
      >
        <span className="flex items-center justify-center gap-1">
          {isGenerating ? 'Generating...' : 'Generate'}
        </span>
      </button>
    </div>
  )
}

export default PropertyBox
