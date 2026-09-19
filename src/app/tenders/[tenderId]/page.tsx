// //@ts-nocheck
// "use client";

// import React, { use } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/features/auth/hooks/useAuth";
// import { useTender } from "@/features/tenders/api/queries";
// import { useDownloadTender } from "@/features/tenders/api/mutations";
// import { useCategories } from "@/features/categories/api/queries";
// import { useMySubscription } from "@/features/subscriptions/api/queries";
// import { getErrorMessage } from "@/lib/errors";
// import {
//   Calendar,
//   MapPin,
//   Building2,
//   Lock,
//   Download,
//   FileText,
//   CheckCircle2,
//   Clock,
//   ShieldAlert,
// } from "lucide-react";

// interface TenderDetailPageProps {
//   params: Promise<{
//     tenderId: string; // This is the tender slug or ID
//   }>;
// }

// export default function TenderDetailPage({ params }: TenderDetailPageProps) {
//   const router = useRouter();
//   const { tenderId: slug } = use(params);
//   const { user } = useAuth();

//   // Fetch live details & subscription status
//   const { data, isLoading, error } = useTender(slug);
//   const { data: subData } = useMySubscription();
//   const downloadMutation = useDownloadTender();

//   // Fetch categories to reconstruct parent hierarchy breadcrumbs
//   const { data: categories } = useCategories();

//   if (isLoading) {
//     return (
//       <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse space-y-8">
//         <div className="h-4 w-28 bg-[var(--surface-secondary)] rounded-full"></div>
//         <div className="h-12 w-2/3 bg-[var(--surface-secondary)] rounded-lg"></div>
//         <div className="h-6 w-1/3 bg-[var(--surface-secondary)] rounded-lg"></div>
//         <div className="grid lg:grid-cols-12 gap-8 pt-8">
//           <div className="lg:col-span-8 space-y-6">
//             <div className="h-48 bg-[var(--surface-secondary)] rounded-2xl"></div>
//             <div className="h-48 bg-[var(--surface-secondary)] rounded-2xl"></div>
//           </div>
//           <div className="lg:col-span-4">
//             <div className="h-80 bg-[var(--surface-secondary)] rounded-2xl"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   console.log('Tender Not Found', error , data)
//   if (error || !data) {
//     return (
//       <div className="max-w-7xl mx-auto px-6 py-20 text-center">
//         <h1 className="text-3xl font-bold text-red-500">Tender Not Found</h1>
//         <p className="mt-4 text-[var(--muted)]">
//           This procurement opportunity does not exist or has been removed.
//         </p>
//         <Link
//           href="/tenders"
//           className="mt-6 inline-block text-[#003EC7] hover:underline font-semibold"
//         >
//           ← Browse All Tenders
//         </Link>
//       </div>
//     );
//   }

//   const { tender, hasAccess } = data;

//   // Deadline calculation
//   const deadlineRaw = tender.deadline || tender.closingDate;
//   const deadlineDate = deadlineRaw ? new Date(deadlineRaw) : null;
//   const diffTime = deadlineDate ? deadlineDate.getTime() - Date.now() : 0;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   const daysLeft = diffDays > 0 ? diffDays : 0;

//   // Budget formatting
//   const rawBudget =
//     tender.priceCents !== undefined
//       ? tender.priceCents / 100
//       : tender.budgetMax || 0;
//   const formattedBudget = rawBudget.toLocaleString("en-US", {
//     style: "currency",
//     currency: tender.currency || "USD",
//     maximumFractionDigits: 0,
//   });

//   // Dates formatting
//   const postedRaw = tender.postedDate || tender.openingDate || tender.createdAt;
//   const postedDate = postedRaw
//     ? new Date(postedRaw).toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "N/A";

//   const closingDateFormatted = deadlineDate
//     ? deadlineDate.toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "N/A";

//   // Location & Agency
//   const agencyName =
//     tender.agency || tender.department || "Government Procurement Entity";
//   const locationText =
//     tender.formattedAddress ||
//     (tender.city
//       ? `${tender.city}, ${tender.state?.code || tender.state?.name}`
//       : tender.state?.name || "United States");

//   const handleDownload = async () => {
//     if (!hasAccess) return;
//     try {
//       const downloadUrl = await downloadMutation.mutateAsync(tender.id);
//       window.open(downloadUrl, "_blank");
//     } catch (err: any) {
//       alert(getErrorMessage(err) || "Failed to retrieve download link.");
//     }
//   };

