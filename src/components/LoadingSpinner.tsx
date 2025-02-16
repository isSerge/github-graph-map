const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2 min-h-60">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-600 text-lg">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;