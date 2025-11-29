export function getInputWrapperClasses(className?: string): string {
  return `flex flex-col gap-2 w-full ${className || ''}`.trim();
}

export function getLabelClasses(): string {
  return 'text-sm font-medium text-gray-700';
}

export function getInputClasses(hasError: boolean): string {
  const baseClasses = 'px-3 py-3 rounded-lg border text-base transition-colors focus:outline-none focus:ring-3 disabled:bg-gray-100 disabled:cursor-not-allowed';
  const errorClasses = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100';
  return `${baseClasses} ${errorClasses}`;
}

export function getErrorMessageClasses(): string {
  return 'text-sm text-red-500';
}

