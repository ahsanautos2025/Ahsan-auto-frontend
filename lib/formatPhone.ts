export const formatPhone = (phone?: string) => {
    if (typeof phone !== 'string') return '';

    // Remove non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Match +880 followed by 10 digits starting with 1
    const match = cleaned.match(/^\+880(\d{3})(\d{3})(\d{4})$/);

    if (!match) return phone; // return original if not valid

    // Format: +880 181 234 5678
    return `+880 ${match[1]} ${match[2]} ${match[3]}`;
};
