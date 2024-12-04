import React from "react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      {/* Spinning loader */}
      <div className="w-12 h-12 border-4 border-[#FFD12E] border-t-transparent rounded-full animate-spin"></div>

      {/* Loading text */}
      <h3 className="text-center text-xl font-proxima font-medium">
        Подождите, идет загрузка данных...
      </h3>
    </div>
  )
}