//   // Reconstruct nested category breadcrumbs
//   const category = tender.category;
//   const breadcrumbs: { name: string; href: string }[] = [];

//   if (category) {
//     breadcrumbs.push({
//       name: category.name,
//       href: `/tenders?category=${category.id}`,
//     });
//   }

//   return (
//     <main className="py-12 lg:py-20 bg-[var(--background)]">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Navigation Breadcrumbs */}
//         <div className="mb-6 text-sm text-[var(--muted)] flex flex-wrap items-center gap-1.5">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <span>/</span>
//           <Link href="/tenders" className="hover:underline">
//             Tenders
//           </Link>

//           {breadcrumbs.map((bc, idx) => (
//             <React.Fragment key={idx}>
//               <span>/</span>
//               <Link href={bc.href} className="hover:underline">
//                 {bc.name}
//               </Link>
//             </React.Fragment>
//           ))}

//           <span>/</span>
//           <span className="text-[var(--foreground)] truncate max-w-[220px] inline-block font-semibold">
//             {tender.title}
//           </span>
//         </div>

//         {/* Tender Header Banner */}
//         <section className="relative p-8 bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
//           <div className="absolute top-0 right-0 w-80 h-80 bg-[#003EC7]/5 blur-3xl rounded-full"></div>

//           <div className="relative z-10">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-green-500/20">
//                 {tender.publicationStatus ||
//                   tender.status ||
//                   "Verified Opportunity"}
//               </span>

//               <span className="text-xs font-bold text-[var(--muted)] bg-[var(--surface-secondary)] px-3 py-1 rounded-lg border border-[var(--border)] font-mono">
//                 Ref: {tender.referenceNumber || tender.referenceNo || "RFP-BID"}
//               </span>
//             </div>

//             <h1 className="mt-5 text-3xl lg:text-5xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight max-w-4xl">
//               {tender.title}
//             </h1>

//             <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--muted)] font-medium items-center">
//               <span className="flex items-center gap-1.5">
//                 <Building2 className="w-4 h-4 text-[#003EC7]" />
//                 Agency:{" "}
//                 <strong className="text-[var(--foreground)]">
//                   {agencyName}
//                 </strong>
//               </span>

//               {category && (
//                 <>
//                   <span>•</span>
//                   <span>
//                     Category:{" "}
//                     <strong className="text-[var(--foreground)]">
//                       {category.name}
//                     </strong>
//                   </span>
//                 </>
//               )}

//               {tender.state && (
//                 <>
//                   <span>•</span>
//                   <span className="flex items-center gap-1">
//                     <MapPin className="w-4 h-4 text-[#003EC7]" />
//                     Location:{" "}
//                     <strong className="text-[var(--foreground)]">
//                       {tender.state.name} ({tender.state.code})
//                     </strong>
//                   </span>
//                 </>
//               )}
//             </div>

//             <div className="mt-8 flex flex-wrap gap-4 items-center">
//               {hasAccess ? (
//                 <button
//                   onClick={handleDownload}
//                   disabled={downloadMutation.isPending}
//                   className="bg-[#003EC7] hover:bg-[#002fad] text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
//                 >
//                   <Download className="w-4 h-4" />
//                   {downloadMutation.isPending
//                     ? "Preparing document..."
//                     : "Download Full Specification PDF"}
//                 </button>
//               ) : subData?.subscription?.status === "ACTIVE" ? (
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 w-full max-w-2xl">
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2 font-bold text-xs">
//                       <Lock className="w-4 h-4 text-amber-500 shrink-0" />
//                       <span>Subscription Scope Limit</span>
//                     </div>
//                     <p className="text-xs text-[var(--muted)] leading-relaxed">
//                       Your active plan (
//                       <strong>
//                         {subData.subscription.planVersion?.name ||
//                           "Targeted Plan"}
//                       </strong>
//                       ) does not cover this tender's location or category.
//                     </p>
//                   </div>
//                   <Link
//                     href="/pricing"
//                     className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shrink-0 cursor-pointer"
//                   >
//                     View Plan Options
//                   </Link>
//                 </div>
//               ) : (
//                 <Link
//                   href={user ? "/pricing" : `/login?redirect=/tenders/${slug}`}
//                   className="bg-[#003EC7] hover:bg-[#002fad] text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
//                 >
//                   <Lock className="w-4 h-4 text-yellow-300" />
//                   <span>Unlock Details & Download RFP</span>
//                 </Link>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Main Details Grid */}
//         <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">
//           {/* Main Content Column */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* Overview */}
//             <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 relative shadow-xs">
//               <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-3 mb-4">
//                 Tender Overview & Description
//               </h2>
//               <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-line text-sm sm:text-base">
//                 {tender.description ||
//                   "No description provided for this tender."}
//               </p>
//             </div>

