"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";

interface RsvpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RsvpModal({ open, onOpenChange }: RsvpModalProps) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("2");
  const [status, setStatus] = useState("si");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#dfb56c", "#f48fb1", "#ffd700", "#ff80ab"],
      });
    } catch {
      // ignore
    }

    // Build WhatsApp message
    const attendanceText = status === "si" ? "¡Confirmo con gusto mi asistencia! 🎉" : "Lamentablemente no podré asistir 😢";
    let text = `👑 *CONFIRMACIÓN DE ASISTENCIA - 15 AÑOS*\n`;
    text += `*Quinceañera:* Almudena Vera Viteri\n`;
    text += `*Nombre:* ${name}\n`;
    text += `*Asistencia:* ${attendanceText}\n`;
    if (status === "si") {
      text += `*Número de personas:* ${guests}\n`;
    }
    if (message.trim()) {
      text += `*Mensaje para Almudena:* "${message}"\n`;
    }

    // Default target phone number
    const phone = ""; 
    const whatsappUrl = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-[#fff8f9] border-2 border-[#cba158] rounded-2xl shadow-2xl p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto text-3xl mb-1">👑</div>
          <DialogTitle className="font-montserrat font-bold text-lg text-[#9c7328] uppercase tracking-wider">
            Confirmar Asistencia
          </DialogTitle>
          <DialogDescription className="font-cormorant text-base text-[#6d4c41] italic">
            15 Años de Almudena Vera Viteri
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="guestName" className="font-montserrat text-xs font-semibold text-[#5d4037]">
              Nombre completo:
            </Label>
            <Input
              id="guestName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Familia Morales"
              required
              className="bg-white border-[#d4a359] focus-visible:ring-[#cba158] font-montserrat text-sm"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="attendance" className="font-montserrat text-xs font-semibold text-[#5d4037]">
              ¿Asistirás al evento?:
            </Label>
            <Select value={status} onValueChange={(val: string | null) => { if (val) setStatus(val); }}>
              <SelectTrigger className="bg-white border-[#d4a359] focus:ring-[#cba158] font-montserrat text-sm w-full">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#d4a359]">
                <SelectItem value="si">¡Sí, con mucho gusto asistiré! 🎉</SelectItem>
                <SelectItem value="no">Lamentablemente no podré asistir 😢</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === "si" && (
            <div className="space-y-1.5 text-left">
              <Label htmlFor="guestCount" className="font-montserrat text-xs font-semibold text-[#5d4037]">
                Número de personas:
              </Label>
              <Select value={guests} onValueChange={(val: string | null) => { if (val) setGuests(val); }}>
                <SelectTrigger className="bg-white border-[#d4a359] focus:ring-[#cba158] font-montserrat text-sm w-full">
                  <SelectValue placeholder="Cantidad de invitados" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#d4a359]">
                  <SelectItem value="1">1 Persona</SelectItem>
                  <SelectItem value="2">2 Personas</SelectItem>
                  <SelectItem value="3">3 Personas</SelectItem>
                  <SelectItem value="4">4 Personas</SelectItem>
                  <SelectItem value="5">5 Personas</SelectItem>
                  <SelectItem value="6+">6 o más personas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <Label htmlFor="guestMessage" className="font-montserrat text-xs font-semibold text-[#5d4037]">
              Mensaje de felicitaciones (Opcional):
            </Label>
            <Textarea
              id="guestMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="¡Muchas felicidades en tus 15 años Almudena!"
              rows={3}
              className="bg-white border-[#d4a359] focus-visible:ring-[#cba158] font-montserrat text-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#25d366] hover:bg-[#20ba59] text-white font-montserrat font-bold text-sm py-5 rounded-full shadow-lg gap-2 mt-4 transition-transform active:scale-98"
          >
            <Send className="w-4 h-4" />
            Confirmar por WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
