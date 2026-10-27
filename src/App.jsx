import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  ExternalLink,
  Menu,
  Plus,
  X,
} from 'lucide-react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { articles, process, projects, services } from './data'

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || ''
const contactPhone = import.meta.env.VITE_CONTACT_PHONE || ''
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || ''
const bookingUrl = import.meta.env.VITE_BOOKING_URL || ''
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || ''
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL || ''

function App() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <ScrollManager />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:slug" element={<ArticlePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function ScrollManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    window.dataLayer?.push({ event: 'page_view', page_path: pathname })
  }, [pathname])
  return null
}

function Seo({ title, description }) {
  useEffect(() => {
    document.title = title
    const setMeta = (key, value, attr = 'name') => {
      let node = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!node) {
        node = document.createElement('meta')
        node.setAttribute(attr, key)
        document.head.appendChild(node)
      }
      node.setAttribute('content', value)
    }
    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    let schema = document.head.querySelector('script[data-eiracorp-schema]')
    if (!schema) {
      schema = document.createElement('script')
      schema.type = 'application/ld+json'
      schema.dataset.eiracorpSchema = 'true'
      document.head.appendChild(schema)
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Eiracorp',
      description,
      areaServed: 'International',
      serviceType: ['Brand strategy', 'Digital marketing', 'Website development', 'Paid advertising'],
    })
  }, [title, description])
  return null
}

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Eiracorp home">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-acid text-[10px] font-bold text-ink transition-transform group-hover:rotate-12">E</span>
      <span className="font-display text-sm font-semibold tracking-[0.19em]">EIRACORP</span>
    </Link>
  )
}

function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  const links = [['/', 'Home'], ['/services', 'Services'], ['/work', 'Our Work'], ['/about', 'About'], ['/insights', 'Insights'], ['/contact', 'Contact']]
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'border-b border-white/8 bg-ink/92 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="page-shell flex h-[76px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'text-acid' : ''}`}>{label}</NavLink>)}
        </nav>
        <div className="hidden lg:block"><ButtonLink to="/contact" compact>Scale your brand</ButtonLink></div>
        <button className="grid h-11 w-11 place-items-center border border-white/15 lg:hidden" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/8 bg-ink lg:hidden">
            <div className="page-shell flex flex-col py-5">
              {links.map(([to, label], i) => <motion.div key={to} initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * .04 }}><NavLink to={to} className="flex items-center justify-between border-b border-white/8 py-4 text-xl">{label}<ChevronRight size={18} /></NavLink></motion.div>)}
              <ButtonLink to="/contact" className="mt-5 justify-center">Scale your brand</ButtonLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function ButtonLink({ to, href, children, secondary = false, compact = false, className = '' }) {
  const cls = `btn ${secondary ? 'btn-secondary' : 'btn-primary'} ${compact ? 'btn-compact' : ''} ${className}`
  const content = <>{children}<ArrowUpRight size={compact ? 15 : 17} /></>
  return href ? <a className={cls} href={href} target="_blank" rel="noreferrer">{content}</a> : <Link className={cls} to={to}>{content}</Link>
}

function Eyebrow({ children }) {
  return <p className="eyebrow"><span />{children}</p>
}

function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .65, delay }}>{children}</motion.div>
}

function Home() {
  return (
    <>
      <Seo title="Eiracorp — Strategy, Creative & Digital Growth" description="Eiracorp helps ambitious businesses grow through brand strategy, creative, advertising, websites, and digital systems." />
      <Hero />
      <CapabilityStrip />
      <ServicesSection />
      <ProcessSection />
      <FeaturedWork />
      <Measurement />
      <AboutPreview />
      <InsightsPreview />
      <ContactBand />
    </>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[760px] overflow-hidden pt-[76px] lg:min-h-screen">
      <div className="absolute inset-0">
        <img src="/images/eiracorp-hero.png" alt="Editorial composition of digital interfaces and campaign materials" className="hero-image h-full w-full object-cover object-[62%_center]" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0c0a_0%,rgba(11,12,10,.92)_31%,rgba(11,12,10,.28)_72%,rgba(11,12,10,.45)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#0b0c0a_0%,transparent_30%)]" />
      </div>
      <div className="page-shell relative flex min-h-[684px] items-center py-20 lg:min-h-[calc(100vh-76px)]">
        <div className="max-w-[790px]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}><Eyebrow>Strategy · Creative · Technology · Growth</Eyebrow></motion.div>
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }} className="hero-title mt-7">Good brands get noticed. <em>Great brands scale.</em></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }} className="mt-7 max-w-xl text-lg leading-8 text-paper/68">We help ambitious businesses build stronger brands, reach the right audiences, and turn attention into measurable growth through strategy, creative, and digital systems.</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .3 }} className="mt-9 flex flex-wrap gap-3"><ButtonLink to="/contact">Book a strategy call</ButtonLink><ButtonLink to="/work" secondary>Explore our work</ButtonLink></motion.div>
        </div>
        <a href="#capabilities" className="absolute bottom-8 left-5 flex items-center gap-3 text-[11px] uppercase tracking-[.2em] text-paper/45 md:left-8 xl:left-10"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/15"><ArrowDown size={14} /></span>Scroll to explore</a>
      </div>
    </section>
  )
}

