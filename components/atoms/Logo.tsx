export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
        <div className="ml-1 h-3 w-3 rounded-full bg-blue-400"></div>
        <div className="ml-1 h-3 w-3 rounded-full bg-navy-800"></div>
      </div>
      <div className="text-lg font-semibold text-navy-800">
        Meril <span className="text-amber-500">SAKSHAM</span>
      </div>
    </div>
  );
}
