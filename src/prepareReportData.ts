import { bold } from 'chalk';
import { SpecPreparedData, SpecReportInput } from './SpecReportTypes';

/**
 * Axe returns variety of tags that are not necessary for our purposes.
 * We are interested only in WCAG related tags and Best Practices.
 * Function tries to determine if tag belongs to Best Practice or any WCAG 2.x, otherwise all tags will be returned raw
 * @param tags
 * @returns {string}
 */
export function getWcagReference(tags: string[]): string {
    const tagsNames = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];
    const foundTags = tags.filter((tag) => tagsNames.includes(tag));

    const tagNamesToAccessibilityStandard: Record<string, string> = {
        wcag2a: 'WCAG 2.0 Level A',
        wcag2aa: 'WCAG 2.0 Level AA',
        wcag21a: 'WCAG 2.1 Level A',
        wcag21aa: 'WCAG 2.1 Level AA',
        'best-practice': 'Best practice',
    };

    if (foundTags.length > 0) {
        return foundTags.map((tag) => tagNamesToAccessibilityStandard[tag]).join(',');
    }

    return tags.join(',');
}

/**
 * Prepare report splitting it into sections:
 * - total accessibility violations (counting nodes)
 * - summary of violations that could be printed as table
 * - detailed list of violations that could be printed as formatted text
 * @param violations
 * @param passes
 * @param url
 */
export function prepareReportData({ violations, passes, url }: SpecReportInput): SpecPreparedData {
    if (!violations) {
        throw new TypeError(
            'prepareReportData() requires violations to be passed as an object: prepareReportData({violations: Result[]})'
        );
    }
    const passesIds = passes
        ? passes
              .map(({ id }) => {
                  return id;
              })
              .join(', ')
        : '';
    const checksPassedSummary = passes
        ? `${bold(`Page passed ${passes.length} axe rules:`)} ${passesIds}`
        : '';
    if (violations.length === 0) {
        return {
            violationsTotal: `No accessibility violation were detected${
                url ? ` for the ${url}` : ''
            }`,
            violationsSummaryTable: [],
            violationsDetailsFormatted: '',
            checksPassedSummary,
        };
    }
    const total = violations.reduce((acc, { nodes }) => {
        acc += nodes.length;
        return acc;
    }, 0);
    const violationsTotal = `Axe core library found ${total} violation${total === 1 ? '' : 's'}${
        url ? ` for the ${url}` : ''
    }`;
    // Prepare data to show summary
    const violationsSummaryTable = violations.map(({ nodes, description, id, tags, impact }) => ({
        description,
        id,
        wcag: getWcagReference(tags),
        impact: impact || 'n/a',
        nodes: nodes.length,
    }));

    // Prepare data to show detailed list of violations
    const violationsDetailsFormatted = violations
        .map(({ nodes, description, help, id, tags, helpUrl }, i) => {
            const wcagRef = `   ${bold('WCAG: ')}'${getWcagReference(tags)}'`;
            const axeRuleId = `${bold('id: ')}'${id}'`;
            const summary = `   ${bold('description: ')}${description}`;
            const name = `   ${bold('name: ')}${help}`;
            const learnMore = `${bold('learn more: ')}${helpUrl}`;
            const nodeDetails = `${bold('   Affected elements:')}\n`.concat(
                nodes
                    .map(({ target, html }) => {
                        const targetNodes = target.map((node) => `"${node}"`).join(', ');
                        return `\tSelector: ${targetNodes}\tSource code: ${html}`;
                    })
                    .join('\n')
            );

            return `${
                i + 1
            }. ${axeRuleId}\t${learnMore}\n${name}\n${summary}\n${wcagRef}\n${nodeDetails}\n`;
        })
        .join('\n');

    return {
        violationsTotal,
        violationsSummaryTable,
        violationsDetailsFormatted,
        checksPassedSummary,
    };
}
