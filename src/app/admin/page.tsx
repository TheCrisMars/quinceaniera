"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, Copy, Trash2, Download, CheckCircle2,
  XCircle, Clock, Crown, Loader2, RefreshCw, Search,
  ChevronLeft, ChevronRight, AlertTriangle, UserCheck, Check, Edit,
  MessageSquare
} from "lucide-react";
import { supabase, type GuestWithRsvp } from "@/lib/supabase";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "https://quinceaniera.vercel.app";
}

export default function AdminPage() {
  // Data
  const [guests, setGuests] = useState<GuestWithRsvp[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending" | "declined">("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form & Copy states
  const [newName, setNewName] = useState("");
  const [newMaxComp, setNewMaxComp] = useState(0);
  const [adding, setAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<GuestWithRsvp | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit Guest Modal State
  const [editTarget, setEditTarget] = useState<GuestWithRsvp | null>(null);
  const [editName, setEditName] = useState("");
  const [editMaxComp, setEditMaxComp] = useState(0);
  const [editRsvpStatus, setEditRsvpStatus] = useState<"pending" | "confirmed" | "declined">("pending");
  const [editAttendingCount, setEditAttendingCount] = useState(1);
  const [savingEdit, setSavingEdit] = useState(false);

  // Fetch guests from Supabase automatically on mount
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*, rsvps(*)")
      .order("created_at", { ascending: true });

    if (!error && data) {
      const normalized = data.map((g) => ({
        ...g,
        rsvps: Array.isArray(g.rsvps) ? g.rsvps[0] ?? null : g.rsvps ?? null,
      }));
      setGuests(normalized as GuestWithRsvp[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Add Guest
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);

    const { error } = await supabase
      .from("guests")
      .insert({ name: newName.trim(), max_companions: newMaxComp });

    if (!error) {
      setNewName("");
      setNewMaxComp(0);
      await fetchGuests();
    }
    setAdding(false);
  };

  // Open Edit Modal for a Guest
  const openEditModal = (g: GuestWithRsvp) => {
    setEditTarget(g);
    setEditName(g.name);
    setEditMaxComp(g.max_companions);

    if (g.rsvps === null) {
      setEditRsvpStatus("pending");
      setEditAttendingCount(1);
    } else if (g.rsvps.confirmed) {
      setEditRsvpStatus("confirmed");
      setEditAttendingCount(g.rsvps.companions_count + 1);
    } else {
      setEditRsvpStatus("declined");
      setEditAttendingCount(0);
    }
  };

  // Save Edit Guest Changes
  const handleSaveEdit = async () => {
    if (!editTarget || !editName.trim()) return;
    setSavingEdit(true);

    try {
      // 1. Update guest name and max_companions in guests table with .select() to verify rows affected
      const { data: updatedGuests, error: guestError } = await supabase
        .from("guests")
        .update({
          name: editName.trim(),
          max_companions: Math.max(0, editMaxComp),
        })
        .eq("id", editTarget.id)
        .select();

      if (guestError) {
        console.error("Error al actualizar invitado:", guestError);
        alert("No se pudo actualizar el invitado: " + guestError.message);
        setSavingEdit(false);
        return;
      }

      if (!updatedGuests || updatedGuests.length === 0) {
        alert(
          "⚠️ ATENCIÓN: Supabase bloqueó la actualización por falta de permisos (RLS).\n\n" +
          "Para solucionarlo, abre Supabase → SQL Editor → New Query y ejecuta:\n\n" +
          "CREATE POLICY \"guests_update\" ON guests FOR UPDATE USING (true);"
        );
      }

      // 2. Update RSVP status in rsvps table
      if (editRsvpStatus === "pending") {
        // Delete RSVP entry to make it Pending
        const { error: rsvpDeleteError } = await supabase
          .from("rsvps")
          .delete()
          .eq("guest_id", editTarget.id);

        if (rsvpDeleteError) {
          console.error("Error al eliminar RSVP:", rsvpDeleteError);
        }
      } else {
        const isConfirmed = editRsvpStatus === "confirmed";
        const maxAllowedAttending = editMaxComp + 1;
        const validAttending = Math.min(editAttendingCount, maxAllowedAttending);
        const companionsCount = isConfirmed ? Math.max(0, validAttending - 1) : 0;

        // Check if an RSVP record already exists for this guest
        const { data: existingRsvp } = await supabase
          .from("rsvps")
          .select("id")
          .eq("guest_id", editTarget.id)
          .maybeSingle();

        if (existingRsvp) {
          const { error: rsvpUpdateError } = await supabase
            .from("rsvps")
            .update({
              confirmed: isConfirmed,
              companions_count: companionsCount,
              message: null,
            })
            .eq("guest_id", editTarget.id);

          if (rsvpUpdateError) {
            console.error("Error al actualizar RSVP:", rsvpUpdateError);
            alert("No se pudo actualizar la confirmación: " + rsvpUpdateError.message);
          }
        } else {
          const { error: rsvpInsertError } = await supabase
            .from("rsvps")
            .insert({
              guest_id: editTarget.id,
              confirmed: isConfirmed,
              companions_count: companionsCount,
              message: null,
            });

          if (rsvpInsertError) {
            console.error("Error al crear RSVP:", rsvpInsertError);
            alert("No se pudo crear la confirmación: " + rsvpInsertError.message);
          }
        }
      }

      setEditTarget(null);
      await fetchGuests();
    } catch (err: any) {
      console.error("Unexpected edit error:", err);
      alert("Ocurrió un error al guardar los cambios.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Confirm Delete Guest
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("guests").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await fetchGuests();
  };

  // Copy link
  const copyLink = (token: string, id: string) => {
    const url = `${getBaseUrl()}/?invitado=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export to Excel
  const exportExcel = () => {
    const dataRows = guests.map((g) => {
      const isConfirmed = g.rsvps?.confirmed === true;
      const isDeclined = g.rsvps?.confirmed === false;
      const maxCapacity = g.max_companions + 1;
      const confirmedCount = isConfirmed ? g.rsvps!.companions_count + 1 : 0;

      return {
        "Nombre del Invitado": g.name,
        "Cupo Asignado": maxCapacity,
        "Estado de Confirmación": g.rsvps === null
          ? "Pendiente"
          : isConfirmed ? "Confirmado ✅" : "No asistirá ❌",
        "Personas Confirmadas": isConfirmed ? confirmedCount : (isDeclined ? 0 : "—"),
        "Enlace de Invitación": `${getBaseUrl()}/?invitado=${g.token}`,
      };
    });

    const totalAllocated = guests.reduce((acc, g) => acc + (g.max_companions + 1), 0);
    const totalConfirmedPeople = guests.reduce((acc, g) => acc + (g.rsvps?.confirmed ? g.rsvps.companions_count + 1 : 0), 0);
    const confirmedCountGuests = guests.filter(g => g.rsvps?.confirmed === true).length;

    const totalRow = {
      "Nombre del Invitado": "TOTAL",
      "Cupo Asignado": totalAllocated,
      "Estado de Confirmación": `${confirmedCountGuests} de ${guests.length} confirmados`,
      "Personas Confirmadas": totalConfirmedPeople,
      "Enlace de Invitación": "",
    };

    const rows = [...dataRows, totalRow];

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invitados Quinces");

    const cols = Object.keys(rows[0] || {}).map((k) => ({
      wch: Math.max(k.length + 3, 24),
    }));
    ws["!cols"] = cols;

    XLSX.writeFile(wb, "lista_invitados_quinces_almudena.xlsx");
  };

  // Export WhatsApp Template Excel
  const exportWhatsAppExcel = () => {
    const dataRows = guests.map((g) => {
      const link = `${getBaseUrl()}/?invitado=${g.token}`;
      const message = `Será un honor contar con tu presencia en los *XV años de Almudena Vera Viteri*✨\n\n📅 *19 de septiembre de 2026*\n\nPor favor, *Confirmar tu asistencia hasta el 9 de septiembre*. Si no recibimos tu respuesta, entenderemos que no podrás acompañarnos.\n\n⏰ Te pedimos *puntualidad* para que disfrutes de cada momento y de cada sorpresa preparada.\n💌 Para un recordatorio exclusivo, presiona la fecha de la invitación.\n\n*Gracias por ser parte de este día tan especial. ¡Te esperamos!*💕\n\n*Clic para ver la invitación*👇🏻\n${link}`;

      return {
        "Invitado": g.name,
        "Mensaje WhatsApp": message,
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mensajes WhatsApp");

    // Column widths
    ws["!cols"] = [
      { wch: 35 },
      { wch: 80 },
    ];

    XLSX.writeFile(wb, "plantillas_whatsapp_quinces_almudena.xlsx");
  };

  // Stats
  const totalGuests = guests.length;
  const totalAllocatedPeople = useMemo(() => {
    return guests.reduce((acc, g) => acc + (g.max_companions + 1), 0);
  }, [guests]);

  const confirmedGuests = useMemo(() => guests.filter((g) => g.rsvps?.confirmed === true), [guests]);
  const pendingGuests = useMemo(() => guests.filter((g) => g.rsvps === null), [guests]);
  const declinedGuests = useMemo(() => guests.filter((g) => g.rsvps?.confirmed === false), [guests]);

  const totalConfirmedPeople = useMemo(() => {
    return confirmedGuests.reduce((acc, g) => acc + (g.rsvps!.companions_count + 1), 0);
  }, [confirmedGuests]);

  // Filtered List
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (statusFilter === "confirmed" && g.rsvps?.confirmed !== true) return false;
      if (statusFilter === "pending" && g.rsvps !== null) return false;
      if (statusFilter === "declined" && g.rsvps?.confirmed !== false) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return g.name.toLowerCase().includes(query);
      }
      return true;
    });
  }, [guests, statusFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / pageSize) || 1;
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGuests.slice(start, start + pageSize);
  }, [filteredGuests, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffcf8] via-[#fff6e9] to-[#fce8d0] px-3 sm:px-6 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* 1. Header Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-[#dfb56c]/40 shadow-xs">
          <div>
            <h1 className="font-montserrat font-black text-2xl sm:text-3xl text-[#2e1f14] flex items-center gap-2">
              <Crown className="w-7 h-7 text-[#cca048]" />
              Gestión de Invitados
            </h1>
            <p className="font-cormorant text-base text-[#5d4037] mt-0.5">
              Mis XV Años &bull; Almudena Vera Viteri &bull; 19 de Septiembre
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={fetchGuests}
              title="Recargar datos"
              className="p-2.5 rounded-xl border border-[#dfb56c]/60 text-[#5d4037] hover:bg-[#dfb56c]/10 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={exportWhatsAppExcel}
              disabled={guests.length === 0}
              title="Descargar Excel con mensajes de WhatsApp listos para enviar"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-montserrat font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              Plantilla WhatsApp (Excel)
            </button>
            <button
              onClick={exportExcel}
              disabled={guests.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#217346] hover:bg-[#1a5c38] text-white font-montserrat font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Exportar Lista Excel
            </button>
          </div>
        </div>

        {/* 2. Global Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#f0c268] to-[#cca048] p-4 text-white shadow-md flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-xs opacity-90 uppercase tracking-wider font-bold">Invitaciones</span>
              <Users className="w-4 h-4 opacity-80" />
            </div>
            <p className="font-montserrat font-black text-2xl sm:text-3xl">{totalGuests}</p>
            <p className="font-montserrat text-[11px] opacity-90">{totalAllocatedPeople} personas asignadas</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#66bb6a] to-[#2e7d32] p-4 text-white shadow-md flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-xs opacity-90 uppercase tracking-wider font-bold">Confirmados</span>
              <UserCheck className="w-4 h-4 opacity-80" />
            </div>
            <p className="font-montserrat font-black text-2xl sm:text-3xl">{confirmedGuests.length}</p>
            <p className="font-montserrat text-[11px] opacity-90 font-bold">{totalConfirmedPeople} personas que irán</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#ffa726] to-[#e65100] p-4 text-white shadow-md flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-xs opacity-90 uppercase tracking-wider font-bold">Pendientes</span>
              <Clock className="w-4 h-4 opacity-80" />
            </div>
            <p className="font-montserrat font-black text-2xl sm:text-3xl">{pendingGuests.length}</p>
            <p className="font-montserrat text-[11px] opacity-90">Esperando respuesta</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#ef5350] to-[#c62828] p-4 text-white shadow-md flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-xs opacity-90 uppercase tracking-wider font-bold">No asistirán</span>
              <XCircle className="w-4 h-4 opacity-80" />
            </div>
            <p className="font-montserrat font-black text-2xl sm:text-3xl">{declinedGuests.length}</p>
            <p className="font-montserrat text-[11px] opacity-90">Invitaciones declinadas</p>
          </div>
        </div>

        {/* 3. Add Guest Form */}
        <div className="bg-white rounded-2xl border border-[#dfb56c]/50 shadow-sm p-4 sm:p-5">
          <h2 className="font-montserrat font-bold text-sm sm:text-base text-[#2e1f14] flex items-center gap-2 mb-3">
            <UserPlus className="w-4 h-4 text-[#cca048]" />
            Agregar Nuevo Invitado
          </h2>
          <form onSubmit={handleAddGuest} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-1">
                Nombre del Invitado / Familia:
              </label>
              <input
                type="text"
                placeholder="Ej. Sr. Juan Pérez y Familia"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#dfb56c]/60 focus:border-[#cca048] font-cormorant text-base text-[#2e1f14] outline-none transition-colors"
              />
            </div>

            <div className="w-full sm:w-56">
              <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-1">
                Acompañantes Extra:
              </label>
              <select
                value={newMaxComp}
                onChange={(e) => setNewMaxComp(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#dfb56c]/60 focus:border-[#cca048] font-montserrat text-xs text-[#2e1f14] outline-none transition-colors bg-white cursor-pointer"
              >
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? "Solo el invitado (1 persona)" : `+${i} acompañantes (${i + 1} personas)`}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f0c268] to-[#cca048] hover:from-[#e5b350] hover:to-[#b88c38] text-white font-montserrat font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>Agregar Invitado</span>
            </button>
          </form>
        </div>

        {/* 4. Search & Filters */}
        <div className="bg-white rounded-2xl border border-[#dfb56c]/50 shadow-sm p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#9e9e9e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl border border-[#dfb56c]/60 focus:border-[#cca048] font-montserrat text-xs text-[#2e1f14] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9e9e9e] hover:text-[#5d4037]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: "all", label: `Todos (${totalGuests})` },
              { id: "confirmed", label: `Confirmados (${confirmedGuests.length})` },
              { id: "pending", label: `Pendientes (${pendingGuests.length})` },
              { id: "declined", label: `No asistirán (${declinedGuests.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-montserrat text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${statusFilter === tab.id
                  ? "bg-[#cca048] text-white shadow-xs"
                  : "bg-[#fffbe8] text-[#5d4037] border border-[#dfb56c]/40 hover:bg-[#fff6d0]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Main Guest List Table */}
        <div className="bg-white rounded-2xl border border-[#dfb56c]/50 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16 gap-2">
              <Loader2 className="w-6 h-6 text-[#cca048] animate-spin" />
              <span className="font-montserrat text-sm text-[#5d4037]">Cargando lista de invitados...</span>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="text-center py-16 text-[#9e9e9e] font-cormorant text-xl">
              No se encontraron invitados con los filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#fffbe8] border-b border-[#dfb56c]/40">
                    <th className="font-montserrat text-xs font-extrabold text-[#5d4037] uppercase tracking-wider px-4 py-3.5">
                      Invitado
                    </th>
                    <th className="font-montserrat text-xs font-extrabold text-[#5d4037] uppercase tracking-wider px-3 py-3.5 text-center">
                      Cupo Asignado
                    </th>
                    <th className="font-montserrat text-xs font-extrabold text-[#5d4037] uppercase tracking-wider px-3 py-3.5 text-center">
                      Estado de Confirmación
                    </th>
                    <th className="font-montserrat text-xs font-extrabold text-[#5d4037] uppercase tracking-wider px-3 py-3.5 text-center">
                      Personas Confirmadas
                    </th>
                    <th className="font-montserrat text-xs font-extrabold text-[#5d4037] uppercase tracking-wider px-4 py-3.5 text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGuests.map((g, idx) => {
                    const rsvp = g.rsvps;
                    const isConfirmed = rsvp?.confirmed === true;
                    const isDeclined = rsvp?.confirmed === false;
                    const maxCapacity = g.max_companions + 1;
                    const confirmedCount = isConfirmed ? rsvp.companions_count + 1 : 0;

                    return (
                      <tr
                        key={g.id}
                        className={`border-b border-[#dfb56c]/20 hover:bg-[#fffbe8]/70 transition-colors ${idx % 2 === 0 ? "" : "bg-[#fffcf8]/40"
                          }`}
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-cormorant font-bold text-base sm:text-lg text-[#2e1f14] leading-tight">
                            {g.name}
                          </p>
                        </td>

                        <td className="px-3 py-3.5 text-center">
                          <span className="font-montserrat text-xs font-semibold text-[#5d4037] bg-[#fffbe8] px-2.5 py-1 rounded-md border border-[#dfb56c]/40">
                            {maxCapacity} {maxCapacity === 1 ? "persona" : "personas"}
                          </span>
                        </td>

                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          {rsvp === null ? (
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 font-montserrat text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Pendiente
                            </span>
                          ) : isConfirmed ? (
                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 font-montserrat text-xs font-bold px-2.5 py-1 rounded-full border border-green-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Confirmado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-800 font-montserrat text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">
                              <XCircle className="w-3.5 h-3.5 text-red-500" /> No asistirá
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-3.5 text-center">
                          {isConfirmed ? (
                            <span className="font-montserrat font-extrabold text-sm text-[#2e7d32] bg-green-100/70 px-2.5 py-1 rounded-md border border-green-300">
                              {confirmedCount} {confirmedCount === 1 ? "persona" : "personas"}
                            </span>
                          ) : isDeclined ? (
                            <span className="font-montserrat text-xs text-red-400 font-semibold">0</span>
                          ) : (
                            <span className="font-montserrat text-xs text-[#9e9e9e] italic">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditModal(g)}
                              title="Editar invitado"
                              className="p-1.5 rounded-lg border border-[#dfb56c]/60 text-[#5d4037] hover:bg-[#fff6d0] hover:border-[#cca048] transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#cca048]" />
                            </button>

                            <button
                              onClick={() => copyLink(g.token, g.id)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-montserrat font-bold border transition-all duration-200 cursor-pointer ${copiedId === g.id
                                ? "bg-green-500 border-green-600 text-white shadow-xs"
                                : "bg-[#fffbe8] border-[#dfb56c]/70 text-[#5d4037] hover:border-[#cca048] hover:bg-[#fff6d0]"
                                }`}
                            >
                              {copiedId === g.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#cca048]" />
                                  <span>Link</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => setDeleteTarget(g)}
                              title="Eliminar invitado"
                              className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Bottom Total Summary Row */}
                <tfoot>
                  <tr className="bg-[#e8f5e9] border-t-2 border-[#a5d6a7]">
                    <td className="px-4 py-3.5 font-montserrat font-bold text-sm text-[#1b5e20]">
                      TOTAL ({guests.length} invitaciones)
                    </td>
                    <td className="px-3 py-3.5 text-center font-montserrat font-bold text-sm text-[#1b5e20]">
                      {totalAllocatedPeople} personas
                    </td>
                    <td className="px-3 py-3.5 text-center font-montserrat font-bold text-xs text-[#1b5e20]">
                      {confirmedGuests.length} confirmados
                    </td>
                    <td className="px-3 py-3.5 text-center font-montserrat font-black text-base text-[#1b5e20]">
                      {totalConfirmedPeople} personas
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* 6. Pagination Footer Controls */}
          {filteredGuests.length > 0 && (
            <div className="px-5 py-4 bg-[#fffbe8]/60 border-t border-[#dfb56c]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-montserrat text-xs text-[#5d4037]">Filas por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg border border-[#dfb56c]/60 bg-white font-montserrat text-xs text-[#5d4037] outline-none"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="font-montserrat text-xs text-[#8c6220] ml-2">
                  Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredGuests.length)} de {filteredGuests.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#dfb56c]/60 text-[#5d4037] hover:bg-[#dfb56c]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-montserrat font-bold text-xs text-[#5d4037] px-3">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-[#dfb56c]/60 text-[#5d4037] hover:bg-[#dfb56c]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* EDIT GUEST MODAL */}
      <AnimatePresence>
        {editTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl border-2 border-[#dfb56c] shadow-[0_20px_50px_rgba(180,130,50,0.3)] p-6 text-left overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#dfb56c]/30 pb-3 mb-4">
                <h3 className="font-montserrat font-bold text-lg text-[#2e1f14] flex items-center gap-2">
                  <Edit className="w-5 h-5 text-[#cca048]" />
                  Editar Invitado
                </h3>
                <button
                  onClick={() => setEditTarget(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-1">
                    Nombre del Invitado:
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dfb56c]/60 font-cormorant text-base text-[#2e1f14] outline-none focus:border-[#cca048]"
                  />
                </div>

                <div>
                  <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-1">
                    Acompañantes Extra Permitidos:
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={editMaxComp}
                    onChange={(e) => setEditMaxComp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#dfb56c]/60 font-montserrat text-sm text-[#2e1f14] outline-none focus:border-[#cca048]"
                  />
                  <p className="font-montserrat text-[11px] text-[#8c6220] mt-1">
                    Cupo total asignado: {editMaxComp + 1} {editMaxComp + 1 === 1 ? "persona" : "personas"}
                  </p>
                </div>

                <div>
                  <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-1">
                    Estado de Confirmación:
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: "pending", label: "Pendiente" },
                      { id: "confirmed", label: "Confirmado" },
                      { id: "declined", label: "No asistirá" },
                    ].map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => setEditRsvpStatus(status.id as any)}
                        className={`flex-1 py-2 rounded-xl font-montserrat text-xs font-bold border transition-all cursor-pointer ${editRsvpStatus === status.id
                          ? status.id === "confirmed"
                            ? "bg-green-600 border-green-600 text-white shadow-xs"
                            : status.id === "declined"
                              ? "bg-red-600 border-red-600 text-white shadow-xs"
                              : "bg-amber-500 border-amber-500 text-white shadow-xs"
                          : "bg-[#fffbe8] border-[#dfb56c]/40 text-[#5d4037]"
                          }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {editRsvpStatus === "confirmed" && (
                  <div>
                    <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-1">
                      Personas que asistirán en total (Máx. {editMaxComp + 1}):
                    </label>
                    <select
                      value={editAttendingCount}
                      onChange={(e) => setEditAttendingCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#dfb56c]/60 font-montserrat text-sm text-[#2e1f14] outline-none focus:border-[#cca048]"
                    >
                      {Array.from({ length: editMaxComp + 1 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "persona" : "personas"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-3 border-t border-[#dfb56c]/30">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-xl border border-[#dfb56c]/60 text-[#5d4037] font-montserrat font-bold text-xs hover:bg-[#dfb56c]/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-[#cca048] hover:bg-[#b88c38] text-white font-montserrat font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHADCN-STYLE DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl border-2 border-red-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 text-center overflow-hidden"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <h3 className="font-montserrat font-bold text-lg text-[#2e1f14] mb-1">
                ¿Eliminar invitado?
              </h3>

              <p className="font-cormorant text-base text-[#5d4037] mb-6">
                Esta acción eliminará a <strong className="text-red-700">{deleteTarget.name}</strong> y su respuesta de confirmación de la base de datos.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl border border-[#dfb56c]/60 text-[#5d4037] font-montserrat font-bold text-xs hover:bg-[#dfb56c]/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-montserrat font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
