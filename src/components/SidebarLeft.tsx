import { cityDetails } from "@/app/data/details";
import { X, Clock, Phone, MapPin } from "lucide-react";

type SidebarLeftProps = {
  selectedId: string | null;
  onClose: () => void;
};

export default function SidebarLeft({ selectedId, onClose }: SidebarLeftProps) {
  if (!selectedId) return null; // hide sidebar if nothing is selected

  const detail = cityDetails[selectedId];
  if (!detail) return null;

  return (
    <aside className="fixed top-0 left-0 h-full w-80 bg-white text-black shadow-2xl transition-transform duration-300 z-50 overflow-y-auto sidebar-slide-in">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{detail.name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Key Points
          </h3>
          <ul className="space-y-2">
            {detail.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        {detail.hours && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock size={16} className="text-gray-600 mr-2" />
              <h4 className="font-semibold text-gray-800">Hours</h4>
            </div>
            <p className="text-gray-600">{detail.hours}</p>
          </div>
        )}

        {/* Contact */}
        {detail.contact && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Phone size={16} className="text-blue-600 mr-2" />
              <h4 className="font-semibold text-gray-800">Contact</h4>
            </div>
            <p className="text-gray-600">{detail.contact}</p>
          </div>
        )}

        {/* Location */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <MapPin size={16} className="text-green-600 mr-2" />
            <h4 className="font-semibold text-gray-800">Location</h4>
          </div>
          <p className="text-gray-600">
            Click on the map to explore this location
          </p>
        </div>
      </div>
    </aside>
  );
}
