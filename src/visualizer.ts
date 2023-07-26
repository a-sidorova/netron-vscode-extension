import * as vscode from 'vscode';
import * as path from 'path';
import * as subprocess from 'child_process';
import * as kill from 'tree-kill';
import * as os from 'os';


export class Visualizer {
    public static currentPanel: Visualizer | undefined;
    public static readonly viewType = 'Netron';

    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private _pid = 0;

    public static open(resource: vscode.Uri) {
        console.log('The Netron Open has been called for the file ', resource.path);
        Visualizer.currentPanel = new Visualizer(resource);
    }

    private constructor(resource: vscode.Uri) {
        const model_name = path.basename(resource.path);
        this._panel = this.init(model_name);
        this.render(resource);
    }

    private init(model_name: string): vscode.WebviewPanel {
        const tab_name = "[Netron] " + model_name;
        let panel = vscode.window.createWebviewPanel('netron', tab_name,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );

        panel.onDidDispose(
            () => {
                Visualizer.currentPanel = undefined;
                if (this._pid > 0) {
                    kill(this._pid);
                    console.log("The Netron process " + this._pid +" has been killed");
                }
            },
            null,
            this._disposables
          );

        return panel;
    }

    private getPath(resource: vscode.Uri): string {
        let path = resource.path;
        // Remove slash from first symbol
        if (os.type() == "Windows_NT")
            path = path.slice(1);
        return path;
    }

    private render(resource: vscode.Uri) {
        const model_path = this.getPath(resource);
        const netron = subprocess.spawn('netron', [model_path]);
        netron.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(output);
            if (typeof netron.pid == "number") {
                this._pid = netron.pid;
                const url_path = output.split('\' at ')[1];
                console.log('Netron server is opened by address: ', url_path);
                this._panel.webview.html = this.getHTMLForWebview(url_path);
            } else {
                this._panel.webview.postMessage({ command : 'alert', text : 'Netron has not been opened!'});
            }
        });
    }

    private getHTMLForWebview(url: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Model Visualization</title>
            </head>
            <body>
                <iframe
                    width="100%"
                    height="800" 
                    src="${url}"
                ></iframe>
            </body>
            </html>`;
    }
}
