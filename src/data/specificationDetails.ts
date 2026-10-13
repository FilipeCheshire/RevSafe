import type { Product, PCComponent } from '../types';

type ExtraDetails = { specs: Record<string, string>; source?: { title: string; url: string } };
const details: Record<string, ExtraDetails> = {
  'prod-sp-01': {
    specs: { Peso: '232 g', Altura: '162,3 mm', Largura: '79 mm', 'Profundidade / espessura': '8,6 mm', 'Material da estrutura': 'Titânio', Conectividade: '5G, Wi-Fi 7, Bluetooth 5.3, USB-C' },
    source: { title: 'Samsung — Galaxy S24 Ultra', url: 'https://www.samsung.com/ph/smartphones/galaxy-s24-ultra/specs/' },
  },
  'prod-sp-02': {
    specs: { Peso: '171 g', Altura: '147,6 mm', Largura: '71,6 mm', 'Profundidade / espessura': '7,8 mm', 'Material da estrutura': 'Alumínio e vidro', 'Bateria': 'Até 20 horas de reprodução de vídeo (dado do fabricante)', Conectividade: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C (USB 2)' },
    source: { title: 'Apple — iPhone 15', url: 'https://support.apple.com/en-nz/111831' },
  },
  'prod-sp-03': {
    specs: { Peso: '193 g (versão com traseira de vidro)', Altura: '152,8 mm', Largura: '71,5 mm', 'Profundidade / espessura': '8,2 mm', 'Material da estrutura': 'Alumínio e vidro' },
    source: { title: 'Xiaomi — Xiaomi 14', url: 'https://www.mi.com/in/product/xiaomi-14/specs/' },
  },
  'prod-sp-04': {
    specs: { Peso: '186 g', Altura: '161,23 mm', Largura: '72,4 mm', 'Profundidade / espessura': '8,19 mm', 'Material da estrutura': 'Alumínio; acabamento traseiro varia conforme a cor' },
    source: { title: 'Motorola — Edge 50 Pro', url: 'https://motorola-mobility-en-xp--moli.custhelp.com/app/answers/detail/a_id/178982' },
  },
  'prod-nb-01': {
    specs: { Peso: '1,24 kg', Altura: '11,3 mm (fechado)', Largura: '304,1 mm', 'Profundidade / espessura': '215 mm', 'Material da estrutura': 'Alumínio', Conectividade: 'Wi-Fi 6E, Bluetooth 5.3, 2× Thunderbolt / USB 4, MagSafe 3 e áudio 3,5 mm', 'Bateria': '52,6 Wh; até 15 h de navegação sem fio ou 18 h de vídeo' },
    source: { title: 'Apple — MacBook Air 13″ M3 (2024)', url: 'https://support.apple.com/en-ca/118551' },
  },
  'prod-nb-02': { specs: { 'Modelo de referência': 'Sem informação — o código exato do Inspiron não foi informado', Peso: 'Sem informação — varia conforme a configuração', Altura: 'Sem informação — requer o código do modelo' } },
  'prod-nb-03': {
    specs: { Peso: 'A partir de 1,41 kg; 1,43 kg com base de alumínio', Altura: '17,99 mm (fechado)', Largura: '313 mm', 'Profundidade / espessura': '219,3 mm', 'Material da estrutura': 'Tampa de alumínio; base de PC-ABS ou alumínio conforme configuração' },
    source: { title: 'Lenovo PSREF — ThinkPad E14 Gen 5 AMD', url: 'https://psref.lenovo.com/Product/ThinkPad/ThinkPad_E14_Gen_5_AMD' },
  },
  'prod-el-01': {
    specs: { 'Modelo de referência': 'HD9252/91; confirme a variante regional', Peso: '4,55 kg (produto, sem embalagem)', Altura: '295 mm', Largura: '264 mm', 'Profundidade / espessura': '360 mm', 'Material da estrutura': 'Plástico', 'Comprimento do cabo': '0,8 m' },
    source: { title: 'Philips — ficha HD9252/91', url: 'https://www.documents.philips.com/assets/20220419/c3530531a35140cd886cae7c00c65ebb.pdf' },
  },
  'prod-el-02': { specs: { 'Modelo de referência': 'Produto genérico demonstrativo; fabricante e código não identificados', 'Voltagem': 'Sem informação — consulte a etiqueta do aparelho' } },
  'prod-el-03': {
    specs: { Altura: '96,5 mm (robô, sem estação)', Largura: '353 mm (robô)', 'Profundidade / espessura': '350 mm (robô)', Peso: 'Sem informação — não confirmado na fonte consultada' },
    source: { title: 'Roborock — Q7 Max', url: 'https://tr.roborock.com/products/roborock-q7-max-robot-supurge' },
  },
  'prod-au-01': {
    specs: { Peso: 'Aproximadamente 250 g', 'Comprimento do cabo': 'Aproximadamente 1,2 m', 'Tempo de carga': 'Aproximadamente 3,5 horas', 'Autonomia': 'Até 30 h com cancelamento de ruído; até 40 h sem cancelamento' },
    source: { title: 'Sony — WH-1000XM5', url: 'https://www.sony.com/electronics/support/wireless-headphones-bluetooth-headphones/wh-1000xm5/specifications' },
  },
  'prod-mo-01': {
    specs: { Peso: '4,48 kg (painel sem base)', Altura: '353,01 mm (sem base)', Largura: '611,4 mm', 'Profundidade / espessura': '54,33 mm (sem base)', 'Condição das medidas': 'Painel sem base; a altura montada depende do ajuste do suporte' },
    source: { title: 'Dell — UltraSharp U2723QE', url: 'https://www.dell.com/en-au/shop/dell-ultrasharp-27-4k-usb-c-hub-monitor-u2723qe/apd/210-bdzq/monitors-monitor-accessories' },
  },
  'prod-mo-02': { specs: { 'Modelo de referência': 'Sem informação — o código completo do Odyssey G5 não está cadastrado', Peso: 'Sem informação — varia conforme o modelo e a base' } },
  'mobo-01': {
    specs: { Altura: '305 mm (placa)', Largura: '244 mm (placa)' },
    source: { title: 'ASUS — TUF Gaming B650-Plus WiFi', url: 'https://www.asus.com/us/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/techspec/' },
  },
  'mobo-02': {
    specs: { Altura: '244 mm (placa)', Largura: '226 mm (placa)' },
    source: { title: 'ASRock — B650M-HDV/M.2', url: 'https://oc.asrock.com/MB/AMD/B650M-HDVM.2/index.asp' },
  },
  'ram-01': {
    specs: { 'Modelo de referência': 'KF560C30BBEK2-32', Altura: '34,9 mm por módulo (com dissipador)', Largura: '133,35 mm por módulo', 'Profundidade / espessura': '6,62 mm por módulo' },
    source: { title: 'Kingston — Fury Beast KF560C30BBEK2-32', url: 'https://www.kingston.com/datasheets/KF560C30BBEK2-32.pdf' },
  },
  'ssd-01': {
    specs: { Altura: '2,2 mm (espessura)', Largura: '22 mm', 'Profundidade / espessura': '80 mm (comprimento)' },
    source: { title: 'Kingston — SSD NV2', url: 'https://www.kingston.com/datasheets/snv2s_us.pdf' },
  },
  'mobo-04': {
    specs: { Altura: '244 mm (placa)', Largura: '244 mm (placa)' },
    source: { title: 'MSI — B550M PRO-VDH WIFI', url: 'https://www.msi.com/Motherboard/B550M-PRO-VDH-WIFI/Specification' },
  },
  'ssd-02': {
    specs: { Altura: '8,2 mm (com dissipador)', Largura: '24,3 mm', 'Profundidade / espessura': '80 mm (comprimento)' },
    source: { title: 'Samsung — 990 PRO com dissipador', url: 'https://www.samsung.com/ca/memory-storage/nvme-ssd/ssd-nvme-1tb-990-pro-w-heatsink-mz-v9p1t0cw/' },
  },
  'psu-01': {
    specs: { Altura: '86 mm', Largura: '150 mm', 'Profundidade / espessura': '140 mm' },
    source: { title: 'Corsair — manual RM750e', url: 'https://assets.corsair.com/image/upload/corsairmedia/sys_master/productcontent/49_002627_AA_WW_RMe_Series_Web_QSG_F.pdf' },
  },
  'psu-02': {
    specs: { Altura: '86 mm', Largura: '150 mm', 'Profundidade / espessura': '140 mm' },
    source: { title: 'MSI — MAG A650BN', url: 'https://www.msi.com/Power-Supply/MAG-A650BN/Specification' },
  },
  'case-01': {
    specs: { Altura: '493 mm', Largura: '230 mm', 'Profundidade / espessura': '478 mm', 'Altura máxima do cooler': '180 mm', 'Comprimento máximo da GPU': '400 mm' },
    source: { title: 'Montech — AIR 903 MAX', url: 'https://www.montechpc.com/air-903-max' },
  },
};

const aliases: Record<string, string> = {
  'Memória & Armazenamento': 'Memória e armazenamento', 'Memória & SSD': 'Memória e armazenamento',
  'Bateria & Autonomia': 'Bateria', 'Garantia & Suporte': 'Garantia e suporte', Garantia: 'Garantia e suporte',
  'Conexão': 'Conectividade', 'Conexões': 'Conectividade', Portas: 'Conectividade', 'Tamanho & Resolução': 'Tela',
};

export function completeSpecifications<T extends Product | PCComponent>(product: T): T {
  const extra = details[product.id];
  const specs = Object.fromEntries(Object.entries(product.specs).map(([key, value]) => [aliases[key] || key, value]));
  return {
    ...product,
    specs: {
      Peso: 'Sem informação', Altura: 'Sem informação', Largura: 'Sem informação',
      'Profundidade / espessura': 'Sem informação', 'Peso com embalagem': 'Sem informação',
      ...specs, ...(product.id.startsWith('gpu-') ? { 'Modelo de referência': 'Sem informação — confirme o fabricante e a versão específica da placa' } : {}), ...extra?.specs,
    },
    specificationSource: extra?.source,
  };
}
