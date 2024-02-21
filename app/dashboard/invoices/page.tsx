import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Card } from '@/app/ui/dashboard/cards';

import { fetchInvoicesPages } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className=" text-2xl">Parcels</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

      {/* 
      <div className="mb-5 flex w-full justify-center">
        <div className=" w-15 md:w-40">
          <CreateInvoice />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Card title="Waiting For PickUp" value={5} type="waiting" />
        <Card title="Picked Up" value={10} type="pickUp" />
        <Card title="In the process of delivery" value={6} type="inDelivery" />
        <Card title="In Warehouse" value={5} type="warehouse" />
        <Card title="In Transfer" value={5} type="transit" />
        <Card title="Delivered" value={30} type="delivered" />
        <Card title="Another Try" value={3} type="try" />
        <Card title="return to our warehouse" value={0} type="retour" />
      </div>
      */}
    </div>
  );
}
