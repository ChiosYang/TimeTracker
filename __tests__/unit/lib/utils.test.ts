import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn - className utility', () => {
    it('should merge class names', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toBe('text-red-500 bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('should filter out falsy values', () => {
      const result = cn('class1', null, undefined, false, '', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should merge Tailwind classes correctly', () => {
      // tailwind-merge should resolve conflicts
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('py-1 px-4')
    })

    it('should handle objects with boolean values', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'font-bold': true
      })
      expect(result).toBe('text-red-500 font-bold')
    })

    it('should return empty string for no arguments', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle complex nested structures', () => {
      const result = cn(
        'base',
        ['array1', 'array2'],
        {
          'object-true': true,
          'object-false': false
        },
        null,
        undefined,
        'final'
      )
      expect(result).toBe('base array1 array2 object-true final')
    })
  })
})