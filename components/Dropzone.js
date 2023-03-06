import { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'

const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 10,
  outline: 'none',
  cursor: 'pointer',
  transition: 'border .24s ease-in-out'
}

const focusedStyle = {
  borderColor: '#2196f3'
}

const acceptStyle = {
  borderColor: '#00e676'
}

const rejectStyle = {
  borderColor: '#ff1744'
}

const Dropzone = ({ onImageDrop }) => {
  const onDrop = useCallback(acceptedFiles => {
    onImageDrop(acceptedFiles[0])
  })

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop })

  const style = useMemo(
    () => ({
      ...baseStyle,
      padding: '20px',
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  )

  return (
    <div
      className="w-full border-2 border-dashed bg-slate-200 border-slate-300 hover:border-blue-600 dark:bg-slate-800 dark:border-slate-600 dark:hover:border-blue-600 cursor-pointer"
      {...getRootProps({ style })}
    >
      <input {...getInputProps()} />
      <p className="text-center">Drop the image here...</p>
    </div>
  )
}

export default Dropzone