function CapabilityStrip() {
  const items = ['Strategy before spend', 'Creative that connects', 'Marketing built for growth', 'Digital experiences that convert']
  return <section id="capabilities" className="border-y border-white/10 bg-surface"><div className="page-shell grid sm:grid-cols-2 lg:grid-cols-4">{items.map((item, i) => <div key={item} className="flex min-h-28 items-center gap-4 border-white/10 py-7 sm:nth-[odd]:border-r lg:border-r lg:last:border-r-0 lg:px-6 lg:first:pl-0"><span className="text-[10px] text-acid">0{i + 1}</span><p className="max-w-[170px] text-sm font-medium leading-5 text-paper/80">{item}</p></div>)}</div></section>
}

function ServicesSection({ full = false }) {
  return (
    <section className="section-pad">
      <div className="page-shell">
        <Reveal className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><Eyebrow>What we do</Eyebrow></div><div><h2 className="section-title">Everything your brand needs <em>to move forward.</em></h2><p className="section-intro mt-6">One connected partner for the thinking, making, and systems that turn business ambition into steady momentum.</p></div></Reveal>
        <div className="mt-16 border-t border-white/12">
          {services.map((service, i) => <ServiceRow key={service.slug} service={service} index={i} expanded={full} />)}
        </div>
      </div>
    </section>
  )
}

function ServiceRow({ service, index, expanded }) {
  const Icon = service.icon
  return <Reveal delay={Math.min(index * .05, .2)}><article className="service-row group"><div className="flex items-center gap-4"><span className="service-num">{service.number}</span><Icon className="text-acid/80" size={24} strokeWidth={1.5} /></div><div><h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{service.title}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-paper/54 sm:text-base">{expanded ? service.intro : service.short}</p>{expanded && <ul className="mt-6 grid gap-2 sm:grid-cols-2">{service.deliverables.map(item => <li key={item} className="flex items-center gap-2 text-sm text-paper/68"><Check size={14} className="text-acid" />{item}</li>)}</ul>}<Link to={`/services/${service.slug}`} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-acid">Discuss this service <ArrowRight size={14} /></Link></div><Link to={`/services/${service.slug}`} className="service-arrow" aria-label={`Discuss ${service.title}`}><ArrowUpRight /></Link></article></Reveal>
}

function ProcessSection() {
  return <section className="section-pad border-y border-white/8 bg-paper text-ink"><div className="page-shell"><Reveal className="grid gap-8 lg:grid-cols-2"><div><Eyebrow>How we work</Eyebrow><h2 className="section-title mt-7 max-w-xl">A clear strategy. <em className="text-ink/40">A smarter way to scale.</em></h2></div><p className="section-intro self-end text-ink/60">We reduce noise, define what matters, and move through a practical cycle of strategy, execution, and learning.</p></Reveal><div className="mt-16 grid md:grid-cols-2 xl:grid-cols-4">{process.map(([num, title, text]) => <Reveal key={num} className="process-step"><span className="text-xs font-semibold text-ink/38">{num}</span><h3 className="mt-16 text-2xl font-semibold">{title}</h3><p className="mt-4 text-sm leading-6 text-ink/56">{text}</p></Reveal>)}</div></div></section>
}

