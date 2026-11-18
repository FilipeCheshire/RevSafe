'use client';

import { useRef, useSyncExternalStore, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Award, Check, Coins, Headphones, Laptop, Leaf, Monitor, ShieldCheck, Smartphone, Scale, Heart } from 'lucide-react';
import { GridBackground } from '../common/GridBackground';

const chapters = ['Descubra', 'Entenda', 'Escolha'];
const shortViewportQuery = '(max-height: 560px)';
function subscribeShortViewport(callback: () => void) {
  const media = window.matchMedia(shortViewportQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
function getShortViewport() { return window.matchMedia(shortViewportQuery).matches; }
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
function getReducedMotion() { return window.matchMedia(reducedMotionQuery).matches; }
const discoveryItems = [
  { name: 'smartphone', icon: Smartphone },
  { name: 'notebook', icon: Laptop },
  { name: 'headphones', icon: Headphones },
  { name: 'monitor', icon: Monitor },
];
const analysisItems = [
  { name: 'quality', icon: Award, caption: 'Dura' },
  { name: 'safety', icon: ShieldCheck, caption: 'Protege' },
  { name: 'sustainability', icon: Leaf, caption: 'Preserva' },
  { name: 'value', icon: Coins, caption: 'Compensa' },
];

function Scene({ progress, index, children }: { progress: MotionValue<number>; index: number; children: ReactNode }) {
  // Each caption leaves before the next arrives; the illustration remains continuous.
  const range = [0, .15, .25, .36, .56, .66, .78, 1];
  const opacity = useTransform(progress, range, index === 0 ? [1, 1, 0, 0, 0, 0, 0, 0] : index === 1 ? [0, 0, 0, 1, 1, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 1, 1]);
  const y = useTransform(progress, range, index === 0 ? [0, 0, -40, -40, -40, -40, -40, -40] : index === 1 ? [40, 40, 40, 0, 0, -40, -40, -40] : [40, 40, 40, 40, 40, 40, 0, 0]);
  return <motion.div data-scene={['explore', 'analyze', 'decide'][index]} className="experience-scene" style={{ opacity, y }} aria-hidden="true">{children}</motion.div>;
}

function StageItems({ progress, stage, children }: { progress: MotionValue<number>; stage: 'explore' | 'analyze' | 'decide'; children: ReactNode }) {
  const range = [0, .16, .28, .38, .57, .68, .83, 1];
  const opacity = useTransform(progress, range, stage === 'explore' ? [1, 1, 0, 0, 0, 0, 0, 0] : stage === 'analyze' ? [0, 0, 0, 1, 1, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 1, 1]);
  const scale = useTransform(progress, range, stage === 'explore' ? [1, 1.04, .7, .7, .7, .7, .7, .7] : stage === 'analyze' ? [.7, .7, .7, 1, 1, .65, .65, .65] : [.7, .7, .7, .7, .7, .7, 1, 1]);
  return <motion.div data-stage-items={stage} className={`experience-items experience-items-${stage}`} style={{ opacity, scale }}>{children}</motion.div>;
}

export function ScrollExperience({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const shortViewport = useSyncExternalStore(subscribeShortViewport, getShortViewport, () => false);
  const reducedMotion = prefersReducedMotion || shortViewport;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 64px', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, restDelta: .0001 });
  const deviceOpacity = useTransform(progress, [.17, .36], [1, 0]);
  const deviceScale = useTransform(progress, [0, .18, .4], [1, 1.06, .35]);
  const deviceRotate = useTransform(progress, [0, .18, .4], [-16, 0, 105]);
  const deviceY = useTransform(progress, [0, .4], [0, -45]);
  const ringScale = useTransform(progress, [0, .36, .6, 1], [.75, 1, 1.1, 1.85]);
  const ringRotate = useTransform(progress, [0, 1], [-35, 145]);
  const ringOpacity = useTransform(progress, [0, .32, .6, .88], [.24, .8, .8, .15]);
  const shieldOpacity = useTransform(progress, [.23, .36, .58, .76], [0, 1, 1, 0]);
  const shieldScale = useTransform(progress, [.23, .4, .6, .8], [.5, 1, 1, 1.7]);
  const shieldRotate = useTransform(progress, [.23, .4, .8], [-35, 0, 25]);
  const decisionOpacity = useTransform(progress, [.65, .84], [0, 1]);
  const decisionY = useTransform(progress, [.65, .9], [80, 0]);
  const decisionScale = useTransform(progress, [.65, .9, 1], [.65, 1, 1.03]);
  const decisionRotate = useTransform(progress, [.65, .9], [-12, 0]);
  const beamY = useTransform(progress, [0, .25, .65, 1], [-230, -190, 210, 230]);
  const beamOpacity = useTransform(progress, [0, .2, .3, .6, .75, 1], [0, 0, 1, 1, 0, 0]);
  const glowX = useTransform(progress, [0, .5, 1], ['20%', '55%', '80%']);

  const skip = () => document.getElementById('home-categories')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });

  return (
    <section ref={ref} data-scroll-experience className={`scroll-experience ${reducedMotion ? 'experience-reduced' : ''}`} aria-label="Da descoberta à confiança">
      <div data-scroll-stage className="experience-stage grid-surface">
        <div className="experience-atmosphere" aria-hidden="true"><motion.div className="experience-glow" style={{ left: reducedMotion ? '65%' : glowX }} /></div>
        <GridBackground surface />
        <div className="experience-inner grid-surface-content">
          <div className="experience-topline"><span><span className="experience-status-dot" /> REVSAFE · UM NOVO OLHAR PARA ESCOLHER</span><button data-skip-experience onClick={skip}>Explorar produtos <ArrowUpRight size={14} /></button></div>
          <div className="experience-composition">
            <div className="experience-narrative">
              <h1 className="sr-only">Escolha melhor. Compre com confiança.</h1>
              <p className="sr-only">Compare produtos por qualidade, segurança, sustentabilidade e custo-benefício. Use a busca ou explore as categorias a seguir.</p>
              <div className="experience-copy">
                {reducedMotion ? <div className="experience-static-copy"><span className="experience-kicker">INFORMAÇÃO QUE TRANSFORMA</span><div className="experience-title">Escolha melhor.<br /><em>Compre com confiança.</em></div><p>Qualidade, segurança, sustentabilidade e custo-benefício. Quatro perspectivas para uma escolha que faz sentido.</p></div> : <>
                  <Scene progress={progress} index={0}><span className="experience-kicker">01 / UM MUNDO DE POSSIBILIDADES</span><div className="experience-title">Escolha<br /><em>melhor.</em></div><p>Entre tantas opções, existe uma que faz sentido para você. Vamos olhar além da primeira impressão?</p></Scene>
                  <Scene progress={progress} index={1}><span className="experience-kicker">02 / POR DENTRO DE CADA ESCOLHA</span><div className="experience-title">Olhe mais<br /><em>de perto.</em></div><p>O que dura. O que protege. O que preserva. O que vale. Quatro pilares se conectam para revelar o que importa.</p></Scene>
                  <Scene progress={progress} index={2}><span className="experience-kicker">03 / CLAREZA PARA SEGUIR EM FRENTE</span><div className="experience-title">Compre com<br /><em>confiança.</em></div><p>As informações se encontram. A dúvida fica para trás. Sua próxima escolha começa com um novo olhar.</p></Scene>
                </>}
              </div>
              <div className="experience-search">{children}</div>
            </div>
            <div className="experience-visual" aria-hidden="true">
              <div className="experience-artboard">
                <motion.div className="experience-ring" style={reducedMotion ? { opacity: .3 } : { scale: ringScale, rotate: ringRotate, opacity: ringOpacity }}><div /><i /><b /></motion.div>
                {!reducedMotion && <>
                  <svg className="experience-connections" viewBox="0 0 560 520"><defs><linearGradient id="experience-line"><stop stopColor="#0e7ffd" stopOpacity="0" /><stop offset=".5" stopColor="#60a5fa" /><stop offset="1" stopColor="#0e7ffd" stopOpacity="0" /></linearGradient></defs><motion.g style={{ opacity: shieldOpacity }} fill="none" stroke="url(#experience-line)" strokeWidth="1.5"><path d="M106 128 Q280 120 280 260 T454 392" /><path d="M454 128 Q280 120 280 260 T106 392" /></motion.g></svg>
                  <motion.div data-visual="device" className="experience-device" style={{ opacity: deviceOpacity, scale: deviceScale, rotateY: deviceRotate, y: deviceY }}>
                    <div className="device-edge" /><div className="device-screen"><div className="device-camera" /><span className="device-overline">SEU PRÓXIMO</span><strong>novo<br />começo<span>.</span></strong><div className="device-orb"><Smartphone /></div><div className="device-bottom"><span>Além das aparências.</span><ArrowDownRight size={18} /></div></div>
                  </motion.div>
                  <motion.div data-visual="shield" className="experience-shield" style={{ opacity: shieldOpacity, scale: shieldScale, rotate: shieldRotate }}><div className="shield-outline"><ShieldCheck strokeWidth={.8} /></div></motion.div>
                  <StageItems progress={progress} stage="explore">
                    {discoveryItems.map((item, index) => <div key={item.name} data-item={item.name} className={`discovery-tile satellite-${index}`}><item.icon strokeWidth={1.5} /></div>)}
                  </StageItems>
                  <StageItems progress={progress} stage="analyze">
                    {analysisItems.map((item, index) => <div key={item.name} data-item={item.name} className={`analysis-token satellite-${index}`}><span><item.icon strokeWidth={1.7} /></span><strong>{item.caption}</strong></div>)}
                  </StageItems>
                  <motion.div className="experience-scan" style={{ y: beamY, opacity: beamOpacity }} />
                </>}
                <motion.div data-visual="decision" className="experience-decision" style={reducedMotion ? { opacity: 1 } : { opacity: decisionOpacity, y: decisionY, scale: decisionScale, rotate: decisionRotate }}>
                  <span className="decision-check"><Check /></span>
                  <strong className="decision-title">Boa escolha.</strong>
                  <span className="decision-message">Você no controle.</span>
                </motion.div>
                {!reducedMotion && <StageItems progress={progress} stage="decide">
                  <div data-item="compare" className="decision-action decision-action-compare"><Scale /><span>Compare</span></div>
                  <div data-item="save" className="decision-action decision-action-save"><Heart /><span>Salve</span></div>
                </StageItems>}
              </div>
            </div>
          </div>
          <div className="experience-bottomline">
            <span className="experience-scroll-cue"><ArrowDown size={15} /> {reducedMotion ? 'Explore no seu ritmo' : 'Role. Veja tudo se transformar.'}</span>
            <div className="experience-chapters" aria-hidden="true">{chapters.map((chapter, i) => <Chapter key={chapter} progress={progress} index={i} reduced={!!reducedMotion} label={chapter} />)}</div>
            <button onClick={skip} className="experience-skip" aria-label="Ir para categorias">Ir para categorias <ArrowDown size={14} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chapter({ progress, index, reduced, label }: { progress: MotionValue<number>; index: number; reduced: boolean; label: string }) {
  const opacity = useTransform(progress, [0, .24, .4, .64, .8, 1], index === 0 ? [1, 1, .35, .35, .35, .35] : index === 1 ? [.35, .35, 1, 1, .35, .35] : [.35, .35, .35, .35, 1, 1]);
  return <motion.span style={{ opacity: reduced ? 1 : opacity }}><i>0{index + 1}</i>{label}</motion.span>;
}
