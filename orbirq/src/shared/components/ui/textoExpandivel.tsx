import { useState } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";

interface TextoExpandivelProps {
  texto: string;
  limite?: number;
}

export default function TextoExpandivel({
  texto,
  limite = 100,
}: TextoExpandivelProps) {
  const [expandido, setExpandido] = useState(false);

  const mostrarToggle = texto.length > limite;
  const preview =
    mostrarToggle && !expandido ? texto.slice(0, limite) + "..." : texto;

  return (
    <div className="space-y-2">
      {mostrarToggle && (
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-2 text-teal-900 font-medium 
             hover:underline transition bg-transparent border-0 shadow-none focus:outline-none focus:ring-0
"
        >
          <span>Texto associado</span>
          {expandido ? (
            <MinusCircle size={18} strokeWidth={2} />
          ) : (
            <PlusCircle size={18} strokeWidth={2} />
          )}
        </button>
      )}

      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{preview}</p>
    </div>
  );
}
