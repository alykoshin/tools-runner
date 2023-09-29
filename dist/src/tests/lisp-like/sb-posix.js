"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    base_dir: './demo',
    version: '2.5.22',
    actions: {
        default: [
            'list',
            ['print',
                ['setq', 'orig_path',
                    ['getcwd']]],
            ['chdir', '/'],
            ['print',
                ['getcwd']],
            ['chdir', '${orig_path}'],
            ['print',
                ['getcwd']],
        ],
    },
};
exports.default = exports.config;
//# sourceMappingURL=sb-posix.js.map