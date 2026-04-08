import * as vscode from 'vscode';
import { exportFile } from './commands/exportFile';
import { exportSelection } from './commands/exportSelection';

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'mermaid-to-png.exportFile',
            (uri?: vscode.Uri) => exportFile(uri)
        ),
        vscode.commands.registerCommand(
            'mermaid-to-png.exportSelection',
            () => exportSelection()
        )
    );
}

export function deactivate(): void {
    // nothing to clean up
}
