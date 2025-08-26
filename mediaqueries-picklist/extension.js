const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.showMediaQueries', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Abre un archivo CSS/SCSS primero');
            return;
        }

        const document = editor.document;
        const text = document.getText();

        // Regex para capturar @media queries
        const mediaRegex = /@media[^{]+{/g;
        const matches = Array.from(text.matchAll(mediaRegex)).map(m => m[0].replace('{','').trim());

        if (matches.length === 0) {
            vscode.window.showInformationMessage('No se encontraron @media queries');
            return;
        }

        // Mostrar un QuickPick (desplegable)
        const selected = await vscode.window.showQuickPick(matches, {
            placeHolder: 'Selecciona una media query'
        });

        if (selected) {
            // Mover el cursor a la media query seleccionada
            const position = text.indexOf(selected);
            if (position >= 0) {
                const startPos = document.positionAt(position);
                editor.selection = new vscode.Selection(startPos, startPos);
                editor.revealRange(new vscode.Range(startPos, startPos));
            }
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};