import { bold } from 'chalk';
import { prepareReportData, getWcagReference } from '../src/prepareReportData';

const axeRawViolations = require('./__mock_data__/rawViolations.json');
const axeRawPasses = require('./__mock_data__/rawPasses.json');

describe('prepareReportData() test', () => {
    it('Throws an error if violations are not passed', async () => {
        expect(() => {
            prepareReportData(axeRawViolations);
        }).toThrow(
            'prepareReportData() requires violations to be passed as an object: prepareReportData({violations: Result[]})'
        );
    });
    it('Returns full report with violations', async () => {
        const report = prepareReportData({ violations: axeRawViolations });
        expect(report.violationsSummaryTable).toMatchSnapshot();
        expect(report.violationsDetailsFormatted).not.toEqual('');
        expect(report.violationsTotal).toEqual('Axe core library found 30 violations');
        expect(report.checksPassedSummary).toEqual('');
    });
    it('Returns full report with violations and passes', async () => {
        const report = prepareReportData({ violations: axeRawViolations, passes: axeRawPasses });
        expect(report.violationsSummaryTable).toMatchSnapshot();
        expect(report.violationsDetailsFormatted).not.toEqual('');
        expect(report.violationsTotal).toEqual('Axe core library found 30 violations');
        expect(report.checksPassedSummary).toEqual(`${bold('Page passed 6 axe rules:')} page-has-heading-one, region, tabindex, table-duplicate-name, table-fake-caption, td-headers-attr`);
    });
    it('Verify returns empty report', async () => {
        expect(prepareReportData({ violations: [] })).toEqual({
            checksPassedSummary: '',
            violationsDetailsFormatted: '',
            violationsSummaryTable: [],
            violationsTotal: 'No accessibility violation were detected',
        });
    });
});

describe('getWcagReference() test with different tags as an input', () => {
    it.each([
        [
            ['cat.name-role-value', 'wcag2a', 'wcag412', 'section508', 'section508.22.a'],
            'WCAG 2.0 Level A',
        ],
        [['cat.keyboard', 'best-practice'], 'Best practice'],
        [['cat.color', 'wcag2aa', 'wcag143'], 'WCAG 2.0 Level AA'],
        [['cat.color', 'experimental'], 'cat.color,experimental'],
    ])(
        'Verify wcag tag determined correctly with getWcagReference(%o) expecting (%s) in return',
        async (input: string[], expectedOutput: string) => {
            expect(await getWcagReference(input)).toEqual(expectedOutput);
        }
    );
});