//             {/* Eligibility & Conditions */}
//             {(tender.eligibility || tender.specialConditions) && (
//               <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-6">
//                 {tender.eligibility && (
//                   <div>
//                     <h3 className="text-lg font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-2">
//                       <CheckCircle2 className="w-5 h-5 text-green-500" />
//                       <span>Eligibility Criteria</span>
//                     </h3>
//                     <p className="text-sm text-[var(--foreground)] leading-relaxed">
//                       {tender.eligibility}
//                     </p>
//                   </div>
//                 )}

//                 {tender.specialConditions && (
//                   <div>
//                     <h3 className="text-lg font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-2">
//                       <ShieldAlert className="w-5 h-5 text-amber-500" />
//                       <span>Special Conditions</span>
//                     </h3>
//                     <p className="text-sm text-[var(--foreground)] leading-relaxed">
//                       {tender.specialConditions}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Documents Section */}
//             <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 relative shadow-xs">
//               <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-3 mb-4 flex items-center justify-between">
//                 <span>Specification Documents</span>
//                 <span className="text-xs font-normal text-[var(--muted)]">
//                   {tender.documents?.length || 0} File(s)
//                 </span>
//               </h2>

//               {tender.documents && tender.documents.length > 0 ? (
//                 <div className="space-y-3">
//                   {tender.documents.map((doc: any) => (
//                     <div
//                       key={doc.id}
//                       className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/50 flex items-center justify-between gap-4"
//                     >
//                       <div className="flex items-center gap-3">
//                         <FileText className="w-6 h-6 text-[#003EC7] shrink-0" />
//                         <div>
//                           <h5 className="text-sm font-bold text-[var(--foreground)]">
//                             {doc.originalName ||
//                               doc.documentType ||
//                               "Tender Specification PDF"}
//                           </h5>
//                           <span className="text-xs text-[var(--muted)]">
//                             {doc.fileSize
//                               ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`
//                               : "Official PDF"}{" "}
//                             • Status: {doc.virusScanStatus || "Clean"}
//                           </span>
//                         </div>
//                       </div>

//                       {hasAccess ? (
//                         <button
//                           onClick={handleDownload}
//                           className="px-4 py-2 bg-[#003EC7] text-white text-xs font-bold rounded-lg hover:bg-[#002fad] transition-all cursor-pointer"
//                         >
//                           Download
//                         </button>
//                       ) : (
//                         <span className="text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-md flex items-center gap-1">
//                           <Lock className="w-3 h-3" /> Locked
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-[var(--muted)]">
//                   No public documents uploaded for this tender specification
//                   yet.
//                 </p>
//               )}

//               {!hasAccess && (
//                 <div className="mt-6 p-4 rounded-xl bg-[#003EC7]/5 border border-[#003EC7]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
//                   <div className="text-left">
//                     <h5 className="text-sm font-bold text-[var(--foreground)]">
//                       Want to download official RFP specification files &
//                       contact emails?
//                     </h5>
//                     <p className="text-xs text-[var(--muted)]">
//                       Subscribe to an active RFPNexa membership plan to get
//                       instant unrestricted access.
//                     </p>
//                   </div>
//                   <Link
//                     href={
//                       user ? "/pricing" : `/login?redirect=/tenders/${slug}`
//                     }
//                     className="px-5 py-2.5 bg-[#003EC7] hover:bg-[#002fad] text-white text-xs font-bold rounded-xl whitespace-nowrap"
//                   >
//                     Subscribe Now
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar Info Column */}
//           <div className="lg:col-span-4 space-y-6">
//             {/* Summary Card */}
//             <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
//               <h3 className="font-bold text-lg text-[var(--foreground)] border-b border-[var(--border)] pb-3">
//                 Key Procurement Metrics
//               </h3>

