'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle2, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTicketQuery } from '../hooks/use-ticket-query';
import { useAddTicketMessageMutation } from '../hooks/use-add-ticket-message-mutation';
import { useCloseTicketMutation } from '../hooks/use-close-ticket-mutation';
import { TicketCategoryBadge, TicketStatusBadge } from './ticket-status-badge';
import { addTicketMessageSchema, type AddTicketMessageFormValues } from '../schemas/ticket.schema';

interface TicketDetailDialogProps {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketDetailDialog({ ticketId, open, onOpenChange }: TicketDetailDialogProps) {
  const { data: ticket, isLoading } = useTicketQuery(open ? ticketId : null);
  const addMessageMutation = useAddTicketMessageMutation(ticketId || '');
  const closeMutation = useCloseTicketMutation();

  const form = useForm<AddTicketMessageFormValues>({
    resolver: zodResolver(addTicketMessageSchema),
    defaultValues: { body: '' },
  });

  const onSendMessage = (values: AddTicketMessageFormValues) => {
    addMessageMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        toast.success('Mesajınız iletildi.');
      },
    });
  };

  const isClosed = ticket?.status === 'CLOSED';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-[600px]">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="truncate text-base font-bold">{ticket?.subject}</DialogTitle>
            {ticket && <TicketStatusBadge status={ticket.status} />}
          </div>
          <DialogDescription className="flex items-center gap-2 pt-1 text-xs">
            {ticket && <TicketCategoryBadge category={ticket.category} />}
            <span>•</span>
            <span>
              Açan: {ticket?.creator.firstName} {ticket?.creator.lastName}
            </span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
            Mesajlar yükleniyor...
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex max-h-[350px] flex-col gap-3 overflow-y-auto pr-1">
              {ticket?.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className="flex flex-col gap-1 rounded-lg border border-border/50 bg-muted/30 p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-medium text-foreground">
                    <span>
                      {msg.sender?.firstName} {msg.sender?.lastName}{' '}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        ({msg.sender?.role.replace('_', ' ')})
                      </span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleString('tr-TR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-muted-foreground text-xs">{msg.body}</p>
                </div>
              ))}
            </div>

            {!isClosed ? (
              <form onSubmit={form.handleSubmit(onSendMessage)} className="mt-auto space-y-2 border-t pt-3">
                <textarea
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Yanıtınızı yazın..."
                  {...form.register('body')}
                />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => ticketId && closeMutation.mutate(ticketId)}
                    disabled={closeMutation.isPending}
                  >
                    <CheckCircle2 className="size-3.5 mr-1.5" />
                    Talebi Kapat
                  </Button>
                  <Button type="submit" size="sm" className="h-8 gap-1.5 text-xs" disabled={addMessageMutation.isPending}>
                    <Send className="size-3.5" />
                    {addMessageMutation.isPending ? 'Gönderiliyor...' : 'Yanıtla'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="rounded-md bg-muted p-2.5 text-center text-xs text-muted-foreground">
                Bu destek talebi kapatılmıştır.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
