// Map component stub for frontend-only version
// Google Maps integration is not available in static deployment

export const MapView = ({ initialCenter, initialZoom, onMapReady }: any) => {
  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Carte interactive non disponible en version statique</p>
    </div>
  );
};

export default MapView;
