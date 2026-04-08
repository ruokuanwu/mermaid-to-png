import * as vscode from 'vscode';
import { exportFile } from './commands/exportFile';
import { exportSelection } from './commands/exportSelection';
import { exportMarkdown } from './commands/exportMarkdown';

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'mermaid-to-png.exportFile',
            (uri?: vscode.Uri) => exportFile(uri)
        ),
        vscode.commands.registerCommand(
            'mermaid-to-png.exportSelection',
            () => exportSelection()
        ),
        vscode.commands.registerCommand(
            'mermaid-to-png.exportMarkdown',
            (uri?: vscode.Uri) => exportMarkdown(uri)
        )
    );
}

export function deactivate(): void {
    // nothing to clean up
}
