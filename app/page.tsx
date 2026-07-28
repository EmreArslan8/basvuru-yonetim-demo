"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  TrendingUp,
  UploadCloud,
  UserRound,
  Users,
  Waypoints,
  X,
} from "lucide-react";

type Role = "candidate" | "reviewer" | "admin";
type Candidate = {
  id: string;
  name: string;
  initials: string;
  program: string;
  date: string;
  score: number;
  status: "İncelemede" | "Revize Bekliyor" | "Üst Onayda" | "Kabul Edildi";
  color: string;
};

const initialCandidates: Candidate[] = [
  { id: "B-2026-0184", name: "Defne Kaya", initials: "DK", program: "Gelecek Liderleri Bursu", date: "28 Tem, 14:32", score: 92, status: "İncelemede", color: "#dce7ff" },
  { id: "B-2026-0183", name: "Mert Aydın", initials: "MA", program: "Gelecek Liderleri Bursu", date: "28 Tem, 13:18", score: 87, status: "Revize Bekliyor", color: "#fce4c9" },
  { id: "B-2026-0181", name: "Selin Yılmaz", initials: "SY", program: "Genç Yetenek Programı", date: "28 Tem, 11:06", score: 95, status: "Üst Onayda", color: "#e5dcff" },
  { id: "B-2026-0179", name: "Can Eren", initials: "CE", program: "Gelecek Liderleri Bursu", date: "27 Tem, 17:42", score: 81, status: "Kabul Edildi", color: "#d8f4e7" },
];

const statusTone: Record<Candidate["status"], string> = {
  "İncelemede": "blue",
  "Revize Bekliyor": "orange",
  "Üst Onayda": "purple",
  "Kabul Edildi": "green",
};