function SiteMockup({ project, large = false }) {
  return (
    <div className={`mockup mockup-${project.tone} ${large ? 'mockup-large' : ''}`} role="img" aria-label={`Concept website preview for ${project.title}`}>
      <div className="browser-bar"><i /><i /><i /><span>{project.title.toLowerCase().replace(' ', '')}.concept</span></div>
      <div className="mockup-screen">
        {project.thumbnail && <img className="mock-project-image" src={project.thumbnail} alt={`${project.title} project preview`} loading={large ? 'eager' : 'lazy'} />}
        <div className="mock-nav"><b>{project.title}</b><span>ABOUT&nbsp;&nbsp;&nbsp; EXPLORE&nbsp;&nbsp;&nbsp; CONTACT</span></div>
        <div className="mock-copy"><span>{project.industry}</span><strong>{project.description.split(' ').slice(0, 7).join(' ')}</strong><i>Explore the experience ↗</i></div>
        <div className="mock-shape shape-one" /><div className="mock-shape shape-two" />
      </div>
    </div>
  )
}

function FeaturedWork() {
  const selected = [projects[0], projects[3], projects[6]]
  return <section className="section-pad overflow-hidden"><div className="page-shell"><Reveal className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><Eyebrow>Websites we’ve built</Eyebrow><h2 className="section-title mt-7">Digital work with <em>a point of view.</em></h2></div><Link to="/work" className="text-link">Explore all projects <ArrowRight size={17} /></Link></Reveal><div className="portfolio-triptych mt-14">{selected.map((project, index) => <Reveal key={project.slug} className={`triptych-item triptych-${index + 1}`} delay={index * .08}><Link to={`/work/${project.slug}`} className="group block"><div className="triptych-visual"><SiteMockup project={project} large={index === 0} /></div><div className="triptych-caption"><span>0{index + 1}</span><div><p className="tag">{project.category}</p><h3>{project.title}</h3></div><ArrowUpRight /></div></Link></Reveal>)}</div></div></section>
}

function Measurement() {
  const metrics = ['Qualified leads', 'Acquisition cost', 'Conversion rate', 'Traffic quality', 'Return on ad spend', 'Orders & sales']
  return <section className="border-y border-white/8 bg-surface section-pad"><div className="page-shell grid gap-16 lg:grid-cols-2"><Reveal><Eyebrow>Meaningful measurement</Eyebrow><h2 className="section-title mt-7">Growth should be <em>measurable.</em></h2><p className="section-intro mt-6">The right KPIs depend on your goal and starting point. We agree on the signals that matter before execution begins—then use them to make better decisions.</p></Reveal><Reveal className="metric-board"><div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-xs uppercase tracking-[.18em] text-paper/42">A practical scorecard</span><span className="live-dot">Measured with context</span></div>{metrics.map((m, i) => <div key={m} className="metric-line"><span>{String(i + 1).padStart(2, '0')}</span><strong>{m}</strong><div><i style={{ width: `${48 + i * 7}%` }} /></div></div>)}</Reveal></div></section>
}

function AboutPreview() {
  return <section className="section-pad"><div className="page-shell grid gap-14 lg:grid-cols-[.65fr_1.35fr]"><Reveal><Eyebrow>Why Eiracorp</Eyebrow><p className="mt-8 max-w-xs text-sm leading-6 text-paper/48">Built for ambitious businesses ready to compete with more confidence.</p></Reveal><Reveal><blockquote className="about-quote">“Growth is not the result of posting more, spending more, or following every trend. It comes from understanding your market, communicating your value, and building systems that turn attention into opportunity.”</blockquote><ButtonLink to="/about" secondary className="mt-10">Our point of view</ButtonLink></Reveal></div></section>
}

function InsightsPreview() {
  return <section className="section-pad border-t border-white/8"><div className="page-shell"><div className="flex items-end justify-between gap-6"><div><Eyebrow>Useful thinking</Eyebrow><h2 className="section-title mt-7">Insights for <em>building forward.</em></h2></div><Link className="text-link hidden sm:flex" to="/insights">All insights <ArrowRight size={17} /></Link></div><div className="mt-14 grid md:grid-cols-3">{articles.map((article, i) => <ArticleCard key={article.slug} article={article} index={i} />)}</div></div></section>
}

