#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate robust static SEO for BuntBewegt (Python 3 standard library + BeautifulSoup not required).
Usage: python3 seo-configure.py --domain https://buntbewegt.com
Idempotent; run after adding or removing HTML pages, or after a domain change.
No actual publishing or Google indexing is performed by this script.
"""
from pathlib import Path
from urllib.parse import urlsplit, urljoin, unquote
from xml.sax.saxutils import escape as xml_escape
from html.parser import HTMLParser
import argparse
import json
import html
import re

ROOT = Path(__file__).resolve().parent
SITE_NAME = 'BuntBewegt'
INSTAGRAM = 'https://www.instagram.com/buntbewegt.de/'

parser=argparse.ArgumentParser(description='Generate canonical URLs, social previews, structured data and Google XML sitemap.')
parser.add_argument('--domain', default='https://buntbewegt.com', help='Real public HTTPS site origin, without path')
args=parser.parse_args()
origin=args.domain.rstrip('/')
parts=urlsplit(origin)
if parts.scheme!='https' or not parts.netloc or parts.path not in ('','/') or parts.query or parts.fragment:
    parser.error('Use only a real HTTPS domain such as https://buntbewegt.com')
base=origin+'/'

# Only add fields that are supported by the actual website; do not invent addresses, phone numbers, ratings or business hours.
services={
 'events.html': 'Events und Mitmachstationen',
 'kindergeburtstage.html':'Kindergeburtstage',
 'teambuilding.html':'Teambuilding für Gruppen und Schulen',
 'workshops-projektwochen.html':'Workshops und Projektwochen',
 'bewegung-spiel.html':'Bewegung und Spiel',
 'kreative-workshops.html':'Kreative Workshops',
 'gemeinsame-erlebnisse.html':'Gemeinsame Erlebnisse'
}
collections={'angebote.html':'CollectionPage','news-events.html':'CollectionPage',
             'netzwerk.html':'CollectionPage','bilder-material.html':'CollectionPage',
             'kontakt.html':'ContactPage','ueber-buntbewegt.html':'AboutPage'}

class MainImageParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.in_main=0; self.images=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag=='main': self.in_main+=1
        if tag=='img' and self.in_main:
            src=d.get('src')
            if src and src.startswith('images/') and src.split('?')[0].lower().endswith(('.png','.jpg','.jpeg','.webp')):
                self.images.append(src.split('?')[0])
    def handle_endtag(self,tag):
        if tag=='main': self.in_main=max(0,self.in_main-1)

def strip_tags(raw): return re.sub(r'<[^>]*>','',raw)
def extract_title(head,filename):
    t=re.search(r'(?is)<title>(.*?)</title>',head)
    desc=re.search(r'(?is)<meta\s+[^>]*\bname\s*=\s*["\']description["\'][^>]*>',head)
    if not t or not desc: raise ValueError('Missing title or description in '+filename)
    dm=re.search(r'\bcontent\s*=\s*(["\'])(.*?)\1',desc.group(0),re.I|re.S)
    if not dm: raise ValueError('Missing description content in '+filename)
    return html.unescape(strip_tags(t.group(1))).strip(),html.unescape(dm.group(2)).strip()

def item_name(title):
    return re.sub(r'\s*[|–-]\s*BuntBewegt(?: Kiel)?\s*$','',title).strip()

def meta_tag_replace(head,key,value,kind='property'):
    pat=re.compile(r'<meta\b(?=[^>]*\b'+kind+r'\s*=\s*["\']'+re.escape(key)+r'["\'])[^>]*>',re.I)
    clean=f'<meta {kind}="{html.escape(key,quote=True)}" content="{html.escape(value,quote=True)}">'
    if pat.search(head): return pat.sub(clean,head,count=1)
    return head+'\n'+clean+'\n'

pages=sorted(ROOT.glob('*.html'))
urls=[]
org_id=base+'#organization'; site_id=base+'#website'
for p in pages:
    url=base if p.name=='index.html' else base+p.name
    source=p.read_text(encoding='utf-8')
    match=re.search(r'(?is)(<head\b[^>]*>)(.*?)(</head\s*>)',source)
    if not match: raise ValueError('No HTML <head> in '+p.name)
    head=match.group(2)
    # Remove any previous package tags and relative/fallback canonicals.
    head=re.sub(r'\s*<!-- SEO-DOMAIN-START -->.*?<!-- SEO-DOMAIN-END -->','',head,flags=re.I|re.S)
    head=re.sub(r'\s*<!-- SEO-ENHANCED-START -->.*?<!-- SEO-ENHANCED-END -->','',head,flags=re.I|re.S)
    head=re.sub(r'<link\b(?=[^>]*\brel\s*=\s*["\']canonical["\'])[^>]*>\s*','',head,flags=re.I)
    head=re.sub(r'<meta\b(?=[^>]*\bproperty\s*=\s*["\']og:url["\'])[^>]*>\s*','',head,flags=re.I)
    # Previous seo script may already contain JSON-LD; don't remove unrelated authored scripts.
    # HTML5: charset declaration should appear near the beginning of <head> (within the first 1024 bytes).
    head=re.sub(r'<meta\s+charset\s*=\s*["\']?utf-8["\']?\s*/?>\s*','',head,flags=re.I)
    head='\n<meta charset="utf-8">\n'+head
    title,description=extract_title(head,p.name)
    head=meta_tag_replace(head,'og:image',base+'images/buntbewegt-social-preview.jpg')
    head=meta_tag_replace(head,'twitter:image',base+'images/buntbewegt-social-preview.jpg','name')
    head=meta_tag_replace(head,'og:type','article' if p.name.startswith('event-') else 'website')
    name=item_name(title)
    graph=[]
    if p.name=='index.html':
        graph.append({'@type':'Organization','@id':org_id,'name':SITE_NAME,'url':base,
          'description':'Bewegung, Kreativität und Gemeinschaft aus Kiel.',
          'logo':{'@type':'ImageObject','url':base+'images/logo-buntbewegt-neu.png'},
          'sameAs':[INSTAGRAM],
          'areaServed':{'@type':'Place','name':'Kiel, Schleswig-Holstein, Deutschland'}})
        graph.append({'@type':'WebSite','@id':site_id,'url':base,'name':SITE_NAME,
          'inLanguage':'de-DE','publisher':{'@id':org_id}})
    breadcrumbs=[]
    if p.name!='index.html':
        breadcrumbs.append({'@type':'ListItem','position':1,'name':'Startseite','item':base})
        parent=None
        if p.name in services or p.name in ('angebote.html',):
            if p.name!='angebote.html': parent=('Angebote',base+'angebote.html')
        elif p.name.startswith('event-'):
            parent=('News & Events',base+'news-events.html')
        if parent: breadcrumbs.append({'@type':'ListItem','position':2,'name':parent[0],'item':parent[1]})
        breadcrumbs.append({'@type':'ListItem','position':len(breadcrumbs)+1,'name':name,'item':url})
        graph.append({'@type':'BreadcrumbList','@id':url+'#breadcrumb',
                      'itemListElement':breadcrumbs})
    wp={'@type':collections.get(p.name,'WebPage'),'@id':url+'#webpage','url':url,
        'name':title,'description':description,'inLanguage':'de-DE',
        'isPartOf':{'@id':site_id},'about':{'@id':org_id}}
    if p.name!='index.html': wp['breadcrumb']={'@id':url+'#breadcrumb'}
    graph.append(wp)
    if p.name in services:
        graph.append({'@type':'Service','@id':url+'#service','name':services[p.name],
                      'description':description,'url':url,'inLanguage':'de-DE',
                      'provider':{'@id':org_id},
                      'areaServed':{'@type':'Place','name':'Kiel und Umgebung'}})
    jsonld=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    block=('\n<!-- SEO-ENHANCED-START -->\n'
           f'<link rel="canonical" href="{html.escape(url,quote=True)}">\n'
           f'<meta property="og:url" content="{html.escape(url,quote=True)}">\n'
           '<meta property="og:image:width" content="1200">\n'
           '<meta property="og:image:height" content="630">\n'
           f'<script type="application/ld+json">{jsonld}</script>\n'
           '<!-- SEO-ENHANCED-END -->\n')
    head=head+block
    output=source[:match.start(2)]+head+source[match.end(2):]
    p.write_text(output,encoding='utf-8')
    imgparser=MainImageParser(); imgparser.feed(output)
    imgs=[]
    for path in imgparser.images:
        if (ROOT/path).is_file() and path not in imgs:
            imgs.append(path)
        if len(imgs)>=3:break
    urls.append((url,imgs))

(ROOT/'robots.txt').write_text('''# BuntBewegt — search engine crawler guidance
User-agent: *
Allow: /

Sitemap: '''+base+'''sitemap.xml
''',encoding='utf-8')
xml=['<?xml version="1.0" encoding="UTF-8"?>',
     '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
for url,images in sorted(urls,key=lambda v:(v[0]!=base,v[0])):
    xml.append('  <url>')
    xml.append('    <loc>'+xml_escape(url)+'</loc>')
    for img in images:
        xml.append('    <image:image><image:loc>'+xml_escape(base+img)+'</image:loc></image:image>')
    xml.append('  </url>')
xml.append('</urlset>')
(ROOT/'sitemap.xml').write_text('\n'.join(xml)+'\n',encoding='utf-8')
print(f'SEO ready for {base}; {len(urls)} pages; {sum(len(im) for _,im in urls)} image references in sitemap.')
