import { useEffect } from "react";

interface SEOProps {
    title: string;
    description?: string;
}

export default function SEO({ title, description }: SEOProps) {
    useEffect(() => {
        // Update title
        const fullTitle = `${title} | ShelfMart`;
        document.title = fullTitle;

        // Update meta description
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

        // Update og:title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute("content", fullTitle);
        }
    }, [title, description]);

    return null;
}