function ContactBand() {
  return <section className="bg-acid py-20 text-ink sm:py-28"><div className="page-shell"><Reveal><Eyebrow>Start a conversation</Eyebrow><div className="mt-7 flex flex-col justify-between gap-10 lg:flex-row lg:items-end"><h2 className="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-medium leading-[.9] tracking-[-.065em]">Let’s build your next stage of growth.</h2><Link to="/contact" className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform hover:rotate-12 hover:scale-105" aria-label="Start a project"><ArrowUpRight size={30} /></Link></div></Reveal></div></section>
}

function PageHero({ eyebrow, title, intro }) {
  return <section className="page-hero"><div className="page-shell"><Reveal><Eyebrow>{eyebrow}</Eyebrow><h1 className="page-title mt-8" dangerouslySetInnerHTML={{ __html: title }} /><p className="mt-8 max-w-2xl text-lg leading-8 text-paper/58">{intro}</p></Reveal></div></section>
}

function ServicesPage() {
  return <><Seo title="Services — Eiracorp" description="Brand strategy, content, paid advertising, website development, and digital growth systems for ambitious businesses." /><PageHero eyebrow="Connected capabilities" title={'From clarity to <em>commercial momentum.</em>'} intro="Choose a focused engagement or bring us in as a connected growth partner. Every scope starts with the business problem, not a pre-built package." /><ServicesSection full /><ContactBand /></>
}

function ServiceDetail() {
  const { slug } = useParams()
  const service = services.find(s => s.slug === slug)
  if (!service) return <NotFound />
  const Icon = service.icon
  return <><Seo title={`${service.title} — Eiracorp`} description={service.intro} /><section className="page-hero"><div className="page-shell"><Link className="back-link" to="/services"><ArrowLeft size={16} /> All services</Link><div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.9fr]"><div><Eyebrow>{service.number} / Service</Eyebrow><h1 className="page-title mt-8">{service.title}</h1><p className="section-intro mt-7">{service.intro}</p></div><div className="service-detail-mark"><Icon size={80} strokeWidth={1} /></div></div></div></section><section className="section-pad border-t border-white/8"><div className="page-shell grid gap-12 lg:grid-cols-2"><div><h2 className="text-4xl font-medium tracking-tight">What we can build together</h2><p className="mt-5 max-w-lg leading-7 text-paper/56">The exact scope is shaped around your priorities, internal capacity, and current stage. These are the core capabilities we can combine.</p></div><ul className="border-t border-white/10">{service.deliverables.map((item, i) => <li key={item} className="flex items-center gap-4 border-b border-white/10 py-5"><span className="text-xs text-acid">0{i + 1}</span><span className="text-lg">{item}</span></li>)}</ul></div></section><ContactBand /></>
}

function WorkPage() {
  const categories = ['All Projects', ...new Set(projects.map(p => p.category))]
  const [active, setActive] = useState('All Projects')
  const filtered = useMemo(() => active === 'All Projects' ? projects : projects.filter(p => p.category === active), [active])
  const featured = projects.find(p => p.featured)
  return <><Seo title="Website Portfolio — Eiracorp" description="Explore website and digital experiences by Eiracorp, from business websites and e-commerce to booking systems and web applications." /><PageHero eyebrow="Website portfolio" title={'We build more than <em>websites.</em>'} intro="Digital experiences designed to make brands stand out, connect with customers, and turn visitors into business opportunities." /><section className="pb-16"><div className="page-shell"><div className="featured-project-label"><Eyebrow>Featured build</Eyebrow><span>01 / {String(projects.length).padStart(2, '0')}</span></div><Link to={`/work/${featured.slug}`} className="featured-portfolio-card mt-8 block"><SiteMockup project={featured} large /><div className="featured-portfolio-copy"><div><span className="tag">{featured.category} · {featured.projectType}</span><h2>{featured.title}</h2></div><p>{featured.description}</p><span className="featured-circle"><ArrowUpRight /></span></div></Link></div></section><section className="section-pad border-t border-white/8"><div className="page-shell"><div className="filter-row sticky-filter" role="group" aria-label="Filter projects">{categories.map(cat => <button key={cat} onClick={() => setActive(cat)} className={active === cat ? 'active' : ''}>{cat}</button>)}</div><motion.div layout className="portfolio-showcase mt-14"><AnimatePresence mode="popLayout">{filtered.map((project, index) => <motion.div layout key={project.slug} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 28 }} transition={{ duration: .35 }}><ProjectShowcaseRow project={project} index={index} /></motion.div>)}</AnimatePresence></motion.div></div></section><ContactBand /></>
}

