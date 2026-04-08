import * as vscode from 'vscode';
import { spawn } from 'child_process';

export interface MmdcOptions {
    mmdcPath: string;
    theme: string;
    background: string;
}

export function getMmdcOptions(): MmdcOptions {
    const cfg = vscode.workspace.getConfiguration('mermaid-to-png');
    return {
        mmdcPath: cfg.get<string>('mmdcPath') || 'mmdc',
        theme: cfg.get<string>('theme') || 'default',
        background: cfg.get<string>('background') || 'white',
    };
}

/**
 * Run mmdc with the given args. Resolves on exit code 0, rejects with stderr on failure.
 */
export function runMmdc(
    mmdcPath: string,
    args: string[]
): Promise<void> {
    return new Promise((resolve, reject) => {
        // Split "npx mmdc" style paths into command + prepended args
        const parts = mmdcPath.trim().split(/\s+/);
        const cmd = parts[0];
        const cmdArgs = [...parts.slice(1), ...args];

        const child = spawn(cmd, cmdArgs, { shell: false });

        let stderr = '';
        child.stderr.on('data', (chunk: Buffer) => {
            stderr += chunk.toString();
        });

        child.on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'ENOENT') {
                reject(
                    new Error(
                        `Cannot find mmdc executable: "${mmdcPath}".\n` +
                        `Install mermaid-cli globally: npm install -g @mermaid-js/mermaid-cli\n` +
                        `Or set the correct path in settings: mermaid-to-png.mmdcPath`
                    )
                );
            } else {
                reject(err);
            }
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`mmdc exited with code ${code}.\n${stderr.trim()}`));
            }
        });
    });
}
