function Loader() {
  return (
    <div className='flex w-full items-center justify-center py-16'>
      <div className='flex flex-col items-center gap-4'>
        {/* spinner */}
        <div className='h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600'></div>

        {/* text */}
        <p className='text-sm font-medium text-gray-500'>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