function ProjectShowcaseRow({ project, index }) {
  return <article className={`showcase-row ${index % 2 ? 'showcase-reverse' : ''}`}><div className="showcase-number">{String(index + 1).padStart(2, '0')}</div><Link to={`/work/${project.slug}`} className="showcase-visual group"><SiteMockup project={project} /><span className="showcase-explore">Explore project <ArrowUpRight size={16} /></span></Link><div className="showcase-copy"><p className="tag">{project.category} · {project.industry}</p><h2><Link to={`/work/${project.slug}`}>{project.title}</Link></h2><p>{project.description}</p><div className="showcase-tech">{project.technologies.slice(0, 3).map(item => <span key={item}>{item}</span>)}</div></div></article>
}

function ProjectCard({ project }) {
  return <article><Link to={`/work/${project.slug}`} className="group block"><div className="overflow-hidden"><div className="transition-transform duration-700 group-hover:scale-[1.025]"><SiteMockup project={project} /></div></div><div className="mt-6 flex items-start justify-between gap-5"><div><p className="tag">{project.category} · {project.projectType}</p><h3 className="mt-2 text-2xl font-medium">{project.title}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-paper/52">{project.description}</p></div><ArrowUpRight className="mt-1 shrink-0 text-paper/40 transition-colors group-hover:text-acid" /></div></Link></article>
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)
  if (!project) return <NotFound />
  return <><Seo title={`${project.title} — Eiracorp portfolio`} description={project.description} /><section className="page-hero pb-14"><div className="page-shell"><Link to="/work" className="back-link"><ArrowLeft size={16} /> All work</Link><div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_.75fr]"><div><div className="flex flex-wrap gap-2"><span className="tag">{project.projectType}</span><span className="tag">{project.category}</span></div><h1 className="page-title mt-7">{project.title}</h1><p className="section-intro mt-6">{project.description}</p></div><dl className="project-meta"><div><dt>Industry</dt><dd>{project.industry}</dd></div><div><dt>Services</dt><dd>{project.services.join(', ')}</dd></div><div><dt>Technology</dt><dd>{project.technologies.join(', ')}</dd></div></dl></div></div></section><div className="page-shell pb-12"><SiteMockup project={project} large /></div><section className="section-pad"><div className="page-shell grid gap-16 lg:grid-cols-3"><CaseBlock number="01" title="Overview" text={project.overview} /><CaseBlock number="02" title="The challenge" text={project.challenge} /><CaseBlock number="03" title="Design direction" text={project.direction} /></div><div className="page-shell mt-20 grid gap-12 border-t border-white/10 pt-14 lg:grid-cols-2"><div><Eyebrow>Key features</Eyebrow><h2 className="mt-7 text-4xl font-medium tracking-tight">Designed around the actions that matter.</h2></div><ul className="grid gap-3">{project.features.map(f => <li key={f} className="flex items-center justify-between border-b border-white/10 py-4 text-lg">{f}<Check size={17} className="text-acid" /></li>)}</ul></div><div className="page-shell mt-14 flex flex-wrap gap-3">{project.liveUrl && <ButtonLink href={project.liveUrl}>Visit live website</ButtonLink>}{project.repositoryUrl && <ButtonLink href={project.repositoryUrl} secondary>View source on GitHub</ButtonLink>}{!project.liveUrl && !project.repositoryUrl && <p className="text-sm text-paper/42">A public project link has not been supplied yet.</p>}</div></section><ContactBand /></>
}

function CaseBlock({ number, title, text }) {
  return <Reveal><span className="text-xs text-acid">{number}</span><h2 className="mt-5 text-2xl font-medium">{title}</h2><p className="mt-4 text-sm leading-7 text-paper/56">{text}</p></Reveal>
}