//               <div>
//                 <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
//                   Estimated Budget
//                 </span>
//                 <span className="text-3xl font-extrabold text-[#003EC7]">
//                   {formattedBudget}
//                 </span>
//               </div>

//               <div>
//                 <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
//                   Time Remaining
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <div className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-sm">
//                     {daysLeft} Days Left
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3 pt-2 border-t border-[var(--border)] text-xs font-medium text-[var(--foreground)]">
//                 <div className="flex justify-between">
//                   <span className="text-[var(--muted)]">Opening Date:</span>
//                   <span className="font-bold">{postedDate}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--muted)]">Closing Date:</span>
//                   <span className="font-bold">{closingDateFormatted}</span>
//                 </div>
//                 {tender.procurementType && (
//                   <div className="flex justify-between">
//                     <span className="text-[var(--muted)]">
//                       Procurement Type:
//                     </span>
//                     <span className="font-bold capitalize">
//                       {tender.procurementType}
//                     </span>
//                   </div>
//                 )}
//                 {tender.bidValidity && (
//                   <div className="flex justify-between">
//                     <span className="text-[var(--muted)]">Bid Validity:</span>
//                     <span className="font-bold">{tender.bidValidity} Days</span>
//                   </div>
//                 )}
//                 {tender.emdAmount !== undefined && tender.emdAmount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-[var(--muted)]">EMD Amount:</span>
//                     <span className="font-bold">
//                       ${tender.emdAmount.toLocaleString()}
//                     </span>
//                   </div>
//                 )}
//                 {tender.siteVisitRequired && (
//                   <div className="flex justify-between text-amber-600 dark:text-amber-400">
//                     <span>Site Visit Required:</span>
//                     <span className="font-bold">Yes</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Contact Person Card */}
//             <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs relative">
//               <h3 className="font-bold text-lg text-[var(--foreground)] border-b border-[var(--border)] pb-3 mb-4">
//                 Contact & Nodal Officer
//               </h3>

//               {hasAccess ? (
//                 <div className="space-y-3 text-sm text-[var(--foreground)]">
//                   <div>
//                     <span className="text-xs text-[var(--muted)] block">
//                       Contact Person
//                     </span>
//                     <span className="font-bold">
//                       {tender.contactPerson || "Procurement Officer"}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-xs text-[var(--muted)] block">
//                       Email Address
//                     </span>
//                     <span className="font-bold text-[#003EC7]">
//                       {tender.contactEmail || "N/A"}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-xs text-[var(--muted)] block">
//                       Phone Number
//                     </span>
//                     <span className="font-bold">
//                       {tender.contactPhone || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-4 space-y-3">
//                   <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
//                     <Lock className="w-6 h-6" />
//                   </div>
//                   <h5 className="font-bold text-sm text-[var(--foreground)]">
//                     Contact Details Locked
//                   </h5>
//                   <p className="text-xs text-[var(--muted)] leading-relaxed">
//                     Official officer email IDs, direct phone extensions, and
//                     contact names are visible exclusively to subscribed members.
//                   </p>
//                   <Link
//                     href={
//                       user ? "/pricing" : `/login?redirect=/tenders/${slug}`
//                     }
//                     className="mt-2 block w-full py-2.5 bg-[#003EC7] text-white text-xs font-bold rounded-xl shadow-xs"
//                   >
//                     Unlock Officer Contacts
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { use } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lock,
  MapPin,
  ShieldAlert,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTender } from "@/features/tenders/api/queries";
import { useDownloadTender } from "@/features/tenders/api/mutations";
import { useMySubscription } from "@/features/subscriptions/api/queries";
import { getErrorMessage } from "@/lib/errors";

interface TenderDetailPageProps {
  params: Promise<{
    tenderId: string;
  }>;
}

