"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.when = void 0;
const util_1 = require("../lib/util");
async function when(action, parameters, { id, level, fullConfig, runner, logger }) {
    (0, util_1.fn_check_params)(parameters, { exactCount: 2 });
    const [testClause, actionWhenTrue] = parameters;
    const condition = await runner.eval(testClause, fullConfig, { level, logger });
    logger.debug(`when: condition: ` + JSON.stringify(condition));
    if (condition) {
        return await runner.eval(actionWhenTrue, fullConfig, { level, logger });
    }
}
exports.when = when;
exports.default = when;
//# sourceMappingURL=when.js.map