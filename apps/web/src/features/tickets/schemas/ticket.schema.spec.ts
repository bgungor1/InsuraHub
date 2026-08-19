import { describe, it, expect } from 'vitest';
import { createTicketSchema, addTicketMessageSchema } from './ticket.schema';

describe('Ticket Schemas Validation', () => {
  describe('createTicketSchema', () => {
    it('should validate valid ticket form values', () => {
      const valid = {
        subject: 'Poliçe komisyon düzeltmesi',
        category: 'POLICY_ISSUE',
        message: 'Lütfen 2026-POL-101 nolu poliçeyi kontrol eder misiniz?',
      };

      const result = createTicketSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should fail when subject is shorter than 3 characters', () => {
      const invalid = {
        subject: 'Ab',
        category: 'POLICY_ISSUE',
        message: 'Geçerli bir mesaj gövdesi...',
      };

      const result = createTicketSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail when category is invalid', () => {
      const invalid = {
        subject: 'Destek talebi',
        category: 'INVALID_CATEGORY',
        message: 'Mesaj detayı...',
      };

      const result = createTicketSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('addTicketMessageSchema', () => {
    it('should validate valid reply message', () => {
      const valid = { body: 'Poliçe onaylandı, teşekkürler.' };
      const result = addTicketMessageSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject empty or 1-character reply message', () => {
      const invalid = { body: 'a' };
      const result = addTicketMessageSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
