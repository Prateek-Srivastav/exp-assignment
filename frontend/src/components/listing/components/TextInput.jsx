export const TextInput = ({ title, type, setInput, value }) => {
  return (
    <div className="w-full mb-3">
      <h3>{title}</h3>
      <input
        type={type ? type : "text"}
        className="w-full bg-teal-100 text-green-800 p-2 outline-none rounded"
        onChange={(e) => setInput(e.target.value)}
        value={value}
      />
    </div>
  );
};
