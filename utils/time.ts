
export const calculateMinutes = (start: string, end: string, breakMinutes: number): number => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let startTotalMinutes = startH * 60 + startM;
    let endTotalMinutes = endH * 60 + endM;

    // Handle overnight shifts
    if (endTotalMinutes < startTotalMinutes) {
        endTotalMinutes += 24 * 60;
    }

    const totalMinutes = Math.max(0, endTotalMinutes - startTotalMinutes - Number(breakMinutes));
    return totalMinutes;
};

export const formatHours = (minutes: number): string => {
    if (isNaN(minutes)) return "0h00";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m.toString().padStart(2, '0')}`;
};

export const formatDate = (dateStr: string): string => {
    try {
        const [year, month, day] = dateStr.split('-');
        if (!year || !month || !day) return dateStr;
        return `${day}/${month}/${year}`;
    } catch {
        return dateStr;
    }
};
