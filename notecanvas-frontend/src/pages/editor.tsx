export default function EditorPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">NoteCanvas</h1>
        <button className="text-sm text-gray-500 hover:underline">Logout</button>
      </header>

      <div className="flex flex-1">

        <aside className="w-64 bg-gray-100 p-4 border-r">
          <p className="text-gray-600">Sidebar content (notes, folders)</p>
        </aside>

        <main className="flex-1 bg-white p-6">
          <p className="text-gray-500">Start writing your thoughts...</p>
        </main>
      </div>
    </div>
  );
}