"use client";

import TenderDetailPage from "@/app/tenders/[tenderId]/page";

interface TenderDetailPageProps {
  params: Promise<{
    category: string;
    tenderId: string; // This is the tender slug
  }>;
}

export default function Page({ params }: TenderDetailPageProps) {
  return <TenderDetailPage params={params}/>;
}
