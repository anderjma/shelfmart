import SEO from "../components/SEO";
import { useLanguage } from "../../lib/i18n-context";

export default function PrivacyPolicy() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <SEO title={t("privacy.title", "Privacy Policy")} description="Read our privacy policy." />
            <h1 className="text-3xl font-bold text-ink-900">{t("privacy.title", "Privacy Policy")}</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-300 text-ink-700 space-y-4">
                <p>{t("privacy.welcome", "Welcome to ShelfMart's Privacy Policy. We take your privacy seriously.")}</p>
                <h2 className="text-xl font-semibold text-ink-900 mt-6">{t("privacy.dataCollectionTitle", "Data Collection")}</h2>
                <p>{t("privacy.dataCollectionText", "We collect information you provide directly to us when you create an account, make a purchase, or communicate with us.")}</p>
                <h2 className="text-xl font-semibold text-ink-900 mt-6">{t("privacy.dataUseTitle", "Use of Data")}</h2>
                <p>{t("privacy.dataUseText", "We use the information we collect to provide, maintain, and improve our services, and to process your transactions.")}</p>
            </div>
        </div>
    );
}
