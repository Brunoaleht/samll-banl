export function getContainerClasses(): string {
  return "flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4";
}

export function getCardClasses(): string {
  return "w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl";
}

export function getTitleClasses(): string {
  return "text-3xl font-bold text-gray-900 text-center m-0 mb-2";
}

export function getSubtitleClasses(): string {
  return "text-base text-gray-500 text-center m-0 mb-8";
}

export function getFormClasses(): string {
  return "flex flex-col gap-6";
}

export function getErrorMessageClasses(): string {
  return "p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center";
}
