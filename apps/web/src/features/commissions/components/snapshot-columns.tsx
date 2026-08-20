import { ColDef } from 'ag-grid-community';
import type { CommissionSnapshot } from '../types/commission.types';
import type { AuthUser } from '@/types/auth.types';

const formatMoney = (val?: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
    val || 0,
  );

export function getSnapshotColumnDefs(
  user: AuthUser | null,
): ColDef<CommissionSnapshot>[] {
  const role = user?.role;
  const isBroker = role === 'BROKER';
  const isBranchMgr = role === 'BRANCH_MANAGER';
  const isAgencyMgr = role === 'AGENCY_MANAGER';
  const isAdmin = role === 'SUPERADMIN' || role === 'COMPANY_USER';

  const cols: ColDef<CommissionSnapshot>[] = [
    {
      headerName: 'Poliçe / Ürün',
      flex: 1.3,
      minWidth: 130,
      valueGetter: (params) => params.data?.policy?.product || '-',
    },
    {
      headerName: 'Müşteri',
      flex: 1.5,
      minWidth: 150,
      valueGetter: (params) => {
        const c = params.data?.policy?.customer;
        return c ? `${c.firstName} ${c.lastName}` : '-';
      },
    },
    {
      headerName: 'Şube',
      flex: 1.2,
      minWidth: 120,
      valueGetter: (params) => params.data?.policy?.branch?.name || '-',
    },
  ];

  if (!isBroker) {
    cols.push({
      headerName: 'Broker',
      flex: 1.3,
      minWidth: 130,
      valueGetter: (params) => {
        const b = params.data?.policy?.broker;
        return b ? `${b.firstName} ${b.lastName}` : '-';
      },
    });
  }

  cols.push({
    field: 'totalAmount',
    headerName: 'Toplam Prim',
    flex: 1.2,
    minWidth: 120,
    valueFormatter: (p) => formatMoney(p.value),
  });

  cols.push({
    field: 'brokerAmount',
    headerName: isBroker ? 'Hak Edilen Komisyon (₺)' : 'Broker Payı',
    flex: 1.2,
    minWidth: 120,
    valueFormatter: (p) => formatMoney(p.value),
  });

  if (isBranchMgr || isAgencyMgr || isAdmin) {
    cols.push({
      field: 'branchAmount',
      headerName: 'Şube Payı',
      flex: 1.2,
      minWidth: 110,
      valueFormatter: (p) => formatMoney(p.value),
    });
  }

  if (isAgencyMgr || isAdmin) {
    cols.push({
      field: 'agencyAmount',
      headerName: 'Acente Payı',
      flex: 1.2,
      minWidth: 110,
      valueFormatter: (p) => formatMoney(p.value),
    });
  }

  if (isAdmin) {
    cols.push({
      field: 'companyAmount',
      headerName: 'Şirket Payı',
      flex: 1.2,
      minWidth: 110,
      valueFormatter: (p) => formatMoney(p.value),
    });
  }

  cols.push({
    field: 'calculatedAt',
    headerName: 'Hesaplanma Tarihi',
    flex: 1.4,
    minWidth: 140,
    valueFormatter: (p) =>
      p.value ? new Date(p.value).toLocaleString('tr-TR') : '-',
  });

  return cols;
}
