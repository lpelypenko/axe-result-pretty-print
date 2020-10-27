import { prettyPrintAxeReport } from '../src';
const axeRawViolations = require('./__mock_data__/rawViolations.json');
const axeRawPasses = require('./__mock_data__/rawPasses.json');

describe('printAxeReport() test', () => {
    it('Verify not throwing an error', async () => {
        prettyPrintAxeReport({ violations: axeRawViolations, passes: axeRawPasses });
    });
    it('outputs with url', async () => {
        prettyPrintAxeReport({
            violations: axeRawViolations,
            passes: axeRawPasses,
            url: 'www.example.com',
        });
    });
    it('skips report table', async () => {
        prettyPrintAxeReport({
            violations: axeRawViolations,
            passes: axeRawPasses,
            url: 'www.example.com',
            skipResultTable: true,
        });
    });
    it('no violations', async () => {
        prettyPrintAxeReport({
            violations: [],
            url: 'www.example.com',
        });
    });
    it('Verify throwing an  error if violations are not passed', async () => {
        expect(() => {
            //@ts-ignore
            prettyPrintAxeReport({ passes: axeRawPasses });
        }).toThrow(
            'prepareReportData() requires violations to be passed as an object: prepareReportData({violations: Result[]})'
        );
    });
});
