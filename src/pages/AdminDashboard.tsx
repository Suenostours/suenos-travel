import { useState } from "react";
import { Link, Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard, Map, MapPin, Compass, FileText, Image, Settings, Shield,
  Users, MessageSquare, Mail, LogOut, Menu, Plus, Pencil, Trash2, Save, Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Map, label: "Tours", path: "/admin/tours" },
  { icon: MapPin, label: "Cities", path: "/admin/cities" },
  { icon: Compass, label: "Excursions", path: "/admin/excursions" },
  { icon: FileText, label: "Blog", path: "/admin/blog" },
  { icon: Image, label: "Media", path: "/admin/media" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: Shield, label: "SEO / Pixels", path: "/admin/seo" },
  { icon: MessageSquare, label: "Contacts", path: "/admin/contacts" },
  { icon: Mail, label: "Quotes", path: "/admin/quotes" },
  { icon: Handshake, label: "B2B Partners", path: "/admin/partners" },
  { icon: Users, label: "Admins", path: "/admin/admins" },
];

function Sidebar({ active, onClose }: { active: string; onClose?: () => void }) {
  const { admin, logout } = useAuth();

  return (
    <div className="w-64 bg-[#0F172A] text-gray-300 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-serif font-semibold text-white">Suenos Travel</h2>
        <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
              active === item.path ? "bg-[#A91D2D]/20 text-[#E8A0A0] border-r-2 border-[#A91D2D]" : "hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#A91D2D]/20 flex items-center justify-center text-xs font-bold text-[#E8A0A0]">
            {admin?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-white">{admin?.name}</p>
            <p className="text-xs text-gray-500">{admin?.role}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { admin, isLoading } = useAuth();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  const currentPath = window.location.pathname;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Suenos Travel</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar active={currentPath} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
            <div className="absolute left-0 top-0 h-full">
              <Sidebar active={currentPath} onClose={() => setMobileSidebar(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile header */}
          <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
            <button onClick={() => setMobileSidebar(true)} className="p-2">
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-semibold">Admin</span>
            <div className="w-8" />
          </div>

          <div className="p-6 md:p-8">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/tours" element={<ToursManager />} />
              <Route path="/cities" element={<CitiesManager />} />
              <Route path="/excursions" element={<ExcursionsManager />} />
              <Route path="/blog" element={<BlogManager />} />
              <Route path="/media" element={<MediaManager />} />
              <Route path="/settings" element={<SettingsManager />} />
              <Route path="/seo" element={<SeoManager />} />
              <Route path="/contacts" element={<ContactsManager />} />
              <Route path="/quotes" element={<QuotesManager />} />
              <Route path="/partners" element={<PartnersManager />} />
              <Route path="/admins" element={<AdminsManager />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Dashboard Overview ───
function DashboardOverview() {
  const { data: contacts } = trpc.forms.listContacts.useQuery();
  const { data: quotes } = trpc.forms.listQuotes.useQuery();
  const { data: partners } = trpc.forms.listPartners.useQuery();
  const { data: toursList } = trpc.tours.list.useQuery();
  const { data: citiesList } = trpc.cities.list.useQuery();
  const { data: blogList } = trpc.blog.list.useQuery();

  const stats = [
    { label: "Total Tours", value: toursList?.length ?? 0, icon: Map },
    { label: "Cities", value: citiesList?.length ?? 0, icon: MapPin },
    { label: "Blog Posts", value: blogList?.length ?? 0, icon: FileText },
    { label: "Contact Requests", value: contacts?.length ?? 0, icon: MessageSquare },
    { label: "Quote Requests", value: quotes?.length ?? 0, icon: Mail },
    { label: "B2B Requests", value: partners?.length ?? 0, icon: Handshake },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-5 w-5 text-[#A91D2D]" />
              <span className="text-2xl font-bold text-[#1F2937]">{s.value}</span>
            </div>
            <p className="text-sm text-[#6B7280]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-[#1F2937] mb-4">Recent Contact Requests</h2>
          {(contacts?.slice(0, 5).length ?? 0) === 0 ? (
            <p className="text-sm text-[#6B7280]">No contact requests yet.</p>
          ) : (
            <div className="space-y-3">
              {contacts?.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#1F2937]">{c.name}</p>
                    <p className="text-xs text-[#6B7280]">{c.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status === "new" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-[#1F2937] mb-4">Recent Quote Requests</h2>
          {(quotes?.slice(0, 5).length ?? 0) === 0 ? (
            <p className="text-sm text-[#6B7280]">No quote requests yet.</p>
          ) : (
            <div className="space-y-3">
              {quotes?.slice(0, 5).map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#1F2937]">{q.agencyName || q.contactPerson || "Unknown"}</p>
                    <p className="text-xs text-[#6B7280]">{q.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${q.status === "new" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{q.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tours Manager ───
function ToursManager() {
  const { data: tours, refetch } = trpc.tours.list.useQuery();
  const deleteMutation = trpc.tours.delete.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data: fullTour, isLoading: fullTourLoading } = trpc.tours.getById.useQuery(
    { id: editingId ?? 0 },
    { enabled: editingId !== null },
  );

  const closeForm = () => {
    setEditing(null);
    setEditingId(null);
  };

  const handleSaved = () => {
    closeForm();
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">Tours / Circuits</h1>
        <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full" onClick={() => { setEditingId(null); setEditing({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Tour
        </Button>
      </div>

      {editingId !== null && fullTourLoading && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-sm text-[#6B7280]">Loading tour details...</div>
      )}

      {editingId !== null && !fullTourLoading && fullTour === null && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-sm text-red-600">Tour details could not be loaded.</div>
      )}

      {editingId !== null && fullTour && (
        <TourForm tour={fullTour} onCancel={closeForm} onSaved={handleSaved} />
      )}

      {editingId === null && editing && (
        <TourForm tour={editing} onCancel={closeForm} onSaved={handleSaved} />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[#6B7280]">Title</th>
              <th className="px-4 py-3 text-left font-medium text-[#6B7280]">Type</th>
              <th className="px-4 py-3 text-left font-medium text-[#6B7280]">Duration</th>
              <th className="px-4 py-3 text-left font-medium text-[#6B7280]">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#6B7280]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours?.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{t.slug}</td>
                <td className="px-4 py-3 text-[#6B7280]">{t.type}</td>
                <td className="px-4 py-3 text-[#6B7280]">{t.duration || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${t.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{t.active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditing(null); setEditingId(t.id); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => { if (confirm("Delete this tour?")) deleteMutation.mutate({ id: t.id }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TourForm({ tour, onCancel, onSaved }: { tour: any; onCancel: () => void; onSaved: () => void }) {
  const isEdit = !!tour.id;
  const enTranslation = tour.translations?.find((t: any) => t.locale === "en");
  const frTranslation = tour.translations?.find((t: any) => t.locale === "fr");
  const normalizeBoolean = (value: unknown, fallback: boolean) => {
    if (value === true || value === 1 || value === "1") return true;
    if (value === false || value === 0 || value === "0") return false;
    return fallback;
  };
  const [slug, setSlug] = useState(tour.slug || "");
  const [mainImage, setMainImage] = useState(tour.mainImage || "");
  const [duration, setDuration] = useState(tour.duration || "");
  const [type, setType] = useState(tour.type || "private");
  const [active, setActive] = useState(normalizeBoolean(tour.active, true));
  const [featured, setFeatured] = useState(normalizeBoolean(tour.featured, false));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [titleEn, setTitleEn] = useState(enTranslation?.title || "");
  const [titleFr, setTitleFr] = useState(frTranslation?.title || "");
  const [descEn, setDescEn] = useState(enTranslation?.description || "");
  const [descFr, setDescFr] = useState(frTranslation?.description || "");
  const [programEn, setProgramEn] = useState(enTranslation?.program || "");
  const [programFr, setProgramFr] = useState(frTranslation?.program || "");
  const [highlightsEn, setHighlightsEn] = useState(enTranslation?.highlights || "");
  const [highlightsFr, setHighlightsFr] = useState(frTranslation?.highlights || "");
  const [inclusionsEn, setInclusionsEn] = useState(enTranslation?.inclusions || "");
  const [inclusionsFr, setInclusionsFr] = useState(frTranslation?.inclusions || "");
  const [exclusionsEn, setExclusionsEn] = useState(enTranslation?.exclusions || "");
  const [exclusionsFr, setExclusionsFr] = useState(frTranslation?.exclusions || "");

  const createMutation = trpc.tours.create.useMutation({ onSuccess: onSaved });
  const updateMutation = trpc.tours.update.useMutation({ onSuccess: onSaved });

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("files", file);
    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Upload failed");
      }
      const uploadedUrl = result?.files?.[0]?.url;
      if (!uploadedUrl) {
        throw new Error("Upload succeeded but no image URL was returned");
      }
      setMainImage(uploadedUrl);
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      slug,
      mainImage,
      duration,
      type,
      active: Boolean(active),
      featured: Boolean(featured),
      translations: [
        {
          locale: "en" as const,
          title: titleEn,
          description: descEn,
          program: programEn,
          highlights: highlightsEn,
          inclusions: inclusionsEn,
          exclusions: exclusionsEn,
        },
        {
          locale: "fr" as const,
          title: titleFr || titleEn,
          description: descFr || descEn,
          program: programFr || programEn,
          highlights: highlightsFr || highlightsEn,
          inclusions: inclusionsFr || inclusionsEn,
          exclusions: exclusionsFr || exclusionsEn,
        },
      ],
      cityIds: tour.cityIds || [],
      gallery: tour.gallery || [],
    };
    if (isEdit) {
      updateMutation.mutate({ id: tour.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-lg">{isEdit ? "Edit Tour" : "Add New Tour"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Slug *</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <Label>Duration</Label>
          <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 7-9 days" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Main Image</Label>
        {mainImage && (
          <div className="w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            <img src={mainImage} alt="Tour main image preview" className="h-48 w-full object-cover" />
          </div>
        )}
        <Input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploadingImage} />
        {uploadingImage && <p className="text-xs text-[#6B7280]">Uploading image...</p>}
        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["private", "small_group", "corporate", "desert", "family", "luxury", "cultural", "adventure", "short_break", "romantic"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            <span className="text-sm">Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <span className="text-sm">Featured</span>
          </label>
        </div>
      </div>

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="fr">Français</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-3">
          <div>
            <Label>Title (EN) *</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
          </div>
          <div>
            <Label>Description (EN)</Label>
            <Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Program / Itinerary (EN)</Label>
            <Textarea value={programEn} onChange={(e) => setProgramEn(e.target.value)} rows={6} />
          </div>
          <div>
            <Label>Highlights (EN)</Label>
            <Textarea value={highlightsEn} onChange={(e) => setHighlightsEn(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Inclusions (EN)</Label>
            <Textarea value={inclusionsEn} onChange={(e) => setInclusionsEn(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Exclusions (EN)</Label>
            <Textarea value={exclusionsEn} onChange={(e) => setExclusionsEn(e.target.value)} rows={4} />
          </div>
        </TabsContent>
        <TabsContent value="fr" className="space-y-3">
          <div>
            <Label>Title (FR)</Label>
            <Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} />
          </div>
          <div>
            <Label>Description (FR)</Label>
            <Textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Program / Itinerary (FR)</Label>
            <Textarea value={programFr} onChange={(e) => setProgramFr(e.target.value)} rows={6} />
          </div>
          <div>
            <Label>Highlights (FR)</Label>
            <Textarea value={highlightsFr} onChange={(e) => setHighlightsFr(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Inclusions (FR)</Label>
            <Textarea value={inclusionsFr} onChange={(e) => setInclusionsFr(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Exclusions (FR)</Label>
            <Textarea value={exclusionsFr} onChange={(e) => setExclusionsFr(e.target.value)} rows={4} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button type="submit" className="bg-[#A91D2D] hover:bg-[#8a1824] text-white">
          <Save className="h-4 w-4 mr-2" /> {isEdit ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Cities Manager ───
function CitiesManager() {
  const { data: cities, refetch } = trpc.cities.list.useQuery();
  const deleteMutation = trpc.cities.delete.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">Cities / Destinations</h1>
        <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4 mr-2" /> Add City
        </Button>
      </div>

      {editing && (
        <CityForm city={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); refetch(); }} />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Name</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Slug</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Status</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Actions</th></tr>
          </thead>
          <tbody>
            {cities?.map((c) => (
              <tr key={c.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{c.slug}</td>
                <td className="px-4 py-3 text-[#6B7280]">{c.slug}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${c.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{c.active ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => { if (confirm("Delete this city?")) deleteMutation.mutate({ id: c.id }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CityForm({ city, onCancel, onSaved }: { city: any; onCancel: () => void; onSaved: () => void }) {
  const isEdit = !!city.id;
  const [slug, setSlug] = useState(city.slug || "");
  const [active, setActive] = useState(city.active !== undefined ? city.active : true);
  const [nameEn, setNameEn] = useState(city.translations?.find((t: any) => t.locale === "en")?.name || "");
  const [nameFr, setNameFr] = useState(city.translations?.find((t: any) => t.locale === "fr")?.name || "");
  const [descEn, setDescEn] = useState(city.translations?.find((t: any) => t.locale === "en")?.description || "");
  const [descFr, setDescFr] = useState(city.translations?.find((t: any) => t.locale === "fr")?.description || "");

  const createMutation = trpc.cities.create.useMutation({ onSuccess: onSaved });
  const updateMutation = trpc.cities.update.useMutation({ onSuccess: onSaved });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      slug,
      active,
      translations: [
        { locale: "en" as const, name: nameEn, description: descEn },
        { locale: "fr" as const, name: nameFr || nameEn, description: descFr || descEn },
      ],
      gallery: [],
    };
    if (isEdit) {
      updateMutation.mutate({ id: city.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-lg">{isEdit ? "Edit City" : "Add New City"}</h3>
      <div>
        <Label>Slug *</Label>
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        <span className="text-sm">Active</span>
      </div>
      <Tabs defaultValue="en">
        <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="fr">Français</TabsTrigger></TabsList>
        <TabsContent value="en" className="space-y-3">
          <div><Label>Name (EN) *</Label><Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} required /></div>
          <div><Label>Description (EN)</Label><Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={3} /></div>
        </TabsContent>
        <TabsContent value="fr" className="space-y-3">
          <div><Label>Name (FR)</Label><Input value={nameFr} onChange={(e) => setNameFr(e.target.value)} /></div>
          <div><Label>Description (FR)</Label><Textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={3} /></div>
        </TabsContent>
      </Tabs>
      <div className="flex gap-3">
        <Button type="submit" className="bg-[#A91D2D] hover:bg-[#8a1824] text-white"><Save className="h-4 w-4 mr-2" /> {isEdit ? "Update" : "Create"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Excursions Manager ───
function ExcursionsManager() {
  const { data: excursions, refetch } = trpc.excursions.list.useQuery();
  const deleteMutation = trpc.excursions.delete.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">Excursions</h1>
        <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4 mr-2" /> Add Excursion
        </Button>
      </div>
      {editing && (
        <ExcursionForm excursion={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); refetch(); }} />
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Slug</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Duration</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Status</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Actions</th></tr>
          </thead>
          <tbody>
            {excursions?.map((e) => (
              <tr key={e.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{e.slug}</td>
                <td className="px-4 py-3 text-[#6B7280]">{e.duration || "-"}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${e.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{e.active ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditing(e)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: e.id }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExcursionForm({ excursion, onCancel, onSaved }: { excursion: any; onCancel: () => void; onSaved: () => void }) {
  const isEdit = !!excursion.id;
  const [slug, setSlug] = useState(excursion.slug || "");
  const [duration, setDuration] = useState(excursion.duration || "");
  const [active, setActive] = useState(excursion.active !== undefined ? excursion.active : true);
  const [titleEn, setTitleEn] = useState(excursion.translations?.find((t: any) => t.locale === "en")?.title || "");
  const [titleFr, setTitleFr] = useState(excursion.translations?.find((t: any) => t.locale === "fr")?.title || "");
  const [descEn, setDescEn] = useState(excursion.translations?.find((t: any) => t.locale === "en")?.description || "");
  const [descFr, setDescFr] = useState(excursion.translations?.find((t: any) => t.locale === "fr")?.description || "");

  const createMutation = trpc.excursions.create.useMutation({ onSuccess: onSaved });
  const updateMutation = trpc.excursions.update.useMutation({ onSuccess: onSaved });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { slug, duration, active, translations: [{ locale: "en" as const, title: titleEn, description: descEn }, { locale: "fr" as const, title: titleFr || titleEn, description: descFr || descEn }] };
    if (isEdit) updateMutation.mutate({ id: excursion.id, ...data });
    else createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-lg">{isEdit ? "Edit Excursion" : "Add New Excursion"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Slug *</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} required /></div>
        <div><Label>Duration</Label><Input value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
      </div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /><span className="text-sm">Active</span></div>
      <Tabs defaultValue="en">
        <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="fr">Français</TabsTrigger></TabsList>
        <TabsContent value="en" className="space-y-3">
          <div><Label>Title (EN) *</Label><Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required /></div>
          <div><Label>Description (EN)</Label><Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={3} /></div>
        </TabsContent>
        <TabsContent value="fr" className="space-y-3">
          <div><Label>Title (FR)</Label><Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} /></div>
          <div><Label>Description (FR)</Label><Textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={3} /></div>
        </TabsContent>
      </Tabs>
      <div className="flex gap-3">
        <Button type="submit" className="bg-[#A91D2D] hover:bg-[#8a1824] text-white"><Save className="h-4 w-4 mr-2" /> {isEdit ? "Update" : "Create"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Blog Manager ───
function BlogManager() {
  const { data: posts, refetch } = trpc.blog.list.useQuery();
  const deleteMutation = trpc.blog.delete.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">Blog Posts</h1>
        <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4 mr-2" /> Add Post
        </Button>
      </div>
      {editing && (
        <BlogForm post={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); refetch(); }} />
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Slug</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Category</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Status</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Actions</th></tr>
          </thead>
          <tbody>
            {posts?.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{p.slug}</td>
                <td className="px-4 py-3 text-[#6B7280]">{p.category || "-"}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: p.id }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlogForm({ post, onCancel, onSaved }: { post: any; onCancel: () => void; onSaved: () => void }) {
  const isEdit = !!post.id;
  const [slug, setSlug] = useState(post.slug || "");
  const [category, setCategory] = useState(post.category || "");
  const [status, setStatus] = useState(post.status || "draft");
  const [titleEn, setTitleEn] = useState(post.translations?.find((t: any) => t.locale === "en")?.title || "");
  const [titleFr, setTitleFr] = useState(post.translations?.find((t: any) => t.locale === "fr")?.title || "");
  const [contentEn, setContentEn] = useState(post.translations?.find((t: any) => t.locale === "en")?.content || "");
  const [contentFr, setContentFr] = useState(post.translations?.find((t: any) => t.locale === "fr")?.content || "");

  const createMutation = trpc.blog.create.useMutation({ onSuccess: onSaved });
  const updateMutation = trpc.blog.update.useMutation({ onSuccess: onSaved });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { slug, category, status, translations: [{ locale: "en" as const, title: titleEn, content: contentEn }, { locale: "fr" as const, title: titleFr || titleEn, content: contentFr || contentEn }] };
    if (isEdit) updateMutation.mutate({ id: post.id, ...data });
    else createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-lg">{isEdit ? "Edit Post" : "Add New Post"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Slug *</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} required /></div>
        <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} /></div>
      </div>
      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="en">
        <TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="fr">Français</TabsTrigger></TabsList>
        <TabsContent value="en" className="space-y-3">
          <div><Label>Title (EN) *</Label><Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required /></div>
          <div><Label>Content (EN)</Label><Textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={8} /></div>
        </TabsContent>
        <TabsContent value="fr" className="space-y-3">
          <div><Label>Title (FR)</Label><Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} /></div>
          <div><Label>Content (FR)</Label><Textarea value={contentFr} onChange={(e) => setContentFr(e.target.value)} rows={8} /></div>
        </TabsContent>
      </Tabs>
      <div className="flex gap-3">
        <Button type="submit" className="bg-[#A91D2D] hover:bg-[#8a1824] text-white"><Save className="h-4 w-4 mr-2" /> {isEdit ? "Update" : "Create"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Media Manager ───
function MediaManager() {
  const { data: mediaData, refetch } = trpc.media.list.useQuery();
  const deleteMutation = trpc.media.delete.useMutation({ onSuccess: () => refetch() });
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    try {
      await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
      refetch();
    } catch (err) {
      console.error("Upload failed", err);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">Media Gallery</h1>
        <div>
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" id="media-upload" />
          <label htmlFor="media-upload">
            <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full" asChild>
              <span><Plus className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Upload Images"}</span>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {mediaData?.map((m) => (
          <div key={m.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group relative">
            <img src={m.path} alt={m.originalName} className="w-full h-32 object-cover" />
            <div className="p-2">
              <p className="text-xs truncate">{m.originalName}</p>
              <p className="text-xs text-[#6B7280]">{((m.size ?? 0) / 1024).toFixed(1)} KB</p>
            </div>
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" onClick={() => { if (confirm("Delete this image?")) deleteMutation.mutate({ id: m.id }); }}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Manager ───
function SettingsManager() {
  const { data: settings, refetch } = trpc.settings.getAll.useQuery();
  const setMutation = trpc.settings.set.useMutation({ onSuccess: () => refetch() });
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSave = (key: string, value: string) => {
    const s = settings?.find((x) => x.key === key);
    setMutation.mutate({ key, value, group: s?.group || "general" });
  };

  const getValue = (key: string) => {
    if (values[key] !== undefined) return values[key];
    return settings?.find((s) => s.key === key)?.value || "";
  };

  const groups = ["general", "home", "social", "seo", "pixels"];
  const groupLabels: Record<string, string> = { general: "General", home: "Homepage", social: "Social Media", seo: "SEO", pixels: "Tracking Pixels" };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2937]">Site Settings</h1>

      {groups.map((group) => {
        const groupSettings = settings?.filter((s) => s.group === group) || [];
        if (groupSettings.length === 0) return null;
        return (
          <div key={group} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-[#1F2937] mb-4">{groupLabels[group] || group}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {groupSettings.map((s) => (
                <div key={s.key}>
                  <Label className="text-xs uppercase tracking-wider text-[#6B7280]">{s.key.replace(/_/g, " ")}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={getValue(s.key)}
                      onChange={(e) => setValues((prev) => ({ ...prev, [s.key]: e.target.value }))}
                      className="text-sm"
                    />
                    <Button size="sm" className="bg-[#A91D2D] hover:bg-[#8a1824] text-white shrink-0" onClick={() => handleSave(s.key, getValue(s.key))}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SEO Manager ───
function SeoManager() {
  const { data: seoData } = trpc.seo.sitemap.useQuery();
  const [path, setPath] = useState("/");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const setSeo = trpc.seo.set.useMutation();

  const handleSaveSeo = () => {
    setSeo.mutate({ path, metaTitle, metaDescription });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2937]">SEO & Tracking</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-[#1F2937] mb-4">Page SEO</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Path</Label><Input value={path} onChange={(e) => setPath(e.target.value)} placeholder="e.g. /circuits" /></div>
          <div><Label>Meta Title</Label><Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Meta Description</Label><Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} /></div>
        </div>
        <Button className="mt-4 bg-[#A91D2D] hover:bg-[#8a1824] text-white" onClick={handleSaveSeo}>
          <Save className="h-4 w-4 mr-2" /> Save SEO Settings
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-[#1F2937] mb-4">Sitemap URLs ({seoData?.length ?? 0})</h2>
        <div className="max-h-96 overflow-y-auto space-y-1">
          {seoData?.map((u, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              <span className="truncate">{u.url}</span>
              <span className="text-[#6B7280] shrink-0">{u.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Contacts Manager ───
function formatRequestDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function DetailField({ label, value, className = "" }: { label: string; value: unknown; className?: string }) {
  const displayValue = value === null || value === undefined || value === "" ? "-" : String(value);
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">{label}</p>
      <p className="text-sm text-[#1F2937] whitespace-pre-wrap break-words">{displayValue}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${status === "new" ? "bg-amber-100 text-amber-800" : status === "treated" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function ContactsManager() {
  const { data: contacts, refetch } = trpc.forms.listContacts.useQuery();
  const updateStatus = trpc.forms.updateContactStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2937]">Contact Requests</h1>
      <div className="space-y-4">
        {contacts?.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#1F2937]">{c.name}</h2>
                <p className="text-sm text-[#6B7280]">{c.email}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailField label="Name" value={c.name} />
              <DetailField label="Email" value={c.email} />
              <DetailField label="Phone" value={c.phone} />
              <DetailField label="Subject" value={c.subject} />
              <DetailField label="Created At" value={formatRequestDate(c.createdAt)} />
              <DetailField label="Status" value={c.status} />
              <DetailField label="Message" value={c.message} className="sm:col-span-2 lg:col-span-3" />
            </div>
            <div className="flex flex-wrap gap-1">
              {["new", "treated", "archived"].map((s) => (
                <Button key={s} variant="ghost" size="sm" className={`h-7 text-xs ${c.status === s ? "bg-gray-100" : ""}`} onClick={() => updateStatus.mutate({ id: c.id, status: s as any })}>{s}</Button>
              ))}
            </div>
          </div>
        ))}
        {(contacts?.length ?? 0) === 0 && <p className="text-sm text-[#6B7280]">No contact requests yet.</p>}
      </div>
    </div>
  );
}

// ─── Quotes Manager ───
function QuotesManager() {
  const { data: quotes, refetch } = trpc.forms.listQuotes.useQuery();
  const updateStatus = trpc.forms.updateQuoteStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2937]">Quote Requests</h1>
      <div className="space-y-4">
        {quotes?.map((q) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#1F2937]">{q.agencyName || q.contactPerson || "Quote Request"}</h2>
                <p className="text-sm text-[#6B7280]">{q.email}</p>
              </div>
              <StatusBadge status={q.status} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailField label="Agency Name" value={q.agencyName} />
              <DetailField label="Contact Person" value={q.contactPerson} />
              <DetailField label="Email" value={q.email} />
              <DetailField label="WhatsApp" value={q.whatsapp} />
              <DetailField label="Country" value={q.country} />
              <DetailField label="Travel Type" value={q.travelType} />
              <DetailField label="Dates" value={q.dates} />
              <DetailField label="Duration" value={q.duration} />
              <DetailField label="Adults" value={q.adults} />
              <DetailField label="Children" value={q.children} />
              <DetailField label="Preferred Destinations" value={q.preferredDestinations} />
              <DetailField label="Preferred Circuit" value={q.preferredCircuit} />
              <DetailField label="Hotel Category" value={q.hotelCategory} />
              <DetailField label="Transport Type" value={q.transportType} />
              <DetailField label="Guide Language" value={q.guideLanguage} />
              <DetailField label="Budget Range" value={q.budgetRange} />
              <DetailField label="Created At" value={formatRequestDate(q.createdAt)} />
              <DetailField label="Status" value={q.status} />
              <DetailField label="Special Requests" value={q.specialRequests} className="sm:col-span-2 lg:col-span-3" />
            </div>
            <div className="flex flex-wrap gap-1">
              {["new", "treated", "archived"].map((s) => (
                <Button key={s} variant="ghost" size="sm" className={`h-7 text-xs ${q.status === s ? "bg-gray-100" : ""}`} onClick={() => updateStatus.mutate({ id: q.id, status: s as any })}>{s}</Button>
              ))}
            </div>
          </div>
        ))}
        {(quotes?.length ?? 0) === 0 && <p className="text-sm text-[#6B7280]">No quote requests yet.</p>}
      </div>
    </div>
  );
}

function PartnersManager() {
  const { data: partners, refetch } = trpc.forms.listPartners.useQuery();
  const updateStatus = trpc.forms.updatePartnerStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2937]">B2B Partner Requests</h1>
      <div className="space-y-4">
        {partners?.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#1F2937]">{p.agencyName}</h2>
                <p className="text-sm text-[#6B7280]">{p.email}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailField label="Agency Name" value={p.agencyName} />
              <DetailField label="Country" value={p.country} />
              <DetailField label="Website" value={p.website} />
              <DetailField label="Contact Person" value={p.contactPerson} />
              <DetailField label="Email" value={p.email} />
              <DetailField label="WhatsApp" value={p.whatsapp} />
              <DetailField label="Business Type" value={p.businessType} />
              <DetailField label="Expected Volume" value={p.expectedVolume} />
              <DetailField label="Created At" value={formatRequestDate(p.createdAt)} />
              <DetailField label="Status" value={p.status} />
            </div>
            <div className="flex flex-wrap gap-1">
              {["new", "treated", "archived"].map((s) => (
                <Button key={s} variant="ghost" size="sm" className={`h-7 text-xs ${p.status === s ? "bg-gray-100" : ""}`} onClick={() => updateStatus.mutate({ id: p.id, status: s as any })}>{s}</Button>
              ))}
            </div>
          </div>
        ))}
        {(partners?.length ?? 0) === 0 && <p className="text-sm text-[#6B7280]">No B2B partner requests yet.</p>}
      </div>
    </div>
  );
}

// ─── Admins Manager ───
function AdminsManager() {
  const { admin } = useAuth();
  const { data: admins, refetch } = trpc.adminAuth.list.useQuery();
  const createMutation = trpc.adminAuth.create.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.adminAuth.delete.useMutation({ onSuccess: () => refetch() });
  const changePassword = trpc.adminAuth.changePassword.useMutation();
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", name: "", role: "editor" as const });
  const [passwords, setPasswords] = useState({ current: "", new: "" });

  if (admin?.role !== "super_admin") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">My Account</h1>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-md">
          <h2 className="font-semibold mb-4">Change Password</h2>
          <div className="space-y-3">
            <div><Label>Current Password</Label><Input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} /></div>
            <div><Label>New Password</Label><Input type="password" value={passwords.new} onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))} /></div>
            <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white" onClick={() => changePassword.mutate({ currentPassword: passwords.current, newPassword: passwords.new })}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2937]">Admin Management</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-4">Add New Admin</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Name *</Label><Input value={newAdmin.name} onChange={(e) => setNewAdmin((n) => ({ ...n, name: e.target.value }))} /></div>
          <div><Label>Email *</Label><Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin((n) => ({ ...n, email: e.target.value }))} /></div>
          <div><Label>Password *</Label><Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin((n) => ({ ...n, password: e.target.value }))} /></div>
          <div>
            <Label>Role</Label>
            <Select value={newAdmin.role} onValueChange={(v: any) => setNewAdmin((n) => ({ ...n, role: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-4 bg-[#A91D2D] hover:bg-[#8a1824] text-white" onClick={() => { createMutation.mutate(newAdmin); setNewAdmin({ email: "", password: "", name: "", role: "editor" }); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Admin
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-4">Change My Password</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-md">
          <div><Label>Current Password</Label><Input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} /></div>
          <div><Label>New Password</Label><Input type="password" value={passwords.new} onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))} /></div>
        </div>
        <Button className="mt-4 bg-[#A91D2D] hover:bg-[#8a1824] text-white" onClick={() => changePassword.mutate({ currentPassword: passwords.current, newPassword: passwords.new })}>
          Change Password
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Name</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Email</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Role</th><th className="px-4 py-3 text-left font-medium text-[#6B7280]">Actions</th></tr>
          </thead>
          <tbody>
            {admins?.map((a) => (
              <tr key={a.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-[#1F2937]">{a.name}</td>
                <td className="px-4 py-3 text-[#6B7280]">{a.email}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${a.role === "super_admin" ? "bg-purple-100 text-purple-800" : a.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>{a.role}</span></td>
                <td className="px-4 py-3">
                  {a.role !== "super_admin" && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => { if (confirm("Delete this admin?")) deleteMutation.mutate({ id: a.id }); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
