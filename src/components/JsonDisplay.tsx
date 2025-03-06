
type JsonDisplayProps = {
  title?: string;
  data: unknown;
};

const JsonDisplay: React.FC<JsonDisplayProps> = ({ title, data }) => {
  return (
    <div className="mt-4">
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      <pre
        className="p-4 bg-gray-800 border rounded overflow-x-auto text-sm leading-relaxed text-green-300"
        style={{
          maxHeight: "500px",
          fontFamily: "Courier New, monospace",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default JsonDisplay;