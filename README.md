# axe-result-pretty-print

The module allows to make readable output for aXe core accessibility results from raw aXe result object.
Prints violations summary in a table, violations details and small summary of passed rules.

Allows skipping violations summary table print.

See [sample console output](sampleOutput.png)

## Install

```
npm i axe-result-pretty-print
```

## Usage

### Example usage in TestCafe

To run TestCafe tests with axe-core, install testcafe, axe-core and [@testcafe-community/axe](https://www.npmjs.com/package/@testcafe-community/axe):

```shell script
npm i -D axe-result-pretty-print testcafe axe-core @testcafe-community/axe
```

For TestCafe example add the following clientScript in your `.testcaferc.json` config:

```json
{
    "clientScripts": [{ "module": "axe-core/axe.min.js" }]
}
```

Full TestCafe test example is bellow:

```javascript
import { runAxe } from '@testcafe-community/axe';
import { prettyPrintAxeReport } from 'axe-result-pretty-print';
import { t } from 'testcafe';

fixture('TestCafe test with Axe').page('http://example.com');

test('Automated accessibility testing', async (t) => {
    const axeContext = { exclude: [['select']] };
    // example with providing specific axe rules
    const axeOptions = {
        rules: { 'color-contrast': { enabled: true }, 'duplicate-id': { enabled: true } },
    };
    const { error, results } = await runAxe(axeContext, axeOptions);
    await t.expect(error).eql(null, `axe check failed with an error: ${error.message}`);
    // prints full report with failed violations and passed rules summary
    prettyPrintAxeReport({
        violations: results.violations,
        passes: results.passes,
        url: 'www.example.com',
    });
});
```