export default function TenderDetailPage({ params }: TenderDetailPageProps) {
  const { tenderId } = use(params);

  const { user } = useAuth();

  const { data, isLoading, error } = useTender(tenderId);

  const { data: subData } = useMySubscription();

  const downloadMutation = useDownloadTender();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-6 py-20">
        <div className="h-4 w-28 rounded-full bg-[var(--surface-secondary)]" />
        <div className="h-12 w-2/3 rounded-lg bg-[var(--surface-secondary)]" />
        <div className="h-6 w-1/3 rounded-lg bg-[var(--surface-secondary)]" />
        <div className="grid gap-8 pt-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="h-48 rounded-2xl bg-[var(--surface-secondary)]" />
            <div className="h-48 rounded-2xl bg-[var(--surface-secondary)]" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-80 rounded-2xl bg-[var(--surface-secondary)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-red-500">Tender Not Found</h1>

        <p className="mt-4 text-[var(--muted)]">
          This procurement opportunity does not exist or has been removed.
        </p>

        <Link
          href="/tenders"
          className="mt-6 inline-block font-semibold text-[#003EC7] hover:underline"
        >
          ← Browse All Tenders
        </Link>
      </div>
    );
  }

  const deadlineDate = data.deadline ? new Date(data.deadline) : null;

  const now = Date.now();

  const diffTime = deadlineDate ? deadlineDate.getTime() - now : 0;

  const daysLeft =
    diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

  const formattedDeadline = deadlineDate
    ? deadlineDate.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  const formattedCreatedAt = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const handleDownload = async () => {
    if (!user) {
      return;
    }

    try {
      const downloadUrl = await downloadMutation.mutateAsync(data.id);

      window.open(downloadUrl, "_blank");
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to retrieve download link.");
    }
  };

  const documents = data.documents ?? [];

  return (
    <main className="bg-[var(--background)] py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <span>/</span>

          <Link href="/tenders" className="hover:underline">
            Tenders
          </Link>

          {data.category && (
            <>
              <span>/</span>

              <Link
                href={`/tenders?category=${data.category.id}`}
                className="hover:underline"
              >
                {data.category.name}
              </Link>
            </>
          )}

          <span>/</span>

          <span className="inline-block max-w-[220px] truncate font-semibold text-[var(--foreground)]">
            {data.title}
          </span>
        </div>

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#003EC7]/5 blur-3xl" />

          <div className="relative z-10">
            {/* Reference */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                Tender
              </span>

              <span className="rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-1 font-mono text-xs font-bold text-[var(--muted)]">
                Ref: {data.referenceNo}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] lg:text-5xl">
              {data.title}
            </h1>

            {/* Metadata */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--muted)]">
              {data.country && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#003EC7]" />

                  <strong className="text-[var(--foreground)]">
                    {data.country.countryName}
                  </strong>
                </span>
              )}

              {data.state && (
                <>
                  <span>•</span>

                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#003EC7]" />

                    <strong className="text-[var(--foreground)]">
                      {data.state.name} ({data.state.code})
                    </strong>
                  </span>
                </>
              )}

              {data.category && (
                <>
                  <span>•</span>

                  <span>
                    Category:{" "}
                    <strong className="text-[var(--foreground)]">
                      {data.category.name}
                    </strong>
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {user ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#003EC7] px-7 py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#002fad] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />

                  {downloadMutation.isPending
                    ? "Preparing document..."
                    : "Download Full Specification"}
                </button>
              ) : subData?.subscription?.status === "active" ? (
                <div className="flex w-full max-w-2xl flex-col items-start justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Lock className="h-4 w-4 text-amber-500" />

                      <span>Subscription Scope Limit</span>
                    </div>

                    <p className="text-xs leading-relaxed text-[var(--muted)]">
                      Your active subscription does not cover this tender.
                    </p>
                  </div>

                  <Link
                    href="/pricing"
                    className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-amber-700"
                  >
                    View Plan Options
                  </Link>
                </div>
              ) : (
                <Link
                  href={
                    user ? "/pricing" : `/login?redirect=/tenders/${tenderId}`
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#003EC7] px-7 py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#002fad] hover:shadow-lg"
                >
                  <Lock className="h-4 w-4 text-yellow-300" />

                  <span>Unlock Details & Download RFP</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
          {/* Main */}
          <div className="space-y-8 lg:col-span-8">
            {/* Overview */}
            <section className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
              <h2 className="mb-4 border-b border-[var(--border)] pb-3 text-xl font-bold text-[var(--foreground)]">
                Tender Overview
              </h2>

              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)] sm:text-base">
                {data.description ||
                  "No description provided for this tender."}
              </p>
            </section>

            {/* Eligibility */}
            {data.eligibility && (
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
                <h2 className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-3 text-xl font-bold text-[var(--foreground)]">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Eligibility Criteria
                </h2>

                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)]">
                  {data.eligibility}
                </p>
              </section>
            )}

            {/* Work Performance */}
            {data.workPerformance && (
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
                <h2 className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-3 text-xl font-bold text-[var(--foreground)]">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  Work Performance
                </h2>

                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)]">
                  {data.workPerformance}
                </p>
              </section>
            )}

            {/* Proposal Submission */}
            {data.proposalSubmission && (
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
                <h2 className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-3 text-xl font-bold text-[var(--foreground)]">
                  <FileText className="h-5 w-5 text-[#003EC7]" />
                  Proposal Submission
                </h2>

                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)]">
                  {data.proposalSubmission}
                </p>
              </section>
            )}

            {/* Documents */}
            <section className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
              <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  Specification Documents
                </h2>

                <span className="text-xs text-[var(--muted)]">
                  {documents.length} File
                  {documents.length === 1 ? "" : "s"}
                </span>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/50 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-6 w-6 shrink-0 text-[#003EC7]" />

                        <div className="min-w-0">
                          <h5
                            className="truncate text-sm font-bold text-[var(--foreground)]"
                            title={document.documentOriginalName}
                          >
                            {document.documentOriginalName}
                          </h5>

                          <span className="text-xs text-[var(--muted)]">
                            {document.fileSize
                              ? `${(document.fileSize / 1024 / 1024).toFixed(
                                  2,
                                )} MB`
                              : "Unknown size"}
                            {" • "}
                            {document.documentType}
                          </span>
                        </div>
                      </div>

                      {user ? (
                        <button
                          type="button"
                          onClick={handleDownload}
                          disabled={downloadMutation.isPending}
                          className="shrink-0 rounded-lg bg-[#003EC7] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#002fad] disabled:opacity-50"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="flex shrink-0 items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  No documents uploaded for this tender.
                </p>
              )}

              {!user && documents.length > 0 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-[#003EC7]/20 bg-[#003EC7]/5 p-4 sm:flex-row">
                  <div>
                    <h5 className="text-sm font-bold text-[var(--foreground)]">
                      Want to download the tender documents?
                    </h5>

                    <p className="text-xs text-[var(--muted)]">
                      Subscribe to an RFPNexa membership plan to access the
                      documents.
                    </p>
                  </div>

                  <Link
                    href={
                      user ? "/pricing" : `/login?redirect=/tenders/${tenderId}`
                    }
                    className="whitespace-nowrap rounded-xl bg-[#003EC7] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#002fad]"
                  >
                    Subscribe Now
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            {/* Tender Summary */}
            <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
              <h3 className="border-b border-[var(--border)] pb-3 text-lg font-bold text-[var(--foreground)]">
                Tender Details
              </h3>

              {/* Deadline */}
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Deadline
                </span>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#003EC7]" />

                  <span className="font-bold text-[var(--foreground)]">
                    {formattedDeadline}
                  </span>
                </div>
              </div>

              {/* Time remaining */}
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Time Remaining
                </span>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />

                  <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm font-bold text-red-500">
                    {daysLeft > 0 ? `${daysLeft} Days Left` : "Deadline Passed"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t border-[var(--border)] pt-4 text-xs font-medium text-[var(--foreground)]">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Reference:</span>

                  <span className="font-bold">{data.referenceNo}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Country:</span>

                  <span className="font-bold">
                    {data.country.countryName}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">State:</span>

                  <span className="font-bold">
                    {data.state.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Category:</span>

                  <span className="font-bold">
                    {data.category.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Published:</span>

                  <span className="font-bold">{formattedCreatedAt}</span>
                </div>
              </div>
            </section>

            {/* Access */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
              <h3 className="mb-4 border-b border-[var(--border)] pb-3 text-lg font-bold text-[var(--foreground)]">
                Document Access
              </h3>

              {user ? (
                <div className="flex items-center gap-3 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />

                  <span className="font-semibold">
                    You have access to the tender documents.
                  </span>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                    <Lock className="h-6 w-6" />
                  </div>

                  <h5 className="font-bold text-sm text-[var(--foreground)]">
                    Documents Locked
                  </h5>

                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    Subscribe to an RFPNexa membership plan to access and
                    download the tender documents.
                  </p>

                  <Link
                    href={
                      user ? "/pricing" : `/login?redirect=/tenders/${tenderId}`
                    }
                    className="mt-2 block w-full rounded-xl bg-[#003EC7] py-2.5 text-xs font-bold text-white hover:bg-[#002fad]"
                  >
                    Unlock Documents
                  </Link>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
