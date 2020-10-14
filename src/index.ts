import { prepareReportData } from './prepareReportData';
import { SpecReportInput } from './SpecReportTypes';

/**
 * pretty print outputs only violations and passes
 * @param report
 */
export function prettyPrintAxeReport(report: SpecReportInput): void {
    try {
        const preparedData = prepareReportData({
            violations: report.violations,
            passes: report.passes,
            url: report.url,
        });
        // Print summary of violations as a table
        if (preparedData.violationsSummaryTable.length !== 0) {
            console.info(preparedData.violationsTotal);
            if (!report.skipResultTable) {
                console.table(preparedData.violationsSummaryTable);
            }
            console.info(preparedData.violationsDetailsFormatted);
        }
        if (preparedData.checksPassedSummary !== '') {
            console.info(preparedData.checksPassedSummary);
        }
    } catch (e) {
        // throw the error only if user made a mistake in passing wrong variable
        if (e instanceof TypeError) {
            throw e;
        }
        console.log(`printAxeReport() failed with an error${e}`);
    }
}
