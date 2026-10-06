import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Download, Link2, PlayCircle, Search, XCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heading } from './shell';
import { courseChapters, docPages, quizzes, type Quiz } from './data';
import { searchYoutube, type VideoResult } from '@/lib/youtube.functions';

/* ---------- Prévisualisation de document ---------- */
export function DocumentViewer({ title, subject, author, onDownload }: { title: string; subject: string; author: string; onDownload: () => void }) {
  const pages = docPages(title, subject, author);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const p = pages[page]!;
  return <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <Button size="icon" variant="outline" aria-label="Page précédente" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft /></Button>
        <span className="small px-2">Page {page + 1} / {pages.length}</span>
        <Button size="icon" variant="outline" aria-label="Page suivante" disabled={page === pages.length - 1} onClick={() => setPage(page + 1)}><ChevronRight /></Button>
      </div>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" aria-label="Réduire" onClick={() => setZoom(Math.max(70, zoom - 10))}><ZoomOut /></Button>
        <span className="small w-12 text-center">{zoom}%</span>
        <Button size="icon" variant="ghost" aria-label="Agrandir" onClick={() => setZoom(Math.min(150, zoom + 10))}><ZoomIn /></Button>
        <Button size="icon" variant="outline" aria-label="Télécharger" onClick={onDownload}><Download /></Button>
      </div>
    </div>
    <div className="rounded-lg bg-muted p-4 max-h-[60vh] overflow-auto">
      <article className="mx-auto bg-card text-card-foreground shadow-md rounded-sm p-8 aspect-[1/1.414] max-w-[520px]" style={{ fontSize: `${zoom}%` }}>
        <p className="small uppercase tracking-wide text-primary">{subject}</p>
        <h3 className="text-[1.4em] font-bold mt-1 mb-4">{p.heading}</h3>
        {p.body.map((b, i) => <p key={i} className="mb-3 leading-relaxed text-[0.95em]">{b}</p>)}
        <p className="small mt-8 border-t pt-2">{author} · Aperçu de démonstration</p>
      </article>
    </div>
  </div>;
}

/* ---------- Cours par matière ---------- */
export function CourseDetail({ courseId, onBack }: { courseId: number; onBack: () => void }) {
  const course = courseChapters.find(c => c.id === courseId)!;
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const ch = course.chapters[index]!;
  return <div>
    <Button variant="ghost" onClick={onBack} className="mb-3"><ArrowLeft />Toutes les matières</Button>
    <div className="grid gap-5 md:grid-cols-[260px_1fr]">
      <aside className="document-list h-fit">
        {course.chapters.map((c, i) => <button key={c.title} onClick={() => setIndex(i)} className={`document-row text-left w-full ${i === index ? 'ring-2 ring-primary' : ''}`}>
          {done.includes(i) ? <CheckCircle2 size={18} className="text-success shrink-0" /> : <span className="small w-[18px]">{i + 1}</span>}
          <span className="text-sm font-medium">{c.title}</span>
        </button>)}
      </aside>
      <article className="item-card">
        <span className="tag">{course.title} · Chapitre {index + 1}</span>
        <h2>{ch.title}</h2>
        {ch.content.map((p, i) => <p key={i}>{p}</p>)}
        {ch.video && <div className="aspect-video rounded-lg overflow-hidden mt-3"><iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${ch.video}`} title={ch.title} allowFullScreen /></div>}
        <div className="flex justify-between mt-5 gap-2 flex-wrap">
          <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft />Précédent</Button>
          <Button onClick={() => { if (!done.includes(index)) setDone([...done, index]); if (index < course.chapters.length - 1) setIndex(index + 1); }}>
            {index < course.chapters.length - 1 ? <>Terminé, chapitre suivant<ArrowRight /></> : <>Marquer comme terminé<CheckCircle2 /></>}
          </Button>
        </div>
      </article>
    </div>
  </div>;
}

/* ---------- Répondre à une évaluation ---------- */
export function QuizRunner({ quiz, onClose }: { quiz: Quiz; onClose: (score?: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quiz.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  const total = quiz.questions.length;
  return <div>
    <Button variant="ghost" onClick={() => onClose(submitted ? score : undefined)} className="mb-3"><ArrowLeft />Retour aux évaluations</Button>
    <Heading title={quiz.title} subtitle={`${total} questions · QCM · Démonstration`} />
    {submitted && <div className="item-card mb-5"><h2>Résultat : {Math.round(score / total * 20)} / 20</h2><p>{score} bonne(s) réponse(s) sur {total}.</p></div>}
    <div className="flex flex-col gap-4 max-w-3xl">
      {quiz.questions.map((q, i) => <fieldset key={i} className="item-card">
        <legend className="sr-only">Question {i + 1}</legend>
        <h2 className="text-base">{i + 1}. {q.text}</h2>
        <div className="flex flex-col gap-2 mt-2">
          {q.options.map((o, j) => {
            const chosen = answers[i] === j; const correct = submitted && j === q.answer; const wrong = submitted && chosen && j !== q.answer;
            return <label key={j} className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer ${chosen ? 'border-primary' : ''} ${correct ? 'border-success bg-success/10' : ''} ${wrong ? 'border-destructive bg-destructive/10' : ''}`}>
              <input type="radio" name={`q${i}`} checked={chosen} disabled={submitted} onChange={() => setAnswers({ ...answers, [i]: j })} className="accent-[var(--primary)]" />
              <span className="flex-1">{o}</span>{correct && <CheckCircle2 size={18} className="text-success" />}{wrong && <XCircle size={18} className="text-destructive" />}
            </label>;
          })}
        </div>
      </fieldset>)}
      {!submitted ? <Button disabled={Object.keys(answers).length < total} onClick={() => setSubmitted(true)}>Soumettre mes réponses ({Object.keys(answers).length}/{total})</Button>
        : <Button variant="outline" onClick={() => onClose(score)}>Terminer</Button>}
    </div>
  </div>;
}
export { quizzes };

