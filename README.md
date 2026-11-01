# Churn Radar: AI Customer Retention Platform

منصة ذكية متكاملة للتنبؤ بتسرب العملاء (Customer Churn Prediction) مع دعم التحليل التنبؤي، تفسير أسباب التسرب، وتوليد عروض استبقاء موجهة لكل عميل مع إرسال تلقائي للإشعارات عبر البريد الإلكتروني والواتساب بنقرة واحدة.

---

## 📁 هيكل المشروع (Project Architecture)

المشروع منظم بالكامل في 4 مجلدات رئيسية:

```
churn_backend/
├── ai/                         # الذكاء الاصطناعي ونموذج التعلم الآلي
│   ├── core/
│   │   ├── ml.py               # خط أنابيب التنبؤ وتوليد العروض والتفسير
│   │   └── schema.py           # تعريف أعمدة البيانات والخصائص
│   ├── model/
│   │   ├── model.joblib        # النموذج المدرب (Pipeline)
│   │   └── metrics.json        # مقاييس أداء النموذج والتقييم
│   ├── train.py                # سكريبت تدريب النموذج
│   └── make_data.py            # سكريبت توليد بيانات الاتصال التجريبية
│
├── backend/                    # خادم الواجهة الخلفية (FastAPI Server)
│   ├── main.py                 # نقاط الاتصال (RESTful API Endpoints)
│   ├── db.py                   # قاعدة البيانات والتحليلات
│   ├── notify.py               # محرك الإشعارات (SMTP / Gmail & WhatsApp)
│   └── tests/
│       └── test_api.py         # اختبارات النظام الشاملة (Unit & Integration Tests)
│
├── frontend/                   # الواجهة الأمامية الحديثة (React + Vite + Tailwind CSS)
│   ├── src/                    # المكونات والصفحات وإدارة الحالة
│   ├── package.json            # الاعتماديات ومكتبات الواجهة
│   └── vite.config.ts
│
├── data/                       # ملفات البيانات
│   ├── telco_original.csv      # مجموعة بيانات Telco الأصلية
│   ├── telco_with_contacts.csv # البيانات مضافاً إليها جهات الاتصال
│   └── sample_upload.csv       # نموذج تجريبي جاهز للرفع والتحليل
│
├── .env.example                # نموذج إعداد المتغيرات البيئية
├── pytest.ini                  # إعدادات بيئة الاختبارات
└── requirements.txt            # متطلبات بايثون
```

---

## 🚀 طريقة التشغيل (Quick Start)

### 1. إعداد وتشغيل الـ Backend
```bash
# إنشاء وتفعيل البيئة الافتراضية
python3 -m venv .venv
source .venv/bin/activate

# تثبيت الاعتماديات
pip install -r requirements.txt

# تشغيل خادم الـ API
uvicorn backend.main:app --reload
```
- واجهة التوثيق التفاعلية (Swagger API Docs): `http://localhost:8000/docs`

### 2. إعداد وتشغيل الـ Frontend
```bash
cd frontend
npm install
npm run dev
```
- واجهة المستخدم: `http://localhost:5173`

---

## ⚡ الميزات الرئيسية

1. **تحليل تنبؤي فوري:** رفع ملفات CSV أو Excel وتوقع احتمال مغادرة كل عميل مع إظهار النسبة المئوية لدرجة الخطر.
2. **تفسير القرارات (Explainable AI):** توضيح الأسباب الحقيقية وراء تصنيف كل عميل كمعرض للتسرب.
3. **عروض استبقاء ذكية ومخصصة:** اقتراح تلقائي للعرض الأنسب لكل عميل بناءً على أسباب رغبته في المغادرة.
4. **إرسال إيميلات حقيقية مخصصة تلقائياً:** فور الانتهاء من التحليل، يتم إرسال بريد إلكتروني باسم العميل وعرضه المخصص عبر Gmail SMTP.
5. **إرسال واتساب بنقرة واحدة (1-Click WhatsApp):** زر مخصص في جدول العملاء لفتح محادثة واتساب مع العميل مباشرةً بالرسالة المجهزة مسبقاً وبالمجان.

---

## 🧪 تشغيل الاختبارات (Tests)
```bash
pytest backend/tests/test_api.py -v
```
