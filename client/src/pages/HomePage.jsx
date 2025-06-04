import React, { useState } from "react";
// יש לוודא ש-Tailwind CSS ו-Animate.css נטענים בפרויקט

// Header – תפריט עליון עם לוגו וכפתורי התחברות/הרשמה
function Header() {
    return (
        <header className="flex justify-between items-center px-8 py-4 w-full
                       text-white bg-transparent">
            {/* שם המותג / לוגו */}
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-brand)" }}>
                WorkNow
            </h1>
            {/* קישורי ניווט */}
            <div className="space-x-4">
                <a href="#login" className="text-white hover:underline">Login</a>
                <a href="#signup"
                   className="btn-primary inline-block hover:shadow-md transition">
                    Sign Up
                </a>
            </div>
        </header>
    );
}

// HeroSection – אזור הגיבור עם וידאו רקע, כותרות וקריאות לפעולה
function HeroSection() {
    return (
        <div className="relative h-screen bg-black">
            {/* וידאו רקע */}
            <video
                className="absolute inset-0 w-full h-full object-cover z-0"
                src="path/to/your-video.mp4" autoPlay muted loop playsInline
                poster="" /* תמונת רקע אופציונלית בזמן טעינת הווידאו */
            />
            {/* שכבת כיסוי כהה לשיפור הניגודיות */}
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

            {/* הוספת Header מעל ה-Hero */}
            <Header />

            {/* תוכן טקסטואלי ב-Hero */}
            <div className="relative z-20 flex flex-col items-center justify-center
                      text-center h-full px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white
                       animate__animated animate__fadeInDown">
                    הזמינו שירות במגע כפתור
                </h2>
                <p className="text-xl text-white mt-4 mb-8 max-w-xl
                      animate__animated animate__fadeIn">
                    כל בעלי המקצוע לבית ולעסק זמינים אצלכם באפליקציה אחת
                </p>
                <div className="space-x-4 animate__animated animate__fadeInUp">
                    <a href="#signup"
                       className="btn-primary inline-block text-lg hover:shadow-lg transition">
                        התחל עכשיו
                    </a>
                    <a href="#login"
                       className="inline-block text-lg font-medium text-white underline hover:no-underline">
                        כבר רשום? התחבר
                    </a>
                </div>
            </div>
        </div>
    );
}

