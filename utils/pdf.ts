
import { WorkEntry, Filter } from '../types';
import { formatHours, formatDate } from './time';

const generatePdf = (title: string, subtitle: string[], totalMinutes: number, entries: WorkEntry[], columns: any[], rowGenerator: (entry: WorkEntry) => string[], filename: string) => {
    const { jsPDF } = (window as any).jspdf;
    if (!jsPDF) {
        alert('PDF library not loaded.');
        return;
    }
    const doc = new jsPDF();

    doc.setFont('helvetica', 'normal');

    // Title
    doc.setFontSize(20);
    doc.text(title, 20, 20);

    // Subtitle / Filters
    doc.setFontSize(10);
    let subY = 30;
    subtitle.forEach(line => {
        doc.text(line, 20, subY);
        subY += 7;
    });

    // Total
    doc.setFontSize(14);
    doc.text(`Total: ${formatHours(totalMinutes)}`, 20, subY + 7);

    // Table Headers
    doc.setFontSize(10);
    let y = subY + 22;
    doc.setFont(undefined, 'bold');
    columns.forEach(col => doc.text(col.header, col.x, y));

    // Separator line
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    // Table Rows
    doc.setFont(undefined, 'normal');
    entries.forEach(entry => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const rowData = rowGenerator(entry);
        columns.forEach((col, index) => doc.text(rowData[index], col.x, y));
        y += 8;
    });

    // Final line and total
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', 150, y);
    doc.text(formatHours(totalMinutes), 175, y);

    // Download
    doc.save(filename);
};


export const exportCompanyPDF = (companyName: string, entries: WorkEntry[]) => {
    const companyEntries = entries.filter(e => e.company === companyName)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const totalMinutes = companyEntries.reduce((sum, entry) => sum + entry.minutes, 0);

    generatePdf(
        `Relevé d'heures - ${companyName}`,
        [`Exporté le ${new Date().toLocaleDateString('fr-FR')}`],
        totalMinutes,
        companyEntries,
        [
            { header: 'Date', x: 20 },
            { header: 'Début', x: 60 },
            { header: 'Fin', x: 90 },
            { header: 'Pause', x: 120 },
            { header: 'Total', x: 160 }
        ],
        (entry) => [
            formatDate(entry.date),
            entry.start_time,
            entry.end_time,
            `${entry.break_time} min`,
            formatHours(entry.minutes)
        ],
        `heures-${companyName.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.pdf`
    );
};

export const exportFilteredPDF = (filteredEntries: WorkEntry[], filters: Filter) => {
    const totalMinutes = filteredEntries.reduce((sum, entry) => sum + entry.minutes, 0);

    let filterText: string[] = [];
    if (filters.company) filterText.push(`Société: ${filters.company}`);
    if (filters.dateFrom) filterText.push(`Du: ${formatDate(filters.dateFrom)}`);
    if (filters.dateTo) filterText.push(`Au: ${formatDate(filters.dateTo)}`);

    generatePdf(
        `Relevé d'heures filtré`,
        [...filterText, `Exporté le ${new Date().toLocaleDateString('fr-FR')}`],
        totalMinutes,
        filteredEntries,
        [
            { header: 'Date', x: 20 },
            { header: 'Société', x: 50 },
            { header: 'Début', x: 100 },
            { header: 'Fin', x: 125 },
            { header: 'Pause', x: 150 },
            { header: 'Total', x: 175 }
        ],
        (entry) => [
            formatDate(entry.date),
            entry.company.substring(0, 15),
            entry.start_time,
            entry.end_time,
            `${entry.break_time}'`,
            formatHours(entry.minutes)
        ],
        `heures-filtre-${new Date().toISOString().split('T')[0]}.pdf`
    );
};
