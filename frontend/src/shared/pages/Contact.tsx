// This file presents the business's contact information and social media links.
import { Phone, Mail } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";
import SEO from "../components/SEO";
import { useLanguage } from "../../lib/i18n-context";

// This component renders a static interface with the support channels available to customers.
export default function Contact() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <SEO title={t("contact.title", "Contact Us")} description={t("contact.subtitle", "Contact us through our official channels. We are ready to assist you.")} />
            <h1 className="text-3xl font-bold text-ink-900 mb-8 text-center">{t("contact.title", "Contact Us")}</h1>

            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-sand-300 dark:border-slate-700 p-5 sm:p-8">
                <p className="text-ink-700 dark:text-slate-300 text-center mb-10 text-lg">
                    {t("contact.subtitle", "Have a question or inquiry? We're here to help you through any of our official channels.")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-ink-900 dark:text-white border-b border-sand-300 dark:border-slate-700 pb-2">{t("contact.customerService", "Customer Service")}</h2>
                        <div className="flex items-center text-ink-700 dark:text-slate-300">
                            <Phone className="w-6 h-6 text-accent-500 dark:text-accent-400 mr-4" />
                            <div>
                                <p className="font-medium text-ink-900 dark:text-white">{t("contact.phone", "Phone")}</p>
                                <a href="tel:+50688888888" className="text-accent-500 dark:text-accent-400 hover:underline">+506 8888-8888</a>
                            </div>
                        </div>
                        <div className="flex items-center text-ink-700 dark:text-slate-300">
                            <Mail className="w-6 h-6 text-accent-500 dark:text-accent-400 mr-4" />
                            <div>
                                <p className="font-medium text-ink-900 dark:text-white">{t("contact.email", "Email")}</p>
                                <a href="mailto:info@shelfmart.com" className="text-accent-500 dark:text-accent-400 hover:underline">info@shelfmart.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-ink-900 dark:text-white border-b border-sand-300 dark:border-slate-700 pb-2">{t("contact.socialMedia", "Our Social Media")}</h2>

                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-ink-700 dark:text-slate-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors">
                            <SiFacebook className="w-6 h-6 mr-4" aria-hidden="true" />
                            <span className="font-medium">Facebook</span>
                        </a>

                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-ink-700 hover:text-accent-500 transition-colors">
                            <SiInstagram className="w-6 h-6 mr-4" aria-hidden="true" />
                            <span className="font-medium">Instagram</span>
                        </a>

                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-ink-700 hover:text-accent-500 transition-colors">
                            <SiTiktok className="w-6 h-6 mr-4" aria-hidden="true" />
                            <span className="font-medium">TikTok</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