function AboutPage() {
  const principles = [['Clarity over noise', 'We make the strategy understandable enough to act on.'], ['Connected thinking', 'Brand, creative, media, and technology should reinforce one another.'], ['Business before vanity', 'The work must serve an outcome, not just produce activity.'], ['Progress through learning', 'We use evidence to improve—not to decorate a report.']]
  return <><Seo title="About Eiracorp — Brand-Scaling Agency" description="Eiracorp brings strategy, creativity, and technology together to help ambitious businesses compete with confidence." /><PageHero eyebrow="About Eiracorp" title={'Built for businesses <em>ready for more.</em>'} intro="Eiracorp exists to help ambitious businesses compete with confidence. We bring strategy, creativity, and technology together to build brands people recognize, trust, and choose." /><section className="section-pad border-t border-white/8"><div className="page-shell grid gap-12 lg:grid-cols-2"><Reveal><h2 className="section-title">Think bigger. <em>Execute smarter.</em></h2></Reveal><Reveal className="space-y-6 text-lg leading-8 text-paper/60"><p>Growth rarely comes from posting more, spending more, or reacting to every trend. It comes from understanding the market, communicating real value, and creating systems that consistently turn attention into opportunity.</p><p>That is why we do not treat strategy, creative, advertising, and digital experiences as disconnected services. We bring them together around what the business is trying to achieve.</p></Reveal></div><div className="page-shell mt-24 grid md:grid-cols-2">{principles.map(([title, text], i) => <Reveal key={title} className="principle"><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><ProcessSection /><ContactBand /></>
}

function InsightsPage() {
  return <><Seo title="Insights — Eiracorp" description="Practical thinking on brand strategy, digital marketing, paid advertising, websites, and growth systems." /><PageHero eyebrow="Insights & resources" title={'Clear thinking for <em>ambitious businesses.</em>'} intro="Practical perspectives on building a stronger brand, acquiring customers, and creating digital systems that support sustainable growth." /><section className="section-pad border-t border-white/8"><div className="page-shell grid md:grid-cols-3">{articles.map((a, i) => <ArticleCard key={a.slug} article={a} index={i} />)}</div></section><ContactBand /></>
}

function ArticleCard({ article, index }) {
  return <Reveal className="article-card"><Link to={`/insights/${article.slug}`}><div className="article-index">0{index + 1}<ArrowUpRight size={19} /></div><p className="tag mt-8">{article.category}</p><h3 className="mt-5 text-2xl font-medium leading-tight">{article.title}</h3><p className="mt-5 text-sm leading-6 text-paper/50">{article.excerpt}</p><p className="mt-9 text-xs text-paper/34">{article.date} · {article.readTime}</p></Link></Reveal>
}

function ArticlePage() {
  const { slug } = useParams()
  const article = articles.find(a => a.slug === slug)
  if (!article) return <NotFound />
  return <><Seo title={`${article.title} — Eiracorp`} description={article.excerpt} /><article className="page-hero"><div className="mx-auto max-w-4xl px-5 md:px-8"><Link to="/insights" className="back-link"><ArrowLeft size={16} /> All insights</Link><p className="tag mt-12">{article.category} · {article.date}</p><h1 className="mt-7 text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[.98] tracking-[-.055em]">{article.title}</h1><p className="mt-8 max-w-2xl text-xl leading-8 text-paper/56">{article.excerpt}</p></div></article><section className="pb-28"><div className="article-body">{article.body.map(p => <p key={p}>{p}</p>)}</div></section><ContactBand /></>
}

function ContactPage() {
  return <><Seo title="Start a Project — Eiracorp" description="Tell Eiracorp where your business is today and where you want it to go." /><PageHero eyebrow="Start a project" title={'Let’s build your next <em>stage of growth.</em>'} intro="Tell us where your business is today and where you want it to go. We’ll explore the opportunity and determine whether Eiracorp is the right partner to help you get there." /><section className="section-pad border-t border-white/8"><div className="page-shell grid gap-16 lg:grid-cols-[.65fr_1.35fr]"><aside><Eyebrow>Direct channels</Eyebrow><div className="mt-8 space-y-5 text-sm">{contactEmail && <a className="contact-link" href={`mailto:${contactEmail}`}>{contactEmail}<ArrowUpRight size={16} /></a>}{contactPhone && <a className="contact-link" href={`tel:${contactPhone}`}>{contactPhone}<ArrowUpRight size={16} /></a>}{whatsappNumber && <a className="contact-link" href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp Eiracorp<ArrowUpRight size={16} /></a>}{bookingUrl && <a className="contact-link" href={bookingUrl} target="_blank" rel="noreferrer">Book a strategy call<ArrowUpRight size={16} /></a>}{!contactEmail && !contactPhone && !whatsappNumber && <p className="max-w-xs leading-6 text-paper/42">Contact channels are ready to display once approved details are added to the environment configuration.</p>}</div></aside><InquiryForm /></div></section></>
}

const initialForm = { name: '', email: '', phone: '', business: '', industry: '', services: [], budget: '', challenge: '', outcome: '', details: '', website: '' }

function InquiryForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  const toggleService = name => setForm({ ...form, services: form.services.includes(name) ? form.services.filter(s => s !== name) : [...form.services, name] })
  const submit = async e => {
    e.preventDefault()
    if (form.website) { setStatus('success'); return }
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid business email.'
    if (form.phone && !/^\+?[0-9\s()-]{7,20}$/.test(form.phone)) next.phone = 'Enter a valid phone number.'
    if (!form.business.trim()) next.business = 'Please enter the business name.'
    if (!form.challenge.trim()) next.challenge = 'Tell us about the primary challenge.'
    setErrors(next)
    if (Object.keys(next).length) return
    if (!endpoint) { setStatus('unconfigured'); return }
    setStatus('loading')
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!response.ok) throw new Error('Request failed')
      window.dataLayer?.push({ event: 'generate_lead', form_name: 'project_inquiry' })
      setStatus('success'); setForm(initialForm)
    } catch { window.dataLayer?.push({ event: 'form_error', form_name: 'project_inquiry' }); setStatus('error') }
  }
  if (status === 'success') return <div className="form-state"><span><Check /></span><h2>Thanks. Your inquiry is in.</h2><p>We’ll review the details and get back to you through the contact information provided.</p><button onClick={() => setStatus('idle')} className="text-link">Send another inquiry <ArrowRight size={16} /></button></div>
  return <form onSubmit={submit} noValidate><div className="form-grid"><Field label="Full name" name="name" value={form.name} onChange={update} error={errors.name} required /><Field label="Business email" name="email" type="email" value={form.email} onChange={update} error={errors.email} required /><Field label="Phone number" name="phone" value={form.phone} onChange={update} error={errors.phone} placeholder="Include country code" /><Field label="Business name" name="business" value={form.business} onChange={update} error={errors.business} required /><SelectField label="Industry" name="industry" value={form.industry} onChange={update} options={['Hospitality', 'Fashion & beauty', 'Retail & e-commerce', 'Professional services', 'Startup / technology', 'Other']} /><SelectField label="Estimated budget" name="budget" value={form.budget} onChange={update} options={['Below KES 50,000', 'KES 50,000–100,000', 'KES 100,000–250,000', 'KES 250,000–500,000', 'KES 500,000–1,000,000', 'Above KES 1,000,000', 'Not decided']} /></div><fieldset className="mt-9"><legend className="field-label">Services required</legend><div className="mt-3 flex flex-wrap gap-2">{services.map(s => <button type="button" key={s.slug} onClick={() => toggleService(s.title)} className={`service-pill ${form.services.includes(s.title) ? 'active' : ''}`} aria-pressed={form.services.includes(s.title)}>{form.services.includes(s.title) && <Check size={14} />}{s.title}</button>)}</div></fieldset><div className="mt-9 space-y-7"><TextArea label="Primary business challenge" name="challenge" value={form.challenge} onChange={update} error={errors.challenge} required /><TextArea label="Desired outcome" name="outcome" value={form.outcome} onChange={update} /><TextArea label="Anything else we should know?" name="details" value={form.details} onChange={update} /></div><div className="absolute -left-[10000px]" aria-hidden="true"><label>Website<input tabIndex="-1" autoComplete="off" name="website" value={form.website} onChange={update} /></label></div>{status === 'unconfigured' && <p className="form-alert">The secure form endpoint has not been configured yet. Add <code>VITE_CONTACT_ENDPOINT</code> before launch.{contactEmail && <> For now, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</>}</p>}{status === 'error' && <p className="form-alert">We couldn’t send your inquiry. Please try again{contactEmail && <> or email <a href={`mailto:${contactEmail}`}>{contactEmail}</a></>}.</p>}<div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><button className="btn btn-primary" disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Send project inquiry'}<ArrowUpRight size={17} /></button><p className="max-w-sm text-xs leading-5 text-paper/36">By submitting, you agree that Eiracorp may use these details to respond to your inquiry.</p></div></form>
}

