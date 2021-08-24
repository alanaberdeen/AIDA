import { useState } from 'react'

import { ChevronLeftIcon, XIcon } from '@heroicons/react/solid'

// Settings sidebar
// Generally for 'global' settings (ones which adjust the entire view and/or all
// annotation items within the view). Layers and channels are other examples
// of 'global' settings.
const SettingSidebar = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Open and close button */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={`hover:bg-gray-100 ${
          isOpen ? 'w-48 flex justify-between ' : ''
        } bg-gray-50 h-8 absolute top-0 right-0 inline-flex items-center p-2 border border-transparent shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {!isOpen && (
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        )}
        <span className={`${isOpen ? 'font-medium' : ''}`}>
          Settings
        </span>
        {isOpen && <XIcon className="h-4 w-4" aria-hidden="true" />}
      </button>

      {/* Content */}
      {isOpen &&
        <div className="bg-gray-50 mt-8 min-h-full w-48 p-2 shadow-sm text-gray-800">
          Content
        </div>
      }
    </>
  )
}

export default SettingSidebar
