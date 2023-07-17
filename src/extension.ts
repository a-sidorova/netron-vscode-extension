import * as vscode from 'vscode';
import { Visualizer } from './visualizer';


export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('netron-vscode-ext.open', (resource: vscode.Uri) => {
        Visualizer.open(resource);
    }));
}
