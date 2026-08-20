'use client';

import * as React from 'react';
import { LifeBuoy, Plus, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { queryKeys } from '@/lib/api';
import {
  useTicketsQuery,
  useCloseTicketMutation,
  TicketCard,
  CreateTicketDialog,
  TicketDetailDialog,
  type TicketItem,
  type TicketStatus,
} from '@/features/tickets';

export default function TicketsPage() {
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = React.useState<string>('ALL');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);

  const filters = activeStatus === 'ALL' ? undefined : { status: activeStatus as TicketStatus };
  const { data, isLoading } = useTicketsQuery(filters);
  const closeMutation = useCloseTicketMutation();

  const tickets = data?.items || [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <LifeBuoy className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Destek Talepleri</h1>
            <p className="text-sm text-muted-foreground">
              Sistem yönetimi ve operasyon birimi ile iletişim havuzunuz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1.5 text-xs">
            <RefreshCw className="size-3.5" />
            Yenile
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            Yeni Talep Aç
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus}>
        <TabsList className="grid w-full grid-cols-5 sm:w-[500px]">
          <TabsTrigger value="ALL">Tümü</TabsTrigger>
          <TabsTrigger value="OPEN">Açık</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">İşlemde</TabsTrigger>
          <TabsTrigger value="RESOLVED">Çözüldü</TabsTrigger>
          <TabsTrigger value="CLOSED">Kapatıldı</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tickets List */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
          Destek talepleri yükleniyor...
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-12 text-center">
          <LifeBuoy className="size-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm font-medium text-foreground">Kayıtlı destek talebi bulunamadı.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Yeni bir talep açarak destek birimine anında ulaşabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket: TicketItem) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onSelect={(t) => setSelectedTicketId(t.id)}
              onClose={(id) => closeMutation.mutate(id)}
              isClosing={closeMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTicketDialog open={createOpen} onOpenChange={setCreateOpen} />
      <TicketDetailDialog
        ticketId={selectedTicketId}
        open={Boolean(selectedTicketId)}
        onOpenChange={(open) => !open && setSelectedTicketId(null)}
      />
    </div>
  );
}
