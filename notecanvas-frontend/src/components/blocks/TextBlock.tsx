export default function TextBlock() {
  return (
    <div className="p-4 border rounded mb-4 bg-white shadow">
      <textarea
        placeholder="Write something..."
        className="w-full h-32 resize-none focus:outline-none bg-transparent"
      />
    </div>
  );
}