/* ---------- Vidéos YouTube ---------- */
function extractId(v: string) { const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m?.[1] ?? null; }
export function VideosPage() {
  const search = useServerFn(searchYoutube);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState<VideoResult | null>(null);
  async function run(e: React.FormEvent) {
    e.preventDefault(); const value = q.trim(); if (!value) return;
    const id = extractId(value);
    if (id) { setPlaying({ id, title: 'Vidéo YouTube', channel: '', thumbnail: '' }); return; }
    setLoading(true); setError(null);
    try { const r = await search({ data: { q: value } }); setResults(r.results); setError(r.error); } catch { setError('request_failed'); }
    setLoading(false);
  }
  return <div className="page">
    <Heading title="Vidéos" subtitle="Recherchez et regardez des vidéos YouTube sans quitter EMIMood." />
    <form onSubmit={run} className="flex gap-2 mb-5 max-w-xl">
      <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Ex. : jointures SQL, introduction à React… ou collez un lien YouTube" aria-label="Rechercher une vidéo" />
      <Button type="submit" disabled={loading}><Search />{loading ? 'Recherche…' : 'Rechercher'}</Button>
    </form>
    {playing && <div className="item-card mb-6">
      <div className="aspect-video rounded-lg overflow-hidden"><iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1`} title={playing.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
      <h2 className="mt-3" dangerouslySetInnerHTML={{ __html: playing.title }} /><p className="small">{playing.channel}</p>
    </div>}
    {error === 'missing_key' && <p className="empty"><Link2 className="mx-auto mb-2" />La recherche YouTube n’est pas encore activée (clé YouTube à configurer). Vous pouvez déjà coller un lien YouTube pour le regarder ici.</p>}
    {error === 'request_failed' && <p className="empty">La recherche a échoué. Réessayez dans un instant.</p>}
    <div className="content-grid">
      {results.map(v => <button key={v.id} onClick={() => { setPlaying(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="item-card text-left">
        <div className="relative rounded-md overflow-hidden"><img src={v.thumbnail} alt="" className="w-full aspect-video object-cover" loading="lazy" /><PlayCircle className="absolute inset-0 m-auto size-12 text-primary-foreground drop-shadow" /></div>
        <h2 className="text-base line-clamp-2" dangerouslySetInnerHTML={{ __html: v.title }} />
        <p className="small">{v.channel}</p>
      </button>)}
    </div>
  </div>;
}