// BenefitsSection – הצגת יתרונות השירות בכרטיסים עם אייקונים
function BenefitsSection() {
    const benefits = [
        {
            icon: (
                // אייקון ברק (שירות מהיר)
                <svg className="w-12 h-12 mb-3" style={{ color: "var(--color-brand)" }}
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "מהיר ונוח",
            text: "הזמינו בעלי מקצוע ותאמו ביקור בתוך דקות, בלחיצת כפתור."
        },
        {
            icon: (
                // אייקון מגן עם סימן וי (אמינות)
                <svg className="w-12 h-12 mb-3" style={{ color: "var(--color-brand)" }}
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
                   11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824
                   10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "אמין ומקצועי",
            text: "כל נותני השירות מאושרים ובעלי דירוג גבוה ממשתמשים אחרים."
        },
        {
            icon: (
                // אייקון מפתח ומברג (מגוון שירותים)
                <svg className="w-12 h-12 mb-3" style={{ color: "var(--color-brand)" }}
                     fill="none" stroke="currentColor" strokeWidth="1.5"
                     strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42
                   15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655
                   5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164
                   1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004
                   3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091
                   1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25
                   3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615
                   8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
            ),
            title: "כל השירותים במקום אחד",
            text: "חשמלאים, אינסטלטורים, טכנאים, מנקים ועוד – כל השירותים זמינים."
        }
    ];

    return (
        <section className="py-16 px-4 text-center"
                 style={{ backgroundColor: "var(--color-bg)" }}>
            <h2 className="text-3xl font-bold mb-12" style={{ color: "var(--color-text)" }}>
                למה WorkNow?
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="bg-[var(--color-bg-card)] p-6 rounded-xl shadow
                                    hover:shadow-lg transition transform hover:-translate-y-1
                                    animate__animated animate__fadeInUp">
                        {benefit.icon}
                        <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                            {benefit.title}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                            {benefit.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// TestimonialsSection – אזור המלצות משתמשים (סליידר ציטוטים)
function TestimonialsSection() {
    const testimonials = [
        { quote: "“אפליקציה מצוינת! מצאתי חשמלאי תוך 5 דקות.”", author: "יוסי מ." },
        { quote: "“חסכתי הרבה זמן בחיפוש בעלי מקצוע, ממליצה בחום.”", author: "דנה ק." },
        { quote: "“שירות מעולה ומהיר - השתמשתי כבר שלוש פעמים!”", author: "אבי ל." }
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevTestimonial = () => {
        setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
    };
    const nextTestimonial = () => {
        setCurrentIndex((currentIndex + 1) % testimonials.length);
    };

    return (
        <section className="py-16 px-4" style={{ backgroundColor: "var(--color-bg-card)" }}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
                מה אומרים המשתמשים שלנו
            </h2>
            <div className="max-w-3xl mx-auto relative text-center">
                {/* תוכן ההמלצה */}
                {testimonials.map((t, idx) => (
                    <div key={idx} className={idx === currentIndex ? "block" : "hidden"}>
                        <p className="text-lg italic mb-4" style={{ color: "var(--color-text)" }}>
                            {t.quote}
                        </p>
                        <p className="text-sm font-semibold" style={{ color: "var(--color-text-muted)" }}>
                            – {t.author}
                        </p>
                    </div>
                ))}
                {/* כפתורי ניווט סליידר */}
                <button onClick={prevTestimonial} className="absolute left-0 top-1/2 transform -translate-y-1/2
                                                    bg-transparent border-none">
                    {/* אייקון חץ שמאלה */}
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button onClick={nextTestimonial} className="absolute right-0 top-1/2 transform -translate-y-1/2
                                                    bg-transparent border-none">
                    {/* אייקון חץ ימינה */}
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}

// HowItWorksSection – אזור "איך זה עובד" (הסבר התהליך בשלושה שלבים)
function HowItWorksSection() {
    const steps = [
        {
            icon: (
                // אייקון משתמש+ (הרשמה)
                <svg className="w-10 h-10 mb-2 mx-auto" style={{ color: "var(--color-brand)" }}
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3M6 8a4 4 0 118 0 4 4 0 01-8 0zM3 20a6 6
                   0 0112 0v1H3v-1z" />
                </svg>
            ),
            title: "הרשמה קלה",
            text: "נרשמים תוך דקות עם המייל או הפייסבוק ומיד נכנסים לאפליקציה."
        },
        {
            icon: (
                // אייקון חיפוש (זכוכית מגדלת) – בחירת שירות
                <svg className="w-10 h-10 mb-2 mx-auto" style={{ color: "var(--color-brand)" }}
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: "חיפוש ובחירה",
            text: "מוצאים את נותן השירות המתאים מתוך רשימת בעלי המקצוע וההמלצות."
        },
        {
            icon: (
                // אייקון בית (קבלת השירות)
                <svg className="w-10 h-10 mb-2 mx-auto" style={{ color: "var(--color-brand)" }}
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 12l2-2 7-7 7 7 2-2v10a1 1 0 01-1 1h-3m-6 0v-4a1 1
                   0 011-1h2a1 1 0 011 1v4m-6 0h6M5 10v10a1 1 0 001 1h3m10-11l2 2" />
                </svg>
            ),
            title: "השירות בדרך",
            text: "קובעים מועד והמקצוען יגיע עד אליכם. שבו בנחת – השירות מתבצע בביתכם."
        }
    ];

    return (
        <section className="py-16 px-4" style={{ backgroundColor: "var(--color-bg)" }}>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--color-text)" }}>
                איך זה עובד?
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {steps.map((step, idx) => (
                    <div key={idx} className="p-6">
                        {step.icon}
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                            {step.title}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                            {step.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="py-6 text-center" style={{ backgroundColor: "var(--color-bg-card)" }}>
            <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
                צרו קשר: <a href="mailto:support@worknow.com" className="underline">support@worknow.com</a>
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                עקבו אחרינו:
                {/* קישורים חברתיים (ניתן להחליף באייקונים גרפיים לפי הצורך) */}
                <a href="#" className="mx-2 underline">Facebook</a>
                <a href="#" className="mx-2 underline">Twitter</a>
                <a href="#" className="mx-2 underline">Instagram</a>
            </p>
            <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
                © 2025 WorkNow. כל הזכויות שמורות.
            </p>
        </footer>
    );
}

function HomePage() {
    return (
        <div style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>
            <HeroSection />
            <BenefitsSection />
            <TestimonialsSection />
            <HowItWorksSection />
            <Footer />
        </div>
    );
}

export default HomePage;