"use client";

import { useEffect, useState, type FormEvent } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, LoaderCircle } from "lucide-react";

interface RsvpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestId: string | null;
  guestName?: string;
  maxCompanions?: number;
  initialStatus?: "si" | "no";
  initialCount?: number;
}

export default function RsvpModal({
  open,
  onOpenChange,
  guestId,
  guestName = "",
  maxCompanions = 1,
  initialStatus = "si",
  initialCount = 1,
}: RsvpModalProps) {
  const [guests, setGuests] = useState(String(initialCount));
  const [status, setStatus] = useState<"si" | "no">(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setGuests(String(Math.min(Math.max(1, initialCount), Math.max(1, maxCompanions))));
      setStatus(initialStatus);
      setMessage("");
      setErrorMessage("");
    }
  }, [open, initialStatus, initialCount, maxCompanions]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!guestId) {
      setErrorMessage(
        "No se identificó tu invitación. Abre el enlace personalizado que te enviaron."
      );
      return;
    }

    const count = status === "si" ? Number(guests) : 0;
    if (
      status === "si" &&
      (!Number.isInteger(count) || count < 1 || count > Math.max(1, maxCompanions))
    ) {
      setErrorMessage("Selecciona una cantidad válida de personas.");
      return;
    }

    setSaving(true);

    try {
      const { data: existing, error: lookupError } = await supabase
        .from("rsvps")
        .select("id")
        .eq("guest_id", guestId)
        .maybeSingle();

      if (lookupError) throw lookupError;

      const payload = {
        guest_id: guestId,
        confirmed: status === "si",
        companions_count: count,
      };

      const result = existing
        ? await supabase.from("rsvps").update(payload).eq("id", existing.id)
        : await supabase.from("rsvps").insert(payload);

      if (result.error) throw result.error;

      if (status === "si") {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#dfb56c", "#f48fb1", "#ffd700", "#ff80ab"],
          });
        } catch {
          // La animación es opcional; no afecta el registro.
        }
        setMessage("¡Gracias! Tu asistencia quedó registrada.");
      } else {
        setMessage("Tu respuesta quedó registrada. Gracias por avisarnos.");
      }

      // Deja visible el mensaje antes de cerrar el modal.
      window.setTimeout(() => onOpenChange(false), 1400);
    } catch (err) {
      console.error("Error al guardar la confirmación en Supabase:", err);
      setErrorMessage(
        "No se pudo guardar tu respuesta. Inténtalo nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-[#fff8f9] border-2 border-[#cba158] rounded-2xl shadow-2xl p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-1 text-3xl">👑</div>
          <DialogTitle className="font-montserrat text-lg font-bold uppercase tracking-wider text-[#9c7328]">
            Confirmar asistencia
          </DialogTitle>
          <DialogDescription className="font-cormorant text-base italic text-[#6d4c41]">
            15 años de Almudena Vera Viteri
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="rounded-xl border border-[#e5cba0] bg-white/80 px-4 py-3 text-center">
            <p className="text-xs text-[#6d4c41]">Invitación a nombre de</p>
            <p className="font-semibold text-[#75476F]">
              {guestName || "Invitado"}
            </p>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="font-montserrat text-xs font-semibold text-[#5d4037]">
              ¿Asistirás al evento?
            </label>
            <Select
              value={status}
              onValueChange={(value) => {
                if (value === "si" || value === "no") setStatus(value);
              }}
            >
              <SelectTrigger className="w-full border-[#d4a359] bg-white font-montserrat text-sm focus:ring-[#cba158]">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent className="border-[#d4a359] bg-white">
                <SelectItem value="si">Sí, asistiré</SelectItem>
                <SelectItem value="no">No podré asistir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === "si" && (
            <div className="space-y-1.5 text-left">
              <label className="font-montserrat text-xs font-semibold text-[#5d4037]">
                Número de personas (máximo {Math.max(1, maxCompanions)})
              </label>
              <Select value={guests} onValueChange={(value) => value && setGuests(value)}>
                <SelectTrigger className="w-full border-[#d4a359] bg-white font-montserrat text-sm focus:ring-[#cba158]">
                  <SelectValue placeholder="Cantidad de personas" />
                </SelectTrigger>
                <SelectContent className="border-[#d4a359] bg-white">
                  {Array.from(
                    { length: Math.max(1, maxCompanions) },
                    (_, index) => index + 1
                  ).map((count) => (
                    <SelectItem key={count} value={String(count)}>
                      {count} {count === 1 ? "persona" : "personas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {message && (
            <p role="status" className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {message}
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={saving || Boolean(message)}
            className="mt-4 w-full gap-2 rounded-full bg-[#9c7328] py-5 font-montserrat text-sm font-bold text-white shadow-lg transition-transform hover:bg-[#805c1f] active:scale-98"
          >
            {saving ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar respuesta"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
