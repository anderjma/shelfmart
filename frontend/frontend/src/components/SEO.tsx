import { useEffect } from "react";

interface SEOProps {
    title: string;
    description?: string;
}

export default function SEO({ title, description }: SEOProps) {
    useEffect(() => {
        // Actualizar título
        const fullTitle = `${title} | Sistema Empresarial`;
        document.title = fullTitle;

        // Actualizar meta description
        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute("content", description);
            }
            
            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) {
                ogDescription.setAttribute("content", description);
            }
        }

        // Actualizar og:title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute("content", fullTitle);
        }
    }, [title, description]);

    return null;
}
