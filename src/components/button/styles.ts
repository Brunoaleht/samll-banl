export function getButtonClasses(
  variant: 'primary' | 'secondary' | 'danger',
  className?: string
): string {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all cursor-pointer border-none text-base disabled:bg-gray-400 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();
}

