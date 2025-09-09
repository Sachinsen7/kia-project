type SidebarLeftProps = {
  selectedId: string | null;
};

export default function SidebarLeft({ selectedId }: SidebarLeftProps) {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">Details</h2>
      {selectedId ? (
        <p>Showing details for: {selectedId}</p>
      ) : (
        <p>Select a location to see details</p>
      )}
    </aside>
  );
}
