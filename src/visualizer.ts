import * as vscode from 'vscode';
import * as path from 'path';
import { pythonBridge } from 'python-bridge';


export class Visualizer {
    public static currentPanel: Visualizer | undefined;
    public static readonly viewType = 'Netron';

    private static python = pythonBridge({stdio: ['pipe', 'pipe', 'pipe'],});

    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static open(resource: vscode.Uri) {
        console.log('The Netron Open has been called for the file ', resource.path);
        Visualizer.currentPanel = new Visualizer(resource);
    }

    private constructor(resource: vscode.Uri) {
        const model_name = path.basename(resource.path);
        this._panel = this.initPanel(model_name);
        this.initPython();
        this.render(resource);
    }

    private initPanel(model_name: string): vscode.WebviewPanel {
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

        return panel;
    }

    private initPython() {
        Visualizer.python.ex`
        import sys
        import platform
        def install_deps():
          try:
              from pip._internal.cli.main import main
              main(['install', 'netron'])
              return '0'
          except:
              return '-1'

        def visualize(path):
            import netron
            if platform.system() == 'Windows':
                path = path.lstrip('/')
            address, port = netron.start(path, browse=False)
            return 'http://' + str(address) + ':' + str(port)
        `;

        Visualizer.python`install_deps()`.then(ret => {
            console.log('Installation of dependencies has been finished with returned code: ', ret); 
        });
    }

    private async render(resource: vscode.Uri) {
        const url_path = await Visualizer.python`visualize(${resource.path})`;
        console.log('Netron server is opened by address: ', url_path);
        this._panel.webview.html = this.getHTMLForWebview(url_path);
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
                    width="1200"
                    height="1600" 
                    src="${url}"
                ></iframe>
            </body>
            </html>`;
    }
}
