import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getMmdcOptions, runMmdc } from '../utils/findMmdc';

/**
 * Export a .mmd file to PNG.
 * @param uri  URI passed by the explorer/editor context menu, or undefined when
 *             triggered via the command palette (falls back to active editor).
 */
export async function exportFile(uri?: vscode.Uri): Promise<void> {
    // Resolve the source file URI
    let sourceUri = uri;
    if (!sourceUri) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file selected and no active editor found.');
            return;
        }
        sourceUri = editor.document.uri;
    }

    if (sourceUri.scheme !== 'file') {
        vscode.window.showErrorMessage('Only local files are supported.');
        return;
    }

    const sourcePath = sourceUri.fsPath;
    if (path.extname(sourcePath).toLowerCase() !== '.mmd') {
        vscode.window.showErrorMessage('Please select a .mmd file.');
        return;
    }

    // Determine output path
    const outputPath = resolveOutputPath(sourcePath);

    const opts = getMmdcOptions();

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: `Exporting ${path.basename(sourcePath)} to PNG…`,
            cancellable: false,
        },
        async () => {
            try {
                await runMmdc(opts.mmdcPath, [
                    '-i', sourcePath,
                    '-o', outputPath,
                    '-t', opts.theme,
                    '-b', opts.background,
                ]);
                await showSuccess(outputPath);
            } catch (err) {
                vscode.window.showErrorMessage(
                    `Mermaid export failed: ${(err as Error).message}`
                );
            }
        }
    );
}

function resolveOutputPath(sourcePath: string): string {
    const cfg = vscode.workspace.getConfiguration('mermaid-to-png');
    const outputDir = cfg.get<string>('outputDir')?.trim();

    const dir = outputDir
        ? (path.isAbsolute(outputDir) ? outputDir : path.resolve(path.dirname(sourcePath), outputDir))
        : path.dirname(sourcePath);

    const baseName = path.basename(sourcePath, path.extname(sourcePath));
    return path.join(dir, `${baseName}.png`);
}

async function showSuccess(outputPath: string): Promise<void> {
    const action = await vscode.window.showInformationMessage(
        `Exported to: ${outputPath}`,
        'Reveal in Explorer'
    );
    if (action === 'Reveal in Explorer') {
        await vscode.commands.executeCommand(
            'revealFileInOS',
            vscode.Uri.file(outputPath)
        );
    }
}

// Export helper for reuse in exportSelection
export { resolveOutputPath, showSuccess };
