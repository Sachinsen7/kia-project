// import { cityDetails } from "@/app/data/details";
// import { X, Clock, Phone, MapPin } from "lucide-react";

// type SidebarLeftProps = {
//   selectedId: string | null;
//   onClose: () => void;
// };

// export default function SidebarLeft({ selectedId, onClose }: SidebarLeftProps) {
//   if (!selectedId) return null; // hide sidebar if nothing is selected

//   const detail = cityDetails[selectedId];
//   if (!detail) return null;

//   return (
//     <aside className="fixed top-0 left-0 h-full w-[70%] bg-[#e7e5e6] text-black shadow-2xl transition-transform duration-300 z-50 overflow-y-auto sidebar-slide-in">
//       {/* Header */}
//       <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//         <h2 className="text-xl font-bold text-gray-800">{detail.name}</h2>
//         <button
//           onClick={onClose}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//         >
//           <X size={20} className="text-gray-600" />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="p-4 space-y-6">
//         {/* Features */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3 text-gray-800">
//             Key Points
//           </h3>
//           <ul className="space-y-2">
//             {detail.features.map((feature, index) => (
//               <li key={index} className="flex items-start">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
//                 <span className="text-gray-600">{feature}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Hours */}
//         {detail.hours && (
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Clock size={16} className="text-gray-600 mr-2" />
//               <h4 className="font-semibold text-gray-800">Hours</h4>
//             </div>
//             <p className="text-gray-600">{detail.hours}</p>
//           </div>
//         )}

//         {/* Contact */}
//         {detail.contact && (
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Phone size={16} className="text-blue-600 mr-2" />
//               <h4 className="font-semibold text-gray-800">Contact</h4>
//             </div>
//             <p className="text-gray-600">{detail.contact}</p>
//           </div>
//         )}

//         {/* Location */}
//         <div className="bg-green-50 p-4 rounded-lg">
//           <div className="flex items-center mb-2">
//             <MapPin size={16} className="text-green-600 mr-2" />
//             <h4 className="font-semibold text-gray-800">Location</h4>
//           </div>
//           <p className="text-gray-600">
//             Click on the map to explore this location
//           </p>
//         </div>
//       </div>
//     </aside>
//   );
// }

import { cityDetails } from "@/app/data/details";
import { X, Clock, Phone, MapPin } from "lucide-react";
import type { ComponentType } from "react";
import Home from "@/app/pages/Home";
import About from "@/app/pages/About";
import Ownership from "@/app/pages/Ownership";
import BestPractices from "@/app/pages/BestPractices";
import AskKia from "@/app/pages/AskKia";

type SidebarLeftProps = {
  selectedId: string | null;
  onClose: () => void;
};

export default function SidebarLeft({ selectedId, onClose }: SidebarLeftProps) {
  if (!selectedId) return null;

  const pageMap: Record<string, ComponentType | undefined> = {
    welcome: Home,
    about: About,
    strategy: Ownership,
    "best-practices": BestPractices,
    "ask-kia": AskKia,
  };

  const PageComponent = pageMap[selectedId];
  const detail = cityDetails[selectedId];
  if (!PageComponent && !detail) return null;

  return (
    <aside className="fixed top-0 left-0 h-full w-[90%]  bg-white text-gray-900 shadow-2xl transition-transform duration-300 z-50 overflow-y-auto sidebar-slide-in border-r border-gray-200">
      {/* Header (only show when rendering fallback details) */}
      {!PageComponent && (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{detail.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close sidebar"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>
      )}

      {/* Content */}
      {PageComponent ? (
        <div className="relative px-0 py-0">
          {/* Unified close button overlay when rendering a page */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={22} className="text-gray-600" />
          </button>
          <PageComponent />
        </div>
      ) : (
        <div className="px-6 py-6 space-y-7">
          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Key Points
            </h3>
            <ul className="space-y-3">
              {detail.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {/* Bullet color changed to neutral gray for professional look */}
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          {detail.hours && (
            <div className="bg-gray-100 px-5 py-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock size={18} className="text-blue-500 mr-3" />
                <h4 className="font-semibold text-gray-800">Hours</h4>
              </div>
              <p className="text-gray-700">{detail.hours}</p>
            </div>
          )}

          {/* Contact */}
          {detail.contact && (
            <div className="bg-blue-100 px-5 py-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Phone size={18} className="text-blue-700 mr-3" />
                <h4 className="font-semibold text-gray-800">Contact</h4>
              </div>
              <p className="text-gray-700">{detail.contact}</p>
            </div>
          )}

          {/* Location */}
          <div className="px-1 py-0">
            <div className="flex items-center mb-2">
              <MapPin size={18} className="text-gray-500 mr-3" />
              <h4 className="font-semibold text-gray-800">Location</h4>
            </div>
            <p className="text-gray-700">
              Click on the map to explore this location
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
