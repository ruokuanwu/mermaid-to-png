import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto';
import { getMmdcOptions, runMmdc } from '../utils/findMmdc';

const MERMAID_FENCE_RE = /^[ \t]*```mermaid\r?\n([\s\S]*?)^[ \t]*```[ \t]*$/gm;

/**
 * Export all Mermaid code blocks in a Markdown file to individual PNG files.
 * @param uri  URI passed by the explorer/editor context menu, or undefined when
 *             triggered via the command palette (falls back to active editor).
 */
export async function exportMarkdown(uri?: vscode.Uri): Promise<void> {
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
    if (path.extname(sourcePath).toLowerCase() !== '.md') {
        vscode.window.showErrorMessage('Please select a Markdown (.md) file.');
        return;
    }

    // Read file content
    let content: string;
    try {
        content = fs.readFileSync(sourcePath, 'utf8');
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to read file: ${(err as Error).message}`);
        return;
    }

    // Extract all mermaid blocks
    const blocks: string[] = [];
    let match: RegExpExecArray | null;
    MERMAID_FENCE_RE.lastIndex = 0;
    while ((match = MERMAID_FENCE_RE.exec(content)) !== null) {
        blocks.push(match[1].trim());
    }

    if (blocks.length === 0) {
        vscode.window.showInformationMessage('No Mermaid code blocks found in the file.');
        return;
    }

    // Determine output dir
    const cfg = vscode.workspace.getConfiguration('mermaid-to-png');
    const outputDirSetting = cfg.get<string>('outputDir')?.trim();
    const sourceDir = path.dirname(sourcePath);
    const outputDir = outputDirSetting
        ? (path.isAbsolute(outputDirSetting) ? outputDirSetting : path.resolve(sourceDir, outputDirSetting))
        : sourceDir;

    const mdBaseName = path.basename(sourcePath, path.extname(sourcePath));
    const opts = getMmdcOptions();
    const tmpDir = os.tmpdir();

    const outputPaths: string[] = [];
    const errors: string[] = [];

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: `Exporting Mermaid diagrams from ${path.basename(sourcePath)}…`,
            cancellable: false,
        },
        async (progress) => {
            for (let i = 0; i < blocks.length; i++) {
                const diagramIndex = i + 1;
                progress.report({
                    message: `Diagram ${diagramIndex} / ${blocks.length}`,
                    increment: (1 / blocks.length) * 100,
                });

                const tmpPath = path.join(tmpDir, `mermaid-${crypto.randomUUID()}.mmd`);
                const outputPath = path.join(outputDir, `${mdBaseName}-diagram-${diagramIndex}.png`);

                try {
                    fs.writeFileSync(tmpPath, blocks[i], 'utf8');
                } catch (err) {
                    errors.push(`Diagram ${diagramIndex}: Failed to write temp file — ${(err as Error).message}`);
                    continue;
                }

                try {
                    await runMmdc(opts.mmdcPath, [
                        '-i', tmpPath,
                        '-o', outputPath,
                        '-t', opts.theme,
                        '-b', opts.background,
                        '--scale', String(opts.scale),
                    ]);
                    outputPaths.push(outputPath);
                } catch (err) {
                    errors.push(`Diagram ${diagramIndex}: ${(err as Error).message}`);
                } finally {
                    try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
                }
            }
        }
    );

    if (errors.length > 0) {
        vscode.window.showErrorMessage(
            `Some diagrams failed to export:\n${errors.join('\n')}`
        );
    }

    if (outputPaths.length > 0) {
        const label = outputPaths.length === 1
            ? `Exported 1 diagram to: ${outputPaths[0]}`
            : `Exported ${outputPaths.length} diagrams to: ${outputDir}`;

        const action = await vscode.window.showInformationMessage(label, 'Reveal in Explorer');
        if (action === 'Reveal in Explorer') {
            await vscode.commands.executeCommand(
                'revealFileInOS',
                vscode.Uri.file(outputPaths[0])
            );
        }
    }
}
