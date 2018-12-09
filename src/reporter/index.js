import * as prq from 'https://cdn.jsdelivr.net/npm/promisesque@0.2.0/src/index.js';
import * as u from './utils.js';

export default function createReporter(ast, validatorFn) {
    function reporterFn(types, position = 0) {
        return (values, generics = {}) => {
            const lengthReport = u.validateLength(ast, types, values, generics);

            if (lengthReport) {
                return void u.throwPrettyError(u.errorTypes.LENGTH_MISMATCH, ast, lengthReport);
            }

            const result = types.reduce(
                (accum, types, index) => {
                    const value = values[index];
                    return prq.get(accum, accum => {
                        const report = validatorFn(types, value, accum.generics);
                        return prq.get(report, report => ({
                            reports: [...accum.reports, { ...report, position: position + index }],
                            generics: { ...accum.generics, ...report.generics }
                        }));
                    });
                },
                { reports: [], generics }
            );

            return prq.get(result, result => {
                const invalidReport = result.reports.find(report => !report.valid);
                return invalidReport
                    ? void u.throwPrettyError(u.errorTypes.TYPE_MISMATCH, ast, invalidReport)
                    : position === 0
                    ? (value, generics) =>
                          reporterFn(u.getOutputTypes(ast.types), ast.types.length - 1)([value], generics)
                    : null;
            });
        };
    }

    return reporterFn(u.getInputTypes(ast.types));
}
