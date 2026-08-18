'use client';

import * as React from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { USER_ROLES, type UserFormValues } from '../schemas/user.schema';
import { UserScopeFields } from './user-scope-fields';

interface UserFormFieldsProps {
  control: Control<UserFormValues>;
  setValue: UseFormSetValue<UserFormValues>;
  selectedRole: UserFormValues['role'];
}

export function UserFormFields({ control, setValue, selectedRole }: UserFormFieldsProps) {
  const handleRoleChange = (val: UserFormValues['role']) => {
    setValue('role', val);
    setValue('companyId', '');
    setValue('agencyId', '');
    setValue('branchId', '');
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad *</FormLabel>
              <FormControl><Input placeholder="Ahmet" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyad *</FormLabel>
              <FormControl><Input placeholder="Yılmaz" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-posta *</FormLabel>
            <FormControl><Input type="email" placeholder="ahmet@ornek.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Geçici Şifre *</FormLabel>
            <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kullanıcı Rolü *</FormLabel>
            <Select onValueChange={handleRoleChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Rol seçin" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {USER_ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <UserScopeFields control={control} role={selectedRole} />

      <FormField
        control={control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2.5 space-y-0">
            <FormLabel className="text-xs font-medium cursor-pointer">Aktif Kullanıcı</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