function Field({ label, error, required, ...props }) {
  return <label className="field"><span className="field-label">{label}{required && ' *'}</span><input {...props} aria-invalid={!!error} />{error && <small>{error}</small>}</label>
}
function SelectField({ label, options, ...props }) {
  return <label className="field"><span className="field-label">{label}</span><select {...props}><option value="">Select one</option>{options.map(o => <option key={o}>{o}</option>)}</select></label>
}
function TextArea({ label, error, required, ...props }) {
  return <label className="field"><span className="field-label">{label}{required && ' *'}</span><textarea rows="3" {...props} aria-invalid={!!error} />{error && <small>{error}</small>}</label>
}

function LegalPage({ type }) {
  const privacy = type === 'privacy'
  return <><Seo title={`${privacy ? 'Privacy Policy' : 'Terms of Service'} — Eiracorp`} description={`${privacy ? 'Privacy' : 'Terms'} information for the Eiracorp website.`} /><PageHero eyebrow="Legal" title={privacy ? 'Privacy <em>policy.</em>' : 'Terms of <em>service.</em>'} intro="This starter copy explains the website’s intended handling in plain language. It must be reviewed against the agency’s actual practices and by qualified local counsel before publication." /><section className="pb-28"><div className="article-body"><h2>{privacy ? 'Information collected' : 'Using this website'}</h2><p>{privacy ? 'The project inquiry form collects the information you choose to provide so Eiracorp can assess and respond to your request. The live submission service and retention policy must be documented here once configured.' : 'Website content is provided for general information and does not create a client relationship. A project relationship begins only through a separate written agreement.'}</p><h2>{privacy ? 'How information is used' : 'Intellectual property'}</h2><p>{privacy ? 'Inquiry data should only be used to respond, qualify the opportunity, and maintain relevant business records. Do not sell personal information or add contacts to marketing lists without an appropriate basis.' : 'Unless otherwise stated, the design, copy, and original materials on this website belong to Eiracorp. Concept projects are illustrative and do not represent disclosed client relationships.'}</p><h2>Questions</h2><p>Publish an approved contact email in the site configuration so visitors can ask questions about this policy.</p></div></section></>
}

