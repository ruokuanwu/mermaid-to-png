import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto';
import { getMmdcOptions, runMmdc } from '../utils/findMmdc';
import { showSuccess } from './exportFile';

export async function exportSelection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showErrorMessage('No text selected. Please select Mermaid diagram code first.');
        return;
    }

    const rawText = editor.document.getText(selection);
    // Strip markdown code fence (```mermaid ... ```) if present
    const selectedText = rawText.replace(/^```(?:mermaid)?\r?\n([\s\S]*?)\r?\n```\s*$/, '$1').trim();

    // Write selection to a temp file
    const tmpDir = os.tmpdir();
    const tmpName = `mermaid-${crypto.randomUUID()}.mmd`;
    const tmpPath = path.join(tmpDir, tmpName);

    try {
        fs.writeFileSync(tmpPath, selectedText, 'utf8');
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to create temp file: ${(err as Error).message}`);
        return;
    }

    // Determine output path relative to the source document
    const docUri = editor.document.uri;
    const outputPath = resolveSelectionOutputPath(docUri);

    const opts = getMmdcOptions();

    let exportError: Error | undefined;
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'Exporting selected Mermaid diagram to PNG…',
            cancellable: false,
        },
        async () => {
            try {
                await runMmdc(opts.mmdcPath, [
                    '-i', tmpPath,
                    '-o', outputPath,
                    '-t', opts.theme,
                    '-b', opts.background,
                    '--scale', String(opts.scale),
                ]);
            } catch (err) {
                exportError = err as Error;
            } finally {
                // Always clean up the temp file
                try {
                    fs.unlinkSync(tmpPath);
                } catch {
                    // ignore cleanup errors
                }
            }
        }
    );

    if (exportError) {
        vscode.window.showErrorMessage(`Mermaid export failed: ${exportError.message}`);
    } else {
        await showSuccess(outputPath);
    }
}

/**
 * Resolve a unique output path for a selection export.
 * If the document is a .mmd file, use the same base name.
 * Otherwise use "diagram.png", incrementing to avoid overwrites.
 */
function resolveSelectionOutputPath(docUri: vscode.Uri): string {
    const cfg = vscode.workspace.getConfiguration('mermaid-to-png');
    const outputDirSetting = cfg.get<string>('outputDir')?.trim();

    let sourceDir: string;
    let baseName: string;

    if (docUri.scheme === 'file') {
        sourceDir = path.dirname(docUri.fsPath);
        const ext = path.extname(docUri.fsPath).toLowerCase();
        baseName = ext === '.mmd'
            ? path.basename(docUri.fsPath, ext)
            : path.basename(docUri.fsPath, path.extname(docUri.fsPath));
    } else {
        // Untitled / virtual document — fall back to home directory
        sourceDir = os.homedir();
        baseName = 'diagram';
    }

    const dir = outputDirSetting
        ? (path.isAbsolute(outputDirSetting) ? outputDirSetting : path.resolve(sourceDir, outputDirSetting))
        : sourceDir;

    return findAvailablePath(dir, baseName);
}

/**
 * Return `dir/baseName.png` if it does not exist,
 * otherwise `dir/baseName_1.png`, `dir/baseName_2.png`, …
 */
function findAvailablePath(dir: string, baseName: string): string {
    const candidate = path.join(dir, `${baseName}.png`);
    if (!fs.existsSync(candidate)) {
        return candidate;
    }

    let index = 1;
    while (true) {
        const indexed = path.join(dir, `${baseName}_${index}.png`);
        if (!fs.existsSync(indexed)) {
            return indexed;
        }
        index++;
    }
}
