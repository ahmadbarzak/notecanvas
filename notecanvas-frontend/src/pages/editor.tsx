import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("@/components/canvas/Canvas"), { ssr: false });

export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col">
        <div className="h-16 bg-gray-100 flex items-center justify-between px-4 shadow">
        <h1 className="text-xl font-bold">NoteCanvas</h1>
        
        <button onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }} className="text-sm text-gray-600 hover:underline"
        > 
            Logout
        </button>
    </div>

    <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 p-4 text-sm">Sidebar content</aside>
        <main className="flex-1">
            <Canvas />
        </main>
      </div>
    </div>
  );
}