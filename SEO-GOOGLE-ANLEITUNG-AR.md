# BuntBewegt – Google SEO / Anleitung zur Indexierung

**Domain in der Website-Konfiguration:** `https://buntbewegt.com/`  
**Wichtig:** Vor dem Einreichen bestätigen, dass genau diese Domain öffentlich funktioniert und alle Seiten per HTTPS erreichbar sind. Ein CNAME-Eintrag in der Projektdatei beweist noch nicht, dass DNS und Hosting bereits funktionieren.

## ماذا أجهزت الحزمة؟

- `sitemap.xml`: خريطة XML تتضمن **23 صفحة HTML** و**44 رابطًا لصور موجودة فعليًا في الموقع**.
- `robots.txt`: يسمح بالزحف ويعلن موقع خريطة XML.
- صفحات HTML المعدلة: روابط `canonical` مطلقة ومطابقة للخريطة، وروابط Open Graph صحيحة، وبيانات JSON-LD (`Organization` و`WebSite` و`WebPage` و`BreadcrumbList` و`Service` في صفحات الخدمات المناسبة).
- `seo-configure.py`: يعيد إنشاء الملفات عند إضافة صفحات أو تغيير الدومين. لا يحتاج مكتبات خارجية.

## طريقة التركيب

1. ارفع **الملفات الموجودة في حزمة PATCH** إلى مجلد الموقع الرئيسي **مع الحفاظ على نفس الأسماء والمسارات**؛ وهو المجلد الذي يحتوي أصلًا على `index.html` و`events.html` و`images/`. اترك الصور والتصميم والملفات الأخرى كما هي.
2. إذا تستخدم GitHub Pages، احفظ التعديلات في مستودع الموقع وانشرها كالمعتاد؛ لا ترفع ZIP مباشرة إلى Search Console.
3. افتح في المتصفح بعد النشر:
   - `https://buntbewegt.com/`
   - `https://buntbewegt.com/robots.txt`
   - `https://buntbewegt.com/sitemap.xml`
   - `https://buntbewegt.com/events.html`
4. يجب أن تعمل الروابط بدون خطأ `404` وأن يكون البروتوكول `https`. تأكد أيضًا من توحيد `www` وبدونه عبر تحويل دائم 301/308 في إعدادات الاستضافة إن كان كلاهما يعمل.
5. ادخل إلى [Google Search Console](https://search.google.com/search-console). أضف خاصية **Domain** (`buntbewegt.com`) وأثبت ملكيتها بواسطة سجل DNS TXT الذي **يمنحك إياه Google**؛ لا يمكن اختلاق رمز التحقق.
6. افتح تبويب **Sitemaps** في Search Console وأدخل: `sitemap.xml`، ثم اضغط **Submit**. لا يُرسل ملف ZIP ولا ملف XML محلي مباشرة إلى Google؛ المطلوب هو عنوان الملف المنشور علنًا.
7. من **URL Inspection**، اختبر الصفحة الرئيسية وبعض الصفحات المهمة، مثل `angebote.html` و`events.html` و`kindergeburtstage.html` و`teambuilding.html` و`workshops-projektwochen.html`، ثم استخدم **Request indexing** حيث يكون مناسبًا.
8. بعد ذلك راقب **Page indexing** و**Performance** واصلح أي تحذيرات. لا تضمن خريطة الموقع الفهرسة أو ترتيب نتائج البحث.

## تحديث الخريطة لاحقًا

من داخل مجلد الموقع شغّل:

```bash
python3 seo-configure.py --domain https://buntbewegt.com
```

ثم ارفع HTML و`robots.txt` و`sitemap.xml` المتجددة إلى الاستضافة. عند تغيير نطاق الموقع، استخدم النطاق الجديد الصحيح وقم بإعداد التحويلات على الاستضافة. لا تضع تاريخ تعديل وهميًا في خريطة الموقع.

## ملاحظات مهمة

- لم تتم إضافة رقم هاتف أو عنوان شارع أو تقييمات أو ساعات عمل غير مؤكدة.
- روابط مواقع التواصل الموجودة أصلًا في الموقع فقط هي التي استُخدمت في بيانات المؤسسة.
- العناوين والأوصاف الألمانية الموجودة أصلًا محفوظة.
- **حالة الاستضافة المباشرة غير مؤكدة**؛ يجب اختبار رابط الموقع بعد الرفع. لا تعني هذه الحزمة أن Google فهرست الموقع بالفعل.
- تم الاعتماد على إرشادات Google Search Central الرسمية حول خرائط المواقع وCanonical وبيانات المؤسسات.
