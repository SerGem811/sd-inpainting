import { useMemo } from 'react'
import { ButtonVariants, ButtonSizes } from '@/utils/styles'

const Button = ({
  variant = 'primary',
  rounded = 'md',
  disabled = false,
  blocked = false,
  size = 'md',
  onClick = () => {},
  children
}) => {
  const variantClass = useMemo(() => {
    if (ButtonVariants) {
      return ButtonVariants.find(c => c.variant === variant)?.class
    }
    return ''
  }, [variant, ButtonVariants])

  const sizeClass = useMemo(() => {
    if (ButtonSizes) {
      return ButtonSizes.find(c => c.size === size)?.class
    }
    return ''
  }, [size, ButtonSizes])

  const displayMode = useMemo(
    () => (blocked ? 'w-full inline-block' : 'inline-block'),
    [blocked]
  )

  const handleClick = () => {
    if (disabled) return
    onClick()
  }
  return (
    <button
      type="button"
      className={`${variantClass} ${sizeClass} ${displayMode} rounded-${rounded} hover:opacity-75 duration-300`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default Button