export default function Home() {
  const [role, setRole] = useState<Role>("reviewer");
  const [activeNav, setActiveNav] = useState("Başvurular");
  const [selected, setSelected] = useState<Candidate>(initialCandidates[0]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [uploaded, setUploaded] = useState<string[]>(["transkript.pdf"]);
  const [applicationSent, setApplicationSent] = useState(false);
  const [candidateData, setCandidateData] = useState<Candidate[]>(initialCandidates);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = useMemo(
    () => candidateData.filter((c) => `${c.name} ${c.id} ${c.program}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))),
    [candidateData, query],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem("applyflow-demo");
    if (!saved) return;
    const timer = window.setTimeout(() => {
      try {
        const state = JSON.parse(saved);
        if (Array.isArray(state.candidates)) setCandidateData(state.candidates);
        if (typeof state.applicationSent === "boolean") setApplicationSent(state.applicationSent);
        if (Array.isArray(state.uploaded)) setUploaded(state.uploaded);
      } catch {
        window.localStorage.removeItem("applyflow-demo");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("applyflow-demo", JSON.stringify({ candidates: candidateData, applicationSent, uploaded }));
  }, [candidateData, applicationSent, uploaded]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function chooseRole(next: Role) {
    setRole(next);
    setActiveNav(next === "candidate" ? "Başvurum" : next === "reviewer" ? "Başvurular" : "Genel Bakış");
    setMobileMenu(false);
  }

  function updateCandidate(id: string, status: Candidate["status"]) {
    setCandidateData((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setSelected((item) => item.id === id ? { ...item, status } : item);
  }

  function downloadCSV() {
    const rows = [
      ["Başvuru No", "Aday", "Program", "Puan", "Durum"],
      ...candidateData.map((c) => [c.id, c.name, c.program, String(c.score), c.status]),
    ];
    const csv = "\uFEFF" + rows.map((r) => r.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "basvurular.csv";
    link.click();
    URL.revokeObjectURL(url);
    flash("Başvurular CSV olarak indirildi.");
  }

  const nav =
    role === "candidate"
      ? ["Başvurum", "Belgelerim", "Mesajlar", "Yardım"]
      : role === "reviewer"
        ? ["Başvurular", "Görevlerim", "Mesajlar", "Raporlar"]
        : ["Genel Bakış", "İlanlar", "Başvurular", "Ekip & Roller", "Raporlar"];

  return (
    <main className="app-shell">
      {notice && <div className="toast"><span>✓</span>{notice}</div>}

      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Waypoints size={18} /></div>
          <div><strong>ApplyFlow</strong><small>Başvuru yönetimi</small></div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Menüyü kapat"><X size={18} /></button>
        </div>
        <div className="workspace">
          <span className="mini-logo"><Building2 size={15} /></span>
          <span><small>Çalışma alanı</small><strong>Vakıf Demo</strong></span>
          <ChevronDown size={14} />
        </div>
        <nav>
          <p>MENÜ</p>
          {nav.map((item) => (
            <button className={activeNav === item ? "active" : ""} key={item} onClick={() => { setActiveNav(item); setMobileMenu(false); }}>
              <span className="nav-icon"><NavIcon item={item} /></span>{item}
              {item === "Mesajlar" && <em>2</em>}
            </button>
          ))}
        </nav>
        <div className="support">
          <div className="support-icon"><CircleHelp size={15} /></div>
          <strong>Yardıma mı ihtiyacınız var?</strong>
          <p>Destek ekibimiz size yardımcı olsun.</p>
          <button onClick={() => flash("Destek talebiniz oluşturuldu.")}>Destek alın</button>
        </div>
        <div className="profile">
          <div className="avatar">TK</div>
          <span><strong>Tuğberk Kalaycı</strong><small>Demo hesabı</small></span>
          <MoreHorizontal size={16} />
        </div>
      </aside>

      <section className="content">
        <header>
          <div className="mobile-brand"><button className="mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Menüyü aç"><Menu size={19} /></button><span className="brand-mark"><Waypoints size={17} /></span><strong>ApplyFlow</strong></div>
          <div className="role-switch" aria-label="Demo rolü seçimi">
            <button className={role === "candidate" ? "selected" : ""} onClick={() => chooseRole("candidate")}>Aday</button>
            <button className={role === "reviewer" ? "selected" : ""} onClick={() => chooseRole("reviewer")}>Moderatör</button>
            <button className={role === "admin" ? "selected" : ""} onClick={() => chooseRole("admin")}>Admin</button>
          </div>
          <div className="header-actions">
            <button className="icon-button" aria-label="Bildirimler" onClick={() => flash("2 yeni bildiriminiz var.")}><Bell size={18} /><i /></button>
            <span className="avatar small">TK</span>
          </div>
        </header>

        {role === "candidate" && (
          <CandidatePortal
            uploaded={uploaded}
            onUpload={(name) => { setUploaded((items) => [...items, name]); flash(`${name} belge listesine eklendi.`); }}
            sent={applicationSent}
            onSend={() => { setApplicationSent(true); flash("Başvurunuz başarıyla gönderildi."); }}
          />
        )}
        {role === "reviewer" && (
          <ReviewerPanel
            candidates={filtered}
            selected={selected}
            query={query}
            setQuery={setQuery}
            onSelect={setSelected}
            onAction={(message) => flash(message)}
            onStatusChange={updateCandidate}
          />
        )}
        {role === "admin" && <AdminPanel onExport={downloadCSV} onAction={flash} candidateCount={candidateData.length} />}
      </section>
      {mobileMenu && <button className="menu-overlay" aria-label="Menüyü kapat" onClick={() => setMobileMenu(false)} />}
    </main>
  );
}

function PageTitle({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="page-title">
      <div><p>{eyebrow}</p><h1>{title}</h1><span>{text}</span></div>
      {children}
    </div>
  );
}

function CandidatePortal({ uploaded, onUpload, sent, onSend }: { uploaded: string[]; onUpload: (name: string) => void; sent: boolean; onSend: () => void }) {
  return (
    <div className="page">
      <PageTitle eyebrow="ADAY PORTALI" title="Gelecek Liderleri Bursu" text="Başvurunuzu 31 Temmuz 2026, 23:59’a kadar tamamlayabilirsiniz.">
        <span className={`status-pill ${sent ? "green" : "orange"}`}><i />{sent ? "İncelemede" : "%75 tamamlandı"}</span>
      </PageTitle>
      <div className="steps">
        {["Kişisel Bilgiler", "Eğitim", "Belgeler", "Önizleme"].map((step, i) => (
          <div className={i < 2 ? "done" : i === 2 ? "current" : ""} key={step}><b>{i < 2 ? <Check size={12} /> : i + 1}</b><span>{step}</span></div>
        ))}
      </div>
      <div className="candidate-grid">
        <section className="card upload-card">
          <div className="card-head"><div><p>3. ADIM</p><h2>Belgelerinizi yükleyin</h2></div><span>Zorunlu alanlar *</span></div>
          <label className="dropzone">
            <input type="file" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0].name)} />
            <b><UploadCloud size={17} /></b><strong>Dosyayı buraya sürükleyin</strong><span>veya bilgisayarınızdan seçin</span><small>PDF veya JPG · En fazla 10 MB</small>
          </label>
          <div className="file-list">
            {uploaded.map((file, index) => <div key={`${file}-${index}`}><span className="file-icon"><FileText size={14} /></span><p><strong>{file}</strong><small>{index ? "Yeni yüklendi" : "1,8 MB · Yüklendi"}</small></p><b><CheckCircle2 size={15} /></b></div>)}
          </div>
          <label className="field"><span>Niyet mektubu *</span><textarea defaultValue="Bu programa başvurma motivasyonum; analitik düşünme yetkinliğimi toplumsal fayda üreten projelerde kullanmak ve..." /></label>
          <div className="form-actions"><button className="secondary"><ClipboardCheck size={14} /> Taslak olarak kaydet</button><button className="primary" onClick={onSend} disabled={sent}>{sent ? <><CheckCircle2 size={14} /> Başvuru gönderildi</> : <>Önizlemeye geç <ArrowRight size={14} /></>}</button></div>
        </section>
        <aside className="card summary-card">
          <p>BAŞVURU ÖZETİ</p><h3>Tamamlanma durumu</h3>
          <div className="progress-ring"><strong>{sent ? "100" : "75"}<small>%</small></strong></div>
          {["Kişisel bilgiler", "Eğitim bilgileri", "Belgeler", "Başvuru onayı"].map((item, i) => <div className="check-row" key={item}><b className={i < (sent ? 4 : 2) ? "checked" : ""}>{i < (sent ? 4 : 2) ? <Check size={11} /> : i + 1}</b><span>{item}</span></div>)}
          <div className="info-box"><b><ShieldCheck size={15} /></b><p><strong>Başvurunuz güvende</strong>Taslağınız otomatik kaydedilir. Daha sonra kaldığınız yerden devam edebilirsiniz.</p></div>
        </aside>
      </div>
    </div>
  );
}

function ReviewerPanel({ candidates, selected, query, setQuery, onSelect, onAction, onStatusChange }: { candidates: Candidate[]; selected: Candidate; query: string; setQuery: (v: string) => void; onSelect: (c: Candidate) => void; onAction: (m: string) => void; onStatusChange: (id: string, status: Candidate["status"]) => void }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [detailTab, setDetailTab] = useState("Genel Bilgiler");
  const [documentOpen, setDocumentOpen] = useState("");
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [note, setNote] = useState("");
  const visibleCandidates = statusFilter === "Tümü" ? candidates : candidates.filter((item) => item.status === statusFilter);

  function requestRevision() {
    if (!note.trim()) {
      onAction("Revize talebi için kısa bir açıklama ekleyin.");
      return;
    }
    onStatusChange(selected.id, "Revize Bekliyor");
    setRevisionOpen(false);
    onAction(`${selected.name} için revize talebi gönderildi.`);
  }

  function sendApproval() {
    onStatusChange(selected.id, "Üst Onayda");
    onAction(`${selected.name} üst onaya gönderildi.`);
  }

  return (
    <div className="page">
      <PageTitle eyebrow="MODERASYON" title="Başvurular" text="Size atanan başvuruları inceleyin ve değerlendirin.">
        <div className="filter-wrap">
          <button className="secondary filter-button" onClick={() => setFilterOpen(!filterOpen)}><Filter size={14} /> Filtrele {statusFilter !== "Tümü" && <span>1</span>}</button>
          {filterOpen && <div className="filter-menu">
            <strong>Duruma göre filtrele</strong>
            {["Tümü", "İncelemede", "Revize Bekliyor", "Üst Onayda", "Kabul Edildi"].map((status) => <button className={statusFilter === status ? "active" : ""} key={status} onClick={() => { setStatusFilter(status); setFilterOpen(false); }}>{statusFilter === status && <Check size={12} />}{status}</button>)}
          </div>}
        </div>
      </PageTitle>
      <div className="metrics">
        <Metric value="24" label="İnceleme bekliyor" detail="+6 bugün" tone="blue" />
        <Metric value="8" label="Revize bekliyor" detail="3 süresi yaklaşıyor" tone="orange" />
        <Metric value="41" label="Tamamlanan" detail="Bu hafta" tone="green" />
        <Metric value="1,8 gün" label="Ort. inceleme" detail="Hedef: 2 gün" tone="purple" />
      </div>
      <div className="review-grid">
        <section className="card list-card">
          <div className="search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Aday veya başvuru no ara..." /></div>
          <div className="list-label"><span>SON BAŞVURULAR</span><b>{visibleCandidates.length} kayıt</b></div>
          {visibleCandidates.map((candidate) => (
            <button className={`candidate-row ${selected.id === candidate.id ? "selected" : ""}`} onClick={() => { onSelect(candidate); setDetailTab("Genel Bilgiler"); }} key={candidate.id}>
              <span className="avatar candidate-avatar" style={{ background: candidate.color }}>{candidate.initials}</span>
              <span className="candidate-main"><strong>{candidate.name}</strong><small>{candidate.program}</small><em>{candidate.id} · {candidate.date}</em></span>
              <span className={`status-pill ${statusTone[candidate.status]}`}><i />{candidate.status}</span>
            </button>
          ))}
          {!visibleCandidates.length && <div className="empty">Filtreyle eşleşen başvuru bulunamadı.</div>}
        </section>
        <section className="card detail-card">
          <div className="detail-head">
            <span className="avatar large" style={{ background: selected.color }}>{selected.initials}</span>
            <div><p>{selected.id}</p><h2>{selected.name}</h2><span>{selected.program}</span></div>
            <span className={`status-pill ${statusTone[selected.status]}`}><i />{selected.status}</span>
          </div>
          <div className="score-line"><span>Uygunluk puanı <b>{selected.score}/100</b></span><div><i style={{ width: `${selected.score}%` }} /></div></div>
          <div className="detail-tabs">{["Genel Bilgiler", "Belgeler", "Değerlendirme"].map((tab) => <button className={detailTab === tab ? "active" : ""} key={tab} onClick={() => setDetailTab(tab)}>{tab}{tab === "Belgeler" && <span>2</span>}</button>)}</div>
          {detailTab === "Genel Bilgiler" && <div className="details">
            <Info icon={<Mail size={14} />} label="E-posta" value={`${selected.name.toLocaleLowerCase("tr").replaceAll(" ", ".")}@mail.com`} />
            <Info icon={<UserRound size={14} />} label="Telefon" value="+90 532 555 24 18" />
            <Info icon={<Building2 size={14} />} label="Üniversite" value="Dokuz Eylül Üniversitesi" />
            <Info icon={<GraduationCap size={14} />} label="Bölüm / Not ort." value="Endüstri Mühendisliği · 3,42" />
          </div>}
          {(detailTab === "Genel Bilgiler" || detailTab === "Belgeler") && <>
            <h3 className="section-title">Yüklenen belgeler</h3>
            <div className="document"><span><FileText size={14} /></span><p><strong>transkript.pdf</strong><small>1,8 MB · 28 Tem 2026</small></p><button onClick={() => setDocumentOpen("transkript.pdf")}><Eye size={13} /> Görüntüle</button></div>
            <div className="document"><span><FileText size={14} /></span><p><strong>niyet-mektubu.pdf</strong><small>824 KB · 28 Tem 2026</small></p><button onClick={() => setDocumentOpen("niyet-mektubu.pdf")}><Eye size={13} /> Görüntüle</button></div>
          </>}
          {detailTab === "Değerlendirme" && <div className="evaluation-box"><h3>Değerlendirme özeti</h3><div><span>Akademik başarı</span><b>94/100</b></div><div><span>Program uyumu</span><b>90/100</b></div><div><span>Belge tamlığı</span><b>100/100</b></div></div>}
          <div className="review-note"><label>İnceleme notu</label><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Karar veya revize notunuzu buraya ekleyin..." /></div>
          <div className="decision-actions"><button className="revision" onClick={() => setRevisionOpen(true)}><RotateCcw size={14} /> Revize talep et</button><button className="primary" onClick={sendApproval}><Send size={14} /> Üst onaya gönder</button></div>
        </section>
      </div>
      {documentOpen && <Modal title={documentOpen} onClose={() => setDocumentOpen("")}><div className="document-preview"><FileText size={42} /><strong>Belge önizlemesi</strong><p>Bu demoda belge içeriği güvenli önizleme alanında gösterilir. Gerçek sistemde PDF görüntüleyici burada açılır.</p></div></Modal>}
      {revisionOpen && <Modal title="Revize talebi gönder" onClose={() => setRevisionOpen(false)}><p className="modal-copy">{selected.name} adlı adaydan hangi belge veya bilgiyi düzeltmesini istediğinizi belirtin.</p><textarea className="modal-textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Örn. Transkript belgesinin güncel ve imzalı halini yükleyin." /><div className="modal-actions"><button className="secondary" onClick={() => setRevisionOpen(false)}>Vazgeç</button><button className="primary" onClick={requestRevision}><Send size={14} /> Talebi gönder</button></div></Modal>}
    </div>
  );
}

function AdminPanel({ onExport, onAction, candidateCount }: { onExport: () => void; onAction: (m: string) => void; candidateCount: number }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [programs, setPrograms] = useState([
    ["Gelecek Liderleri Bursu", "624", "31 Tem 2026", "Yayında"],
    ["Genç Yetenek Programı", "418", "12 Ağu 2026", "Yayında"],
    ["Sosyal Etki Gönüllüleri", "242", "18 Ağu 2026", "Yayında"],
  ]);

  function addProgram() {
    if (!newTitle.trim()) {
      onAction("İlan başlığını yazın.");
      return;
    }
    setPrograms((items) => [[newTitle.trim(), "0", "30 Ağu 2026", "Taslak"], ...items]);
    setNewTitle("");
    setCreateOpen(false);
    onAction("Yeni ilan taslağı oluşturuldu.");
  }

  return (
    <div className="page">
      <PageTitle eyebrow="YÖNETİM PANELİ" title="Genel Bakış" text="Başvuru süreçlerinin güncel özeti ve hızlı işlemler.">
        <div className="title-actions"><button className="secondary" onClick={onExport}><Download size={14} /> CSV indir</button><button className="primary" onClick={() => setCreateOpen(true)}><Plus size={14} /> Yeni ilan oluştur</button></div>
      </PageTitle>
      <div className="metrics admin-metrics">
        <Metric value={candidateCount > 4 ? String(candidateCount) : "1.284"} label="Toplam başvuru" detail="%12 geçen aya göre" tone="blue" />
        <Metric value="247" label="İncelemede" detail="24 görev bekliyor" tone="orange" />
        <Metric value="186" label="Kabul edildi" detail="%14,5 kabul oranı" tone="green" />
        <Metric value="6" label="Aktif ilan" detail="2 ilan yakında kapanıyor" tone="purple" />
      </div>
      <div className="admin-grid">
        <section className="card chart-card">
          <div className="card-head"><div><p>BAŞVURU TRENDİ</p><h2>Son 7 gün</h2></div><button className="secondary">Bu hafta⌄</button></div>
          <div className="chart">
            {[42, 58, 50, 76, 62, 88, 71].map((v, i) => <div className="bar-wrap" key={i}><div className="bar" style={{ height: `${v}%` }}><span>{Math.round(v * 1.8)}</span></div><small>{["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i]}</small></div>)}
          </div>
        </section>
        <section className="card funnel-card">
          <div className="card-head"><div><p>SÜREÇ DAĞILIMI</p><h2>Başvuru hunisi</h2></div></div>
          {[["Başvuru alındı", "1.284", 100, "blue"], ["Ön inceleme", "847", 72, "purple"], ["Üst onay", "312", 48, "orange"], ["Kabul", "186", 31, "green"]].map(([label, value, width, tone]) => <div className="funnel-row" key={String(label)}><span>{label}<b>{value}</b></span><div><i className={String(tone)} style={{ width: `${width}%` }} /></div></div>)}
        </section>
      </div>
      <section className="card admin-table">
        <div className="card-head"><div><p>AKTİF İLANLAR</p><h2>Yayınlanan programlar</h2></div><button className="link-button">Tümünü görüntüle →</button></div>
        <div className="table-row table-head"><span>İlan</span><span>Başvuru</span><span>Bitiş</span><span>Durum</span><span></span></div>
        {programs.map((row) => <div className="table-row" key={row[0]}><span><strong>{row[0]}</strong><small>Son güncelleme: bugün</small></span><span>{row[1]}</span><span>{row[2]}</span><span><em className={`status-pill ${row[3] === "Taslak" ? "orange" : "green"}`}><i />{row[3]}</em></span><span><button onClick={() => onAction(`${row[0]} ilanı açıldı.`)} aria-label={`${row[0]} işlemleri`}><MoreHorizontal size={15} /></button></span></div>)}
      </section>
      <section className="card approval-card">
        <div><span className="metric-icon purple"><ClipboardCheck size={16} /></span><p><strong>Nihai karar bekleyen 12 başvuru var</strong><small>Moderatör incelemesi tamamlanan adayları değerlendirin.</small></p></div>
        <button className="primary" onClick={() => setDecisionOpen(true)}>Karar ekranını aç <ArrowRight size={14} /></button>
      </section>
      {createOpen && <Modal title="Yeni ilan oluştur" onClose={() => setCreateOpen(false)}>
        <div className="modal-form">
          <label>İlan başlığı<input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Örn. 2026 Teknoloji Bursu" /></label>
          <label>Başvuru bitiş tarihi<input type="date" defaultValue="2026-08-30" /></label>
          <label>Değerlendirme kriteri<select defaultValue="karma"><option value="karma">Akademik başarı + niyet mektubu</option><option value="akademik">Akademik başarı</option><option value="deneyim">Deneyim ve yetkinlik</option></select></label>
        </div>
        <div className="modal-actions"><button className="secondary" onClick={() => setCreateOpen(false)}>Vazgeç</button><button className="primary" onClick={addProgram}><FileCheck2 size={14} /> Taslak oluştur</button></div>
      </Modal>}
      {decisionOpen && <Modal title="Nihai karar" onClose={() => setDecisionOpen(false)}>
        <div className="decision-candidate"><span className="avatar large">SY</span><div><strong>Selin Yılmaz</strong><small>Genç Yetenek Programı · 95/100</small></div></div>
        <div className="decision-summary"><p><CheckCircle2 size={15} /> Belgeler eksiksiz</p><p><CheckCircle2 size={15} /> Moderatör onayı tamamlandı</p><p><TrendingUp size={15} /> Program uygunluk puanı: 95</p></div>
        <div className="modal-actions split"><button className="danger-button" onClick={() => { setDecisionOpen(false); onAction("Başvuru reddedildi ve adaya bildirim hazırlandı."); }}><X size={14} /> Reddet</button><button className="primary" onClick={() => { setDecisionOpen(false); onAction("Başvuru kabul edildi ve bildirim hazırlandı."); }}><Check size={14} /> Kabul et</button></div>
      </Modal>}
    </div>
  );
}

function Metric({ value, label, detail, tone }: { value: string; label: string; detail: string; tone: string }) {
  const Icon = tone === "green" ? CheckCircle2 : tone === "orange" ? Clock3 : tone === "purple" ? TrendingUp : ClipboardList;
  return <div className="card metric"><span className={`metric-icon ${tone}`}><Icon size={16} /></span><div><strong>{value}</strong><p>{label}</p><small>{detail}</small></div></div>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="info"><i>{icon}</i><span>{label}</span><strong>{value}</strong></div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2>{title}</h2><button onClick={onClose} aria-label="Pencereyi kapat"><X size={17} /></button></div>{children}</section></div>;
}

function NavIcon({ item }: { item: string }) {
  const icons: Record<string, React.ComponentType<{ size?: number }>> = {
    "Başvurum": ClipboardCheck,
    "Belgelerim": FileText,
    "Mesajlar": MessageSquare,
    "Yardım": CircleHelp,
    "Başvurular": ClipboardList,
    "Görevlerim": CheckCircle2,
    "Raporlar": BarChart3,
    "Genel Bakış": LayoutDashboard,
    "İlanlar": BriefcaseBusiness,
    "Ekip & Roller": Users,
  };
  const Icon = icons[item] ?? LayoutDashboard;
  return <Icon size={14} />;
}