function NotFound() {
  return <section className="grid min-h-[75vh] place-items-center px-5 pt-24 text-center"><Seo title="Page not found — Eiracorp" description="The requested page could not be found." /><div><p className="text-sm text-acid">404</p><h1 className="mt-5 text-6xl font-medium tracking-tight">That page moved.</h1><p className="mt-5 text-paper/50">Let’s get you back to the work that matters.</p><ButtonLink to="/" className="mt-8">Return home</ButtonLink></div></section>
}

function Footer() {
  return <footer className="bg-ink"><div className="page-shell py-16"><div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_.7fr_.7fr_.7fr]"><div><Logo /><p className="mt-6 max-w-sm text-sm leading-6 text-paper/45">Strategy, creative, and digital systems for ambitious businesses ready to become more recognizable, trusted, and commercially effective.</p></div><FooterGroup title="Explore" links={[["/services", 'Services'], ['/work', 'Our work'], ['/about', 'About'], ['/insights', 'Insights']]} /><FooterGroup title="Services" links={services.slice(0, 4).map(s => [`/services/${s.slug}`, s.title])} /><div><p className="footer-title">Start here</p><Link to="/contact" className="footer-link">Project inquiry</Link>{bookingUrl && <a className="footer-link" href={bookingUrl} target="_blank" rel="noreferrer">Strategy call</a>}{contactEmail && <a className="footer-link" href={`mailto:${contactEmail}`}>{contactEmail}</a>}{contactPhone && <a className="footer-link" href={`tel:${contactPhone}`}>{contactPhone}</a>}<div className="mt-5 flex gap-4">{instagramUrl && <a className="footer-link" href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a>}{linkedinUrl && <a className="footer-link" href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>}</div></div></div><div className="flex flex-col justify-between gap-5 pt-7 text-xs text-paper/32 sm:flex-row"><p>© {new Date().getFullYear()} Eiracorp. All rights reserved.</p><div className="flex gap-5"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div></div></footer>
}
function FooterGroup({ title, links }) { return <div><p className="footer-title">{title}</p>{links.map(([to, label]) => <Link key={to} to={to} className="footer-link">{label}</Link>)}</div> }

export default App
