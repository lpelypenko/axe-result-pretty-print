import { Result } from 'axe-core';

interface Summary {
    description: string;
    id: string;
    wcag: string;
    impact: string;
    nodes: number;
}

export interface SpecPreparedData {
    violationsTotal: string;
    violationsSummaryTable: Summary[] | [];
    violationsDetailsFormatted: string;
    checksPassedSummary?: string;
}

export interface SpecReportInput {
    violations: Result[];
    passes?: Result[];
    url?: string;
    skipResultTable?: boolean;
